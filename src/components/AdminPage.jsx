import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
    doc, getDoc, setDoc, 
    collection, onSnapshot, updateDoc, deleteDoc, addDoc, query, orderBy, serverTimestamp 
} from "firebase/firestore";

export default function AdminPage() {
    // --- CHATBOT SETTINGS STATE ---
    const [mainPrompt, setMainPrompt] = useState("");
    const [tempPrompts, setTempPrompts] = useState([]);
    const [newTempText, setNewTempText] = useState("");
    const [status, setStatus] = useState("");

    // --- INBOX STATE ---
    const [inboxItems, setInboxItems] = useState([]);
    const [filter, setFilter] = useState("active"); // 'active' or 'history'
    const [newTodo, setNewTodo] = useState("");

    // 1. Fetch Chatbot Settings (One-time fetch)
    useEffect(() => {
        const fetchSettings = async () => {
            const docRef = doc(db, "settings", "chatbot");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setMainPrompt(data.mainPrompt || "");
                setTempPrompts(data.tempPrompts || []);
            }
        };
        fetchSettings();
    }, []);

    // 2. Real-time Listener for Inbox Items
    useEffect(() => {
        const q = query(collection(db, "store_inbox"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setInboxItems(items);
        });
        return () => unsubscribe();
    }, []);

    // --- CHATBOT FUNCTIONS ---
    const handleSaveSettings = async () => {
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
        setTempPrompts([...tempPrompts, { id: Date.now(), text: newTempText }]);
        setNewTempText("");
    };

    const handleRemoveTemp = (id) => setTempPrompts(tempPrompts.filter(t => t.id !== id));

    // --- INBOX FUNCTIONS ---
    
    // Manual Todo Add
    const handleAddTodo = async () => {
        if (!newTodo.trim()) return;
        try {
            await addDoc(collection(db, "store_inbox"), {
                text: newTodo,
                type: 'todo',
                status: 'active',
                source: 'admin',
                createdAt: serverTimestamp()
            });
            setNewTodo("");
        } catch (e) {
            console.error("Error adding todo:", e);
        }
    };

    // Mark as Completed (Move to History)
    const handleMarkDone = async (id) => {
        const itemRef = doc(db, "store_inbox", id);
        await updateDoc(itemRef, { status: 'completed' });
    };

    // Permanently Delete (Trash)
    const handleDeletePermanent = async (id) => {
        if(window.confirm("Are you sure you want to permanently delete this?")) {
            await deleteDoc(doc(db, "store_inbox", id));
        }
    };

    // Filter Logic
    const displayedItems = inboxItems.filter(item => {
        if (filter === 'active') return item.status === 'active';
        if (filter === 'history') return item.status === 'completed';
        return true;
    });

    // Helper for colors
    const getTypeColor = (type) => {
        switch(type) {
            case 'complaint': return '#ffcccc'; // light red
            case 'todo': return '#ffffcc'; // light yellow
            case 'feedback': return '#ccffcc'; // light green
            default: return '#f0f0f0';
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1>Admin Dashboard</h1>

            {/* --- TOP SECTION: INBOX & TASKS --- */}
            <div style={{ marginBottom: '40px', border: '2px solid #333', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#333', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{margin:0}}>Store Inbox & Tasks</h2>
                    <div>
                        <button 
                            onClick={() => setFilter('active')}
                            style={{ 
                                background: filter === 'active' ? 'white' : 'transparent', 
                                color: filter === 'active' ? 'black' : 'white',
                                border: 'none', padding: '8px 16px', cursor: 'pointer', marginRight: '5px', borderRadius: '4px'
                            }}
                        >
                            Active
                        </button>
                        <button 
                            onClick={() => setFilter('history')}
                            style={{ 
                                background: filter === 'history' ? 'white' : 'transparent', 
                                color: filter === 'history' ? 'black' : 'white',
                                border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            History (Trash)
                        </button>
                    </div>
                </div>

                <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
                    {/* Add Manual Todo Input */}
                    {filter === 'active' && (
                        <div style={{ display: 'flex', marginBottom: '20px' }}>
                            <input 
                                type="text" 
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="Add a quick task manually..."
                                style={{ flex: 1, padding: '10px', fontSize: '1rem' }}
                            />
                            <button onClick={handleAddTodo} style={{ padding: '10px 20px', backgroundColor: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Add To-Do
                            </button>
                        </div>
                    )}

                    {/* List Items */}
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {displayedItems.length === 0 && <p style={{color:'#777'}}>No items found.</p>}
                        
                        {displayedItems.map(item => (
                            <div key={item.id} style={{
                                backgroundColor: 'white',
                                borderLeft: `5px solid ${getTypeColor(item.type)}`,
                                padding: '15px',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <span style={{ 
                                        fontWeight: 'bold', 
                                        textTransform: 'uppercase', 
                                        fontSize: '0.8rem',
                                        backgroundColor: getTypeColor(item.type),
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        marginRight: '10px'
                                    }}>
                                        {item.type}
                                    </span>
                                    <span style={{ fontSize: '1.1rem' }}>{item.text}</span>
                                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                                        {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                    </div>
                                </div>

                                <div>
                                    {filter === 'active' ? (
                                        <button 
                                            onClick={() => handleMarkDone(item.id)}
                                            style={{ background: 'green', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            ✓ Done
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleDeletePermanent(item.id)}
                                            style={{ background: 'red', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            🗑 Delete Forever
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- BOTTOM SECTION: CHATBOT BRAIN --- */}
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{marginTop: 0}}>Chatbot Knowledge Base</h2>
                
                {/* Main Data */}
                <div style={{ marginBottom: '20px' }}>
                    <h3>Permanent Store Data</h3>
                    <textarea 
                        value={mainPrompt}
                        onChange={(e) => setMainPrompt(e.target.value)}
                        rows="6"
                        style={{ width: '100%', padding: '10px' }}
                        placeholder="Store rules, product locations, etc..."
                    />
                </div>

                {/* Temporary Alerts */}
                <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                    <h3>Temporary Alerts</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input 
                            value={newTempText} 
                            onChange={(e) => setNewTempText(e.target.value)}
                            placeholder="e.g. Closing early today..."
                            style={{ flex: 1, padding: '8px' }}
                        />
                        <button onClick={handleAddTemp}>Add</button>
                    </div>
                    {tempPrompts.map(t => (
                        <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span>- {t.text}</span>
                            <button onClick={() => handleRemoveTemp(t.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>x</button>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={handleSaveSettings} 
                    style={{ width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer' }}
                >
                    Save Knowledge Base
                </button>
                <p style={{ textAlign: 'center', marginTop: '10px', color: 'green' }}>{status}</p>
            </div>
        </div>
    );
}