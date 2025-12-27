import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function AdminPage() {
    const [mainPrompt, setMainPrompt] = useState("");
    const [tempPrompts, setTempPrompts] = useState([]);
    const [newTempText, setNewTempText] = useState("");
    const [status, setStatus] = useState("");

    // Load data from Firebase when page opens
    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "settings", "chatbot");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setMainPrompt(data.mainPrompt || "");
                setTempPrompts(data.tempPrompts || []);
            }
        };
        fetchData();
    }, []);

    // Save everything to Firebase
    const handleSave = async () => {
        setStatus("Saving...");
        try {
            await setDoc(doc(db, "settings", "chatbot"), {
                mainPrompt: mainPrompt,
                tempPrompts: tempPrompts
            });
            setStatus("Saved successfully!");
            setTimeout(() => setStatus(""), 2000);
        } catch (e) {
            setStatus("Error saving: " + e.message);
        }
    };

    const handleAddTemp = () => {
        if (!newTempText) return;
        const newEntry = { id: Date.now(), text: newTempText };
        setTempPrompts([...tempPrompts, newEntry]);
        setNewTempText("");
    };

    const handleRemoveTemp = (id) => {
        setTempPrompts(tempPrompts.filter(t => t.id !== id));
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1>Admin Dashboard: Chatbot Control</h1>
            
            {/* Section 1: Main Data (Product List) */}
            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h3>Main Store Data (The Dictionary)</h3>
                <p style={{fontSize: '0.9rem', color: '#666'}}>
                    Paste your product list, store hours, and return policies here. 
                    The AI will use this as its main knowledge base.
                </p>
                <textarea 
                    value={mainPrompt}
                    onChange={(e) => setMainPrompt(e.target.value)}
                    rows="10"
                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
                    placeholder="Example: { 'Milk': '$4.00', 'Bread': 'Aisle 3' }..."
                />
            </div>

            {/* Section 2: Temporary Blocks */}
            <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <h3>Temporary Alerts</h3>
                <p style={{fontSize: '0.9rem', color: '#666'}}>
                    Add special announcements here (e.g., "Open on Christmas"). 
                    Click "Remove" to delete them instantly.
                </p>
                
                <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                    <input 
                        type="text" 
                        value={newTempText}
                        onChange={(e) => setNewTempText(e.target.value)}
                        placeholder="e.g. We are OPEN on Christmas Day until 5 PM!"
                        style={{flex: 1, padding: '8px'}}
                    />
                    <button onClick={handleAddTemp} style={{padding: '8px 16px', backgroundColor: 'black', color: 'white', border: 'none', cursor: 'pointer'}}>
                        Add Block
                    </button>
                </div>

                <div>
                    {tempPrompts.map(item => (
                        <div key={item.id} style={{ 
                            background: 'white', 
                            border: '1px solid #ddd', 
                            padding: '10px', 
                            marginBottom: '8px', 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>{item.text}</span>
                            <button 
                                onClick={() => handleRemoveTemp(item.id)}
                                style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold'}}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    {tempPrompts.length === 0 && <p style={{fontStyle: 'italic', color: '#999'}}>No active alerts.</p>}
                </div>
            </div>

            <button 
                onClick={handleSave} 
                style={{ 
                    padding: '15px 30px', 
                    fontSize: '1.2rem', 
                    backgroundColor: 'green', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    width: '100%'
                }}
            >
                Save All Changes
            </button>
            <p style={{textAlign: 'center', fontWeight: 'bold', marginTop: '10px'}}>{status}</p>
        </div>
    );
}