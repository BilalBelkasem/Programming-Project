# Career Launch 2026

A web platform for the EHB Career Launch event where students and companies can register, create profiles, and connect. With a QR code system for badges and a speeddates for fast and meaningful meetings

---

## Project Structure

```
Programming-Project/
│
├── Code/
│   ├── BackEnd/         # Node.js Express backend
│   │   ├── Controller/  # Controllers (business logic)
│   │   ├── config/      # Database config
│   │   ├── middleware/  # Auth & other middleware
│   │   ├── public/      # Static files (badge system, etc.)
│   │   ├── routes/      # Express routers
│   │   ├── .env         # Environment variables
│   │   ├── server.js    # Main backend entry
│   │   └── ...          # Other backend files
│   └── FrontEnd/        # React + Vite frontend
│       ├── public/      # Static assets
│       ├── src/         # React source code
│       ├── index.html   # Main HTML
│       └── ...          # Other frontend files
├── ERD/                 # Entity Relationship Diagram
├── career_launch_2026.sql # Main database schema
├── speeddates_database.sql # Extra DB schema (if needed)
└── README.md
```

---

##  Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/BilalBelkasem/Programming-Project.git
cd Programming-Project
```

---

### 2. Backend Setup (Express)

```sh
cd Code/BackEnd
npm install
npm install puppeteer qrcode
```

- **Environment:**  
  Create a `.env` file in `Code/BackEnd/` with:
  ```
  DB_HOST=localhost
  DB_USER=your_mysql_user
  DB_PASSWORD=your_mysql_password
  DB_NAME=career_launch_2026
  DB_PORT=3306
  PORT=5000
  JWT_SECRET=your_secret_key
  ```

- **Start backend:**
  ```sh
  npm start
  ```

---

### 3. Frontend Setup (React + Vite)

```sh
cd ../FrontEnd
npm install
npm install react-router-dom axios lucide-react
npm run dev
```

- The frontend runs on [http://localhost:5173](http://localhost:5173) by default.

---

### 4. Database Setup

- Make sure MySQL is running (e.g., via XAMPP).
- Open phpMyAdmin and import `career_launch_2026.sql` into a new database named `career_launch_2026`.

---

## Features

- Student and company registration & login
- Profile management for both students and companies
- Favorieten (favorites) system
- Admin dashboard for managing students and companies
- Badge generation (PDF) for students and companies
- Speeddate scheduling and management
- Responsive frontend (React + Vite)

---

## ⚙️ Useful Scripts

**Backend:**
- `npm start` — Start backend server

**Frontend:**
- `npm run dev` — Start frontend dev server

---

##  Notes

- All backend API routes are prefixed with `/api/` (e.g., `/api/studenten`, `/api/bedrijven`, etc.).
- Environment variables are required for database and JWT configuration.
- For badge generation, [puppeteer](https://pptr.dev/) and [qrcode](https://github.com/soldair/node-qrcode) are used.



---


---

## 👨‍💻 Authors

- Bilal Belkasem
- Marwal Amakran
- Jelle Schroeven
- Ayman Bounaanaa
- Digay Kengoum 
- Denis Bujorean

---

