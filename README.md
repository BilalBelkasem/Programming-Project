# 🚀 EHB Career Launch 2026 - Programming Project

Een full-stack webapplicatie ontwikkeld door studenten van Erasmus Hogeschool Brussel voor het event Career Launch 2026. Studenten en bedrijven kunnen zich registreren, profielen beheren, speeddates boeken en elkaar snel terugvinden via QR-codes. Admins kunnen bedrijven en studenten beheren en badges printen voor gebruik op de beursvloer.

## 👥 Team
- **Marwân Amakran** - Frontend design
- **Bilal Belkasem** - Backend & Database
- **Digay Kengoum** - Backend
- **Denis Bujorean** - Frontend design
- **Ayman Bounaânaâ** - Frontend
- **Jelle Schroeven** - Backend & Database

## ⚙️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Database

### Overige Tools
- **QRCode** - QR code generation
- **Puppeteer** - PDF generation

## 📦 Installatie

### 1. Clone de repository
```bash
git clone https://github.com/BilalBelkasem/Programming-Project.git
cd Programming-Project
```

### 2. Backend installeren
```bash
cd Code/BackEnd
npm install
```

### 3. Frontend installeren
```bash
cd ../FrontEnd
npm install
npm run dev
```

### 4. Database opzetten
Open phpMyAdmin en importeer het bestand career_launch_2026.sql in een nieuwe database met de naam career_launch_2026. Dan importeer het tweede sql bestand speeddates_database

Omgeving:

Maak een `.env`-bestand aan in de map `Code/BackEnd/` met de volgende inhoud:

```env
DB_HOST=localhost
DB_USER=je_mysql_gebruiker
DB_PASSWORD=je_mysql_wachtwoord
DB_NAME=career_launch_2026
DB_PORT=3306
PORT=5000
JWT_SECRET=je_geheime_sleutel
```

## 🗄️ Database Design

### Entiteiten & Relaties
- **users** - Centrale tabel voor alle gebruikers (student, bedrijf, admin)
- **students_details** - Uitgebreide profielinformatie voor studenten
- **companies_details** - Gedetailleerde profielen voor bedrijven
- **favorites** - Linkt studenten en bedrijven die elkaar interessant vinden
- **feedback** - Feedback van bedrijven op studenten na een gesprek
- **likes** - Generieke tabel voor 'like' acties
- **reservations** - Beheert de reserveringen voor speeddates
- **speeddates** - Definieert de beschikbare speeddate-momenten
- **speeddates_audit_log** - Logt wijzigingen in speeddate-gegevens
- **speeddates_config** - Configuratie voor de speeddate-sessies
- **stands** - Informatie over de standplaatsen van bedrijven
- **timeslots** - Beschikbare tijdslots voor evenementen of speeddates

### Geavanceerde Database Features
- **Triggers** voor automatische data synchronisatie
- **Stored Procedures** voor complexe business logic
- **Foreign Key Constraints** voor data integriteit
- **Indexes** op kritieke velden voor performance
- **Audit Logging** voor administratieve acties

### Normalisatie
- **3NF** geïmplementeerd voor optimale data integriteit
- **Junction Tables** voor many-to-many relaties
- **Proper Data Types** voor efficiënte opslag

## 🧩 Functionaliteiten

### Gebruikersbeheer
- ✅ Studenten-, bedrijven- en adminregistratie
- ✅ Secure login met JWT tokens
- ✅ Wachtwoord hashing met bcrypt
- ✅ Role-based access control

### Profielbeheer
- ✅ Uitgebreide profielen met interesses en domeinen
- ✅ File upload voor bedrijfslogo's
- ✅ LinkedIn integratie
- ✅ Profiel bewerken en bijwerken

### QR-Code Systeem
- ✅ Dynamische QR-code generatie
- ✅ QR-code scannen voor profielweergave
- ✅ Mobiel-vriendelijke profielpagina's

### Speeddate Systeem
- ✅ Admin configuratie van tijdslots
- ✅ Automatische slot generatie
- ✅ Reserveringssysteem
- ✅ Status tracking (available, booked, cancelled)
- ✅ Automatische cleanup bij gebruikersverwijdering

### Favorieten Systeem
- ✅ Wederzijdse favorieten
- ✅ Bedrijf kan student liken
- ✅ Student kan bedrijf favoriet maken

### Admin Paneel
- ✅ Gebruikersbeheer (toevoegen, bewerken, verwijderen)
- ✅ Speeddate configuratie
- ✅ Badge generator met PDF export
- ✅ Audit logging

## 📂 Project Structuur

```
Programming-Project/
├── Code/
│   ├── BackEnd/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── Controller/
│   │   │   ├── adminSpeeddateConfig.js
│   │   │   ├── BedrijfAdmin.js
│   │   │   ├── BedrijfLikeStudentController.js
│   │   │   ├── BedrijfRegistratieController.js
│   │   │   ├── BedrijvenController.js
│   │   │   ├── companyProfileController.js
│   │   │   ├── FavorietenController.js
│   │   │   ├── LoginController.js
│   │   │   ├── mijnprofiel.js
│   │   │   ├── reservations.js
│   │   │   ├── StudentAdmin.js
│   │   │   ├── studentDetails.js
│   │   │   └── StudentRegistratieController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   ├── public/
│   │   │   └── assets/
│   │   ├── package.json
│   │   └── server.js
│   └── FrontEnd/
│       ├── src/
│       │   ├── components/
│       │   │   ├── SharedHeader.css
│       │   │   ├── SharedHeader.jsx
│       │   │   ├── SharedHeader2.jsx
│       │   │   └── SharedHeaderIngelogd.jsx
│       │   ├── pages/
│       │   │   ├── Css/
│       │   │   └── jsx/
│       │   ├── assets/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── public/
│       ├── package.json
│       └── vite.config.js
├── ERD/
│   └── placeholder.txt
├── career_launch_2026 (3).sql
├── speeddates_database.sql
├── .gitignore
└── README.md
```

## 🔧 Git Workflow

### Repository Structuur
- ✅ **Main Branch** - Productie-ready code
- ✅ **Feature Branches** - Nieuwe functionaliteiten
- ✅ **Pull Requests** - Code review proces
- ✅ **Atomic Commits** - Kleine, logische wijzigingen


## 🎯 Project Management

### Agile Methodologie
- ✅ **Sprint Planning** - Wekelijkse doelen
- ✅ **Daily Standups** - Team communicatie
- ✅ **Retrospectives** - Continue verbetering
- ✅ **User Stories** - Feature specificaties

### Documentatie
- ✅ **API Documentation** - Backend endpoints
- ✅ **Database Schema** - ERD en relaties
- ✅ **Setup Instructions** - Installatie handleiding
- ✅ **Code Comments** - Inline documentatie

### Tools & Workflow
- **GitHub** - Version control
- **Trello** - Task management
- **Whatssap and Teams** - Team communicatie
- **VS Code** - Development environment


## 🚀 Deployment

### Development
```bash
# Backend
cd Code/BackEnd
npm start

# Frontend
cd Code/FrontEnd
npm run dev
```

### Production
```bash
# Build frontend
cd Code/FrontEnd
npm run build

# Start backend
cd Code/BackEnd
npm start
```

## 🔒 Security Features

- **Password Hashing** - Bcrypt met salt
- **JWT Authentication** - Secure token-based auth
- **CORS Protection** - Cross-origin security
- **Input Validation** - Server-side sanitization
- **File Upload Security** - Type en size validation

## 🎓 Credits

**Gerealiseerd in het kader van het vak "Programming Project"**
- Erasmus Hogeschool Brussel – 2024–2025
- Begeleiding: [Aertssens Tom, Dejonckheere Ruben, Felix Kevin, Hambrouck Wim, Quartier Joachim, Van Steertegem David, Weemaels Steve]
- Project Duur: [25/03/2025] - [23/06/2025]

---

**© 2024 EHB Career Launch Team. Alle rechten voorbehouden.**

