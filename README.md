# Programming-Project

In dit project gaan we een website maken waar studenten en bedrijven zich kunnen regristreren voor de EHB career launch. Met op de website een mogelijkheid om een profiel aan te maken dat door andere bekeken kan worden.



## Getting Started

### 1. Clone the repository


git clone https://github.com/BilalBelkasem/Programming-Project.git
cd Programming-Project


### 2. install backend (express)
cd Code/BackEnd
npm install
npm install multer ( If there is a problem about module, go pacckage.json in depedencies you will see type = module delete this and it will work.)
npm install pupeteer
npm install qrcode

### 3. Install Frontend (React + Vite)
cd ../FrontEnd
npm install
npm install react-router-dom
npm install axios (for requests)
npm install lucide-react
npm run dev

### 4. Database setup
Make sure MySQL is running (e.g. through XAMPP)

Open phpMyAdmin and import career_launch_2026.sql into a new database named career_launch_2026

