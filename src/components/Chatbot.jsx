import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"; // Added collection, addDoc
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';
import './Chatbot.css';

export default function Chatbot() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');
    const [isOpen, setIsOpen] = useState(true);
    
    const [messages, setMessages] = useState([
        { text: "Welcome to West End Market! 🏪 I can check stock, prices, or store hours for you.", sender: "bot" }
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

    // NEW: Function to save tasks/feedback to Firebase
    const saveToInbox = async (text, type) => {
        try {
            await addDoc(collection(db, "store_inbox"), {
                text: text,
                type: type.toLowerCase(), // 'complaint', 'feedback', 'todo', 'note'
                status: 'active',
                createdAt: serverTimestamp()
            });
            console.log(`Saved ${type}: ${text}`);
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

            // --- UPDATED SYSTEM INSTRUCTION ---
            const systemInstruction = `
                You are a customer service AI for West End Market.
                
                STORE DATA: ${storeDataPrompt}
                ALERTS: ${alertsPrompt}

                **CRITICAL: CATEGORIZATION RULES**
                You MUST start your response with a TAG if the user's message fits these categories.
                
                1. [COMPLAINT]: 
                   - User is unhappy (service, cleanliness, price).
                   - **User reports an item is OUT OF STOCK or MISSING (e.g., "There is no milk", "Milk is not available").**
                
                2. [FEEDBACK]: 
                   - Positive reviews, suggestions, or general thoughts on the store.
                
                3. [TODO] (Employee Only): 
                   - ONLY if user says "I am staff/employee" AND gives a task (e.g., "Clean aisle 4").
                
                4. [NOTE] (Employee Only): 
                   - ONLY if user says "I am staff/employee" AND leaves a note.

                **Response Style:**
                - If you use a tag, acknowledge the issue briefly and kindly.
                - If the user says something is missing/unavailable, Tag it as [COMPLAINT] and apologize.
                
                Example 1:
                User: "Milk is not available."
                Bot: "[COMPLAINT] I apologize for the inconvenience. I have noted that we are out of milk."

                Example 2:
                User: "Great service today!"
                Bot: "[FEEDBACK] Thank you! We love hearing that."
            `;

            const chat = model.startChat({
                history: [
                    { role: "user", parts: [{ text: systemInstruction }] },
                    { role: "model", parts: [{ text: "Understood. I will categorize stock issues as [COMPLAINT]." }] },
                ],
            });

            const result = await chat.sendMessage(userMessage);
            const rawResponse = result.response.text();
            
            let finalResponse = rawResponse;
            
            // CHECK FOR TAGS AND SAVE TO FIREBASE
            const tags = ["[COMPLAINT]", "[FEEDBACK]", "[TODO]", "[NOTE]"];
            
            for (const tag of tags) {
                if (rawResponse.includes(tag)) {
                    // Remove the tag from the message shown to the user
                    finalResponse = rawResponse.replace(tag, "").trim();
                    
                    // Save the USER'S message (the complaint) to the database
                    const type = tag.replace("[", "").replace("]", "");
                    await saveToInbox(userMessage, type);
                    break; 
                }
            }

            setMessages(prev => [...prev, { text: finalResponse, sender: "bot" }]);

        } catch (error) {
            console.error("Error generating response:", error);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: "bot" }]);
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
                            placeholder="Ask or type 'I am staff'..."
                            autoFocus 
                        />
                        <button onClick={handleSend}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
}