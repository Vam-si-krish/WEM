# Project Summary: West End Market (WEM)

## 1. Project Context
- **Description:** A React + Vite web application for a physical convenience store.
- **Store Identity:** West End Market, 74 Staniford St, Boston.
- **Primary Goals:** Showcase products, allow category-based shopping, and provide AI-driven customer support.

## 2. Tech Stack
- **Frontend:** React (v19), Vite, React Router DOM (v7), Framer Motion.
- **Backend/Database:** Firebase (Auth & Firestore).
- **AI:** Google Generative AI (Gemini API).
- **Styling:** CSS (Modular and component-specific).

## 3. Key Components & Routing
- `/`: Home Page (Hero section, Categories, Product highlights, About Us).
- `/Shop`: Product catalog with search, category filtering (Dairy, Fruit, etc.), and price/name sorting.
- `/admin-login` & `/admin-dashboard`: Secure areas for store management.
- `Chatbot.jsx`: Floating AI assistant using Gemini to provide store-specific info.

## 4. Data Structures
- **Product Object:** `{ name, imgUrl, category, text (weight/size), price, stock }`.
- **Firebase Firestore:**
  - Collection: `settings/chatbot` -> Stores `mainPrompt` (rules) and `tempPrompts` (current alerts).

## 5. Development Notes
- **Mock Data:** The `Shop.jsx` component currently uses a `MOCK_PRODUCTS` array for testing.
- **Environment Variables:**
  - `VITE_FIREBASE_...`: For database and auth config.
  - `VITE_GEMINI_API_KEY`: For the AI assistant.