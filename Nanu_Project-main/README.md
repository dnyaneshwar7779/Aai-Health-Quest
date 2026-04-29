# Aai Health Quest 🏋️‍♂️🎮

A responsive, gamified healthcare fitness tracker built with Node.js, Express, and MySQL. Transform your health journey into an epic adventure.

## Core Features

- **Gamified Progression**: Earn XP and level up as you complete workouts.
- **Smart Onboarding**: Profile setup with biometric tracking and fitness goals.
- **Quest Hall**: Accept daily, weekly, and milestone challenges.
- **Global Leaderboard**: Compete with other warriors and climb the ranks.
- **Redemption Store**: Swap earned Health Points for virtual rewards and subscriptions.
- **Admin Arsenal**: Full control over quests, user stats, and review moderation.

## Tech Stack

- **Frontend**: HTML5, CSS3 (Neon Dark Theme), Vanilla JS
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Security**: JWT sessions, Bcrypt password hashing
- **Visuals**: Canvas-confetti for Level-Up celebrations

## Installation & Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Database**:
   Update the `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=aai_health_quest
   JWT_SECRET=your_secret_key
   ```
4. **Seed Initial Quests**:
   ```bash
   node seed.js
   ```
5. **Start the Arena**:
   ```bash
   npm start
   ```

## Admin Access
To access the admin panel, register a user and manually change their role to `admin` in the MySQL `Users` table, then visit `/admin/index.html`.
