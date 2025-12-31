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
    const [filter, setFilter] = useState("active");
    const [newTodo, setNewTodo] = useState("");

    // --- PRODUCT MANAGEMENT STATE ---
    const [prodName, setProdName] = useState("");
    const [prodCategory, setProdCategory] = useState("");
    const [prodImg, setProdImg] = useState("");
    const [prodPrice, setProdPrice] = useState(0);
    const [prodStock, setProdStock] = useState(10);
    const [prodStatus, setProdStatus] = useState("");

    // 1. Fetch Chatbot Settings
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

    // 2. Real-time Listener for Inbox
    useEffect(() => {
        const q = query(collection(db, "store_inbox"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInboxItems(items);
        });
        return () => unsubscribe();
    }, []);

    // --- PRODUCT FUNCTIONS ---
    
    // Add a single product
    const handleAddProduct = async () => {
        if (!prodName || !prodCategory) {
            alert("Name and Category are required!");
            return;
        }
        setProdStatus("Adding...");
        try {
            await addDoc(collection(db, "products"), {
                name: prodName,
                category: prodCategory,
                imgUrl: prodImg || "", 
                price: Number(prodPrice),
                stock: Number(prodStock),
                text: "1 unit", 
                createdAt: serverTimestamp()
            });
            setProdStatus("Product Added!");
            setProdName(""); setProdCategory(""); setProdImg("");
            setTimeout(() => setProdStatus(""), 2000);
        } catch (e) {
            setProdStatus("Error: " + e.message);
        }
    };

    // --- CHATBOT & INBOX FUNCTIONS ---
    const handleSaveSettings = async () => {
        try {
            await setDoc(doc(db, "settings", "chatbot"), { mainPrompt, tempPrompts });
            setStatus("Saved!");
            setTimeout(() => setStatus(""), 2000);
        } catch (e) { setStatus("Error: " + e.message); }
    };
    const handleAddTemp = () => { if (newTempText) { setTempPrompts([...tempPrompts, { id: Date.now(), text: newTempText }]); setNewTempText(""); }};
    const handleRemoveTemp = (id) => setTempPrompts(tempPrompts.filter(t => t.id !== id));
    const handleAddTodo = async () => { if (newTodo.trim()) { await addDoc(collection(db, "store_inbox"), { text: newTodo, type: 'todo', status: 'active', source: 'admin', createdAt: serverTimestamp() }); setNewTodo(""); }};
    const handleMarkDone = async (id) => { await updateDoc(doc(db, "store_inbox", id), { status: 'completed' }); };
    const handleDeletePermanent = async (id) => { if(window.confirm("Delete forever?")) await deleteDoc(doc(db, "store_inbox", id)); };
    const displayedItems = inboxItems.filter(item => filter === 'active' ? item.status === 'active' : item.status === 'completed');
    const getTypeColor = (type) => { switch(type) { case 'complaint': return '#ffcccc'; case 'todo': return '#ffffcc'; case 'feedback': return '#ccffcc'; default: return '#f0f0f0'; }};

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1>Admin Dashboard</h1>

            {/* --- PRODUCT MANAGEMENT SECTION --- */}
            <div style={{ marginBottom: '40px', border: '2px solid #007bff', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#007bff', color: 'white', padding: '15px' }}>
                    <h2 style={{margin:0}}>Product Manager</h2>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#f0f8ff' }}>
                    
                    {/* Add Product Form */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                        <input placeholder="Name (e.g. Apple)" value={prodName} onChange={e => setProdName(e.target.value)} style={{padding:'8px'}} />
                        <input placeholder="Category (e.g. fruit)" value={prodCategory} onChange={e => setProdCategory(e.target.value)} style={{padding:'8px'}} />
                        <input placeholder="Image URL (Optional)" value={prodImg} onChange={e => setProdImg(e.target.value)} style={{padding:'8px'}} />
                        <div style={{display:'flex', gap:'5px'}}>
                            <input type="number" placeholder="Price" value={prodPrice} onChange={e => setProdPrice(e.target.value)} style={{padding:'8px', width:'50%'}} />
                            <input type="number" placeholder="Stock" value={prodStock} onChange={e => setProdStock(e.target.value)} style={{padding:'8px', width:'50%'}} />
                        </div>
                    </div>
                    <button onClick={handleAddProduct} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', width:'100%' }}>
                        + Add Product
                    </button>
                    <p style={{ fontWeight: 'bold', color: 'blue' }}>{prodStatus}</p>
                </div>
            </div>

            {/* --- INBOX SECTION --- */}
            <div style={{ marginBottom: '40px', border: '2px solid #333', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#333', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{margin:0}}>Store Inbox & Tasks</h2>
                    <div>
                        <button onClick={() => setFilter('active')} style={{ background: filter === 'active' ? 'white' : 'transparent', color: filter === 'active' ? 'black' : 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', marginRight: '5px', borderRadius: '4px' }}>Active</button>
                        <button onClick={() => setFilter('history')} style={{ background: filter === 'history' ? 'white' : 'transparent', color: filter === 'history' ? 'black' : 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}>History</button>
                    </div>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
                    {filter === 'active' && (
                        <div style={{ display: 'flex', marginBottom: '20px' }}>
                            <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a quick task..." style={{ flex: 1, padding: '10px' }} />
                            <button onClick={handleAddTodo} style={{ padding: '10px 20px', backgroundColor: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>Add To-Do</button>
                        </div>
                    )}
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {displayedItems.map(item => (
                            <div key={item.id} style={{ backgroundColor: 'white', borderLeft: `5px solid ${getTypeColor(item.type)}`, padding: '15px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', backgroundColor: getTypeColor(item.type), padding: '2px 6px', borderRadius: '4px', marginRight: '10px' }}>{item.type}</span>
                                    <span>{item.text}</span>
                                </div>
                                <div>
                                    {filter === 'active' ? <button onClick={() => handleMarkDone(item.id)} style={{ background: 'green', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>✓</button> : <button onClick={() => handleDeletePermanent(item.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>🗑</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- CHATBOT BRAIN SECTION --- */}
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{marginTop: 0}}>Chatbot Knowledge Base</h2>
                <div style={{ marginBottom: '20px' }}>
                    <textarea value={mainPrompt} onChange={(e) => setMainPrompt(e.target.value)} rows="6" style={{ width: '100%', padding: '10px' }} placeholder="Store rules..." />
                </div>
                <div style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input value={newTempText} onChange={(e) => setNewTempText(e.target.value)} placeholder="New alert..." style={{ flex: 1, padding: '8px' }} />
                        <button onClick={handleAddTemp}>Add</button>
                    </div>
                    {tempPrompts.map(t => (
                        <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span>- {t.text}</span><button onClick={() => handleRemoveTemp(t.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>x</button></div>
                    ))}
                </div>
                <button onClick={handleSaveSettings} style={{ width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>Save Knowledge Base</button>
                <p style={{ textAlign: 'center', marginTop: '10px', color: 'green' }}>{status}</p>
            </div>
        </div>
    );
}