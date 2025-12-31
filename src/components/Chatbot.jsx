import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { doc, getDoc, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore"; 
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';
import './Chatbot.css';

export default function Chatbot() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');
    const [isOpen, setIsOpen] = useState(true);
    
    // Store the formatted inventory string here so we don't fetch it 100 times
    const [inventoryContext, setInventoryContext] = useState(""); 

    const [messages, setMessages] = useState([
        { text: "Welcome to West End Market! 🏪 Ask me what products we carry.", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // --- 1. OPTIMIZATION: FETCH ONCE ON LOAD ---
    useEffect(() => {
        const initChatbot = async () => {
            try {
                // Fetch Products (Only Name & Category)
                const querySnapshot = await getDocs(collection(db, "products"));
                const list = querySnapshot.docs.map(doc => {
                    const d = doc.data();
                    // SIMPLIFIED: No price, no stock. Just name and category.
                    return `- ${d.name} (${d.category})`; 
                }).join("\n");
                
                setInventoryContext(list);
            } catch (error) {
                console.error("Error loading inventory:", error);
            }
        };

        if (!isAdminPage) {
            initChatbot();
        }
    }, [isAdminPage]); // Runs only when component mounts

    const saveToInbox = async (text, type) => {
        try {
            await addDoc(collection(db, "store_inbox"), {
                text: text,
                type: type.toLowerCase(),
                status: 'active',
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error saving to inbox:", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
        setInput("");
        setLoading(true);

        try {
            // Fetch Rules (These change rarely, but we'll fetch to keep rules fresh-ish. 
            // You could optimize this too, but it's less heavy than products.)
            const docRef = doc(db, "settings", "chatbot");
            const docSnap = await getDoc(docRef);
            
            let storeDataPrompt = "";
            let alertsPrompt = "";
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                storeDataPrompt = data.mainPrompt || "";
                alertsPrompt = data.tempPrompts 
                    ? data.tempPrompts.map(p => p.text).join("\n") 
                    : "";
            }

            // --- 2. UPDATED BRAIN (Simpler) ---
            const systemInstruction = `
                You are a customer service AI for West End Market.
                
                === PRODUCTS WE CARRY ===
                ${inventoryContext}
                
                === STORE INFO ===
                ${storeDataPrompt}
                ${alertsPrompt}

                **RULES:**
                1. **Product Availability:**
                   - Check the "PRODUCTS WE CARRY" list.
                   - If user asks for an item and it IS on the list -> Say "Yes, we carry [Item Name]."
                   - If it is NOT on the list -> Say "I don't see that in our current inventory."
                   - DO NOT invent prices or stock numbers.

                2. **Categorization Tags:**
                   - [COMPLAINT]: User is unhappy or reports missing item.
                   - [FEEDBACK]: Positive reviews.
                   - [TODO] / [NOTE]: Employee commands.

                Response Style: Simple and helpful.
            `;

            const chat = model.startChat({
                history: [
                    { role: "user", parts: [{ text: systemInstruction }] },
                    { role: "model", parts: [{ text: "Understood." }] },
                ],
            });

            const result = await chat.sendMessage(userMessage);
            const rawResponse = result.response.text();
            
            let finalResponse = rawResponse;
            const tags = ["[COMPLAINT]", "[FEEDBACK]", "[TODO]", "[NOTE]"];
            
            for (const tag of tags) {
                if (rawResponse.includes(tag)) {
                    finalResponse = rawResponse.replace(tag, "").trim();
                    const type = tag.replace("[", "").replace("]", "");
                    await saveToInbox(userMessage, type);
                    break; 
                }
            }

            setMessages(prev => [...prev, { text: finalResponse, sender: "bot" }]);

        } catch (error) {
            console.error("Error generating response:", error);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting.", sender: "bot" }]);
        }

        setLoading(false);
    };

    if (isAdminPage) return null;

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open-mode' : 'closed-mode'}`}>
            {!isOpen && (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                    💬
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <span>West End Assistant</span>
                        <button onClick={() => setIsOpen(false)}>_</button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="message bot">Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input">
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Do you have..."
                            autoFocus 
                        />
                        <button onClick={handleSend}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
}