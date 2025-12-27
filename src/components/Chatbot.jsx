import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useLocation } from 'react-router-dom'; // Import location hook
import './Chatbot.css';

export default function Chatbot() {
    // 1. Get current route to check if we are on an Admin page
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    // 2. Set default to TRUE so it opens immediately
    const [isOpen, setIsOpen] = useState(true);
    
    const [messages, setMessages] = useState([
        { text: "Welcome to West End Market! 🏪 I can check stock, prices, or store hours for you. What do you need?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // ---------------------------------------------------------
    // ENV VARIABLE FOR SECURITY
    // ---------------------------------------------------------
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
    
    // Using the newer 2.5 model or falling back to 'gemini-pro'
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
        setInput("");
        setLoading(true);

        try {
            const docRef = doc(db, "settings", "chatbot");
            const docSnap = await getDoc(docRef);
            
            let systemInstruction = "You are a helpful assistant for West End Market.";
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                const mainPrompt = data.mainPrompt || "";
                const tempPrompts = data.tempPrompts 
                    ? data.tempPrompts.map(p => p.text).join("\n") 
                    : "";
                
                systemInstruction = `
                    You are a customer service AI for West End Market at 74 Staniford St, Boston.
                    
                    Here is the STORE DATA and RULES:
                    ${mainPrompt}

                    IMPORTANT ALERTS/NEWS:
                    ${tempPrompts}

                    Be concise, friendly, and helpful.
                `;
            }

            const chat = model.startChat({
                history: [
                    { role: "user", parts: [{ text: systemInstruction }] },
                    { role: "model", parts: [{ text: "Understood." }] },
                ],
            });

            const result = await chat.sendMessage(userMessage);
            const response = result.response.text();

            setMessages(prev => [...prev, { text: response, sender: "bot" }]);

        } catch (error) {
            console.error("Error generating response:", error);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the store right now.", sender: "bot" }]);
        }

        setLoading(false);
    };

    // 3. If it's an admin page, return NULL (render nothing)
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
                        {/* Minimize button instead of close */}
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
                            placeholder="Ask about items..."
                            autoFocus // Focus input automatically
                        />
                        <button onClick={handleSend}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
}