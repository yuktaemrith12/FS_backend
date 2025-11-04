# 💻 Full Stack Coursework – Yukta Emrith (M00977987)

## 🌐 Overview
This repository contains the **Back-End (Node.js + Express + MongoDB Atlas)** for the Full Stack Coursework project.  
It powers the Vue.js front-end by providing RESTful API endpoints to manage lessons, handle orders, and perform search operations.

---

## 🔗 Project Links
| Component | Platform | Link |
|------------|-----------|------|
| 🖥️ Vue.js App (Repo) | GitHub | [FS_frontend](https://github.com/yuktaemrith12/FS_frontend) |
| 🌍 Vue.js App (Live) | GitHub Pages | [Open App](https://yuktaemrith12.github.io/FS_frontend/) |
| ⚙️ Express.js App (Repo) | GitHub | [FS_backend](https://github.com/yuktaemrith12/FS_backend) |
| ☁️ Express.js App (Live) | Render | [Live API – /lessons](https://fs-backend-e7uu.onrender.com/lessons) |

---

## ⚙️ Core Functionalities

### 📘 Lessons
- `GET /lessons` → Retrieve all lessons from MongoDB Atlas  
- `PUT /lessons/:id` → Update lesson attributes (e.g., remaining spaces)  
- Fields include: `topic`, `location`, `price`, `space`, `rating`, `img`

### 🛒 Orders
- `POST /orders` → Create new order with `{ name, phone, lessonIDs, space }`  
- Input validation ensures proper name and phone formats  
- Orders saved in the `order` collection

### 🔍 Search
- `GET /search?q=term` → Case-insensitive search by topic, location, price, or space  
- Uses MongoDB regex for flexible filtering

---

## 🧩 Middleware
- `morgan("dev")` – Request logging  
- `express.json()` – JSON body parsing  
- `cors()` – Cross-origin access for GitHub Pages frontend  
- `express.static()` – Serves lesson images with fallback 404 JSON

---

## 🗄️ Database & Environment
- **Database:** MongoDB Atlas (via native `mongodb` driver)  
- `.env` includes:
  ```bash
  MONGODB_URI=...
  DB_NAME=fs_coursework
  PORT=10000
