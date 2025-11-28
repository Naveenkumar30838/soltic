### **SOLTIC – AI-Powered Travel Assistant **

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![AI](https://img.shields.io/badge/Powered_By-Gemini_2.5_Flash-purple)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-orange)
![Build](https://img.shields.io/badge/Build-Passing-success)
![API](https://img.shields.io/badge/API%20Usage-Heavy-blueviolet)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-yellow)

---


**SOLTIC** is an **AI-powered travel assistant** that helps users plan trips, explore destinations, create itineraries, and get intelligent responses using

The system integrates:

* Real-time conversation with Gemini
* AI-generated travel recommendations
* Trip creation & management
* User profile handling
* Secure authentication
* Clean and responsive UI

---

## 🔥 **Key Features**

###  **Gemini-Based Travel Intelligence**

* Uses Google’s **Gemini 2.5 Flash** model
* Generates travel plans, day-wise itineraries, budgets, packing lists, etc.
* Provides smart suggestions: weather, sightseeing, best routes, stay options

###  **Trip Management**

* Create trip
* View/edit trip
* Store trip preferences

### 🔐 **Authentication System**

* Session-based login
* Protected routes
* Autofetch user details

###  **User Profile Support**

* `/profile/:username` fetch
* Delete account
* Update profile info

### ⚛️ **Frontend (React + Vite)**

* Modern UI
* React Router DOM
* Axios API communication
* Custom CSS for each page

### **Backend (Node.js + Express)**

* Gemini integration through API key
* Secure backend endpoints
* Session + cookies support

---

## 🧠 **How Gemini is Used**

SOLTIC uses Gemini via google genAi module.
The AI then returns:

* Trip recommendations
* Optimal routes
* Budget estimation
* Travel safety info
* Best seasons to visit
* City-wise guides

---

## 📁 **Project Structure**

```
soltic/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │    ├── authRoutes.js  
│   │    ├── chatRoutes.js
│   │    └── ProfilRoutes.js
│   ├── controllers/
│   ├── db/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Profile.jsx
│   │   │   ├── AddTrip.jsx
│   │   │   └── Chat.jsx
│   │   ├── styles/
│   │   │   ├── profile.css
│   │   │   └── addTrip.css
│   │   └── main.jsx
│   └── index.html
│
└── README.md
```

---

## ⚙️ **Setup & Installation**

### **Backend**

```
cd backend
npm install
nodemon/node Index.js
```

### **Frontend**

```
cd frontend
npm install
npm run dev
```

### **Environment Variables**

Frontend `.env`:

```
VITE_BASE_URL=http://localhost:5173
```

Backend `.env`:

```
gemini_api_key=YOUR_GEMINI_KEY
SESSION_SECRET=your_secret
```

---

## 🌐 **API Endpoints**

### **Gemini Travel AI**

| Method | Endpoint      | Description                                    |
| ------ | ------------- | ---------------------------------------------- |
| POST   | `/travel/ask` | Send message to Gemini and receive AI response |

### **Trips**

| Method | Endpoint    | Description     |
| ------ | ----------- | --------------- |
| POST   | `/trip/add` | Add new trip    |
| GET    | `/trip/all` | Fetch all trips |
| DELETE | `/trip/:id` | Delete a trip   |

### **Profile**

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| GET    | `/profile/:username` | Fetch profile |
| DELETE | `/profile/:username` | Remove user   |

---

## 🖼️ ** Chat Model Outcome**

---
ChatBot Like Interface(for the Agent): 
<img width="959" height="446" alt="{8BBCD3EE-5AD5-4D99-A765-ECDAE94B93CD}" src="https://github.com/user-attachments/assets/fab66fa0-c553-4214-b7d2-c83fd8f58062" />

## 🧪 **Testing**

* Gemini responses validation
* API rate-limit handling
* Session expiry tests
* Profile delete flow
* Trip creation stress testing

---

## 📜 **License**

MIT License — free for personal & commercial use.

---

## 🤝 **Contributing**

Pull requests and improvements are welcome!

---



