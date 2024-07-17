# Realtime-chess-backend

This repository contains the backend server for RealtimeChess, a web application for playing chess online with friends or random opponents. The backend provides API endpoints, game management, real-time communication using Socket.IO, and follows an MVC architecture.

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Introduction

RealtimeChess Backend serves as the server-side implementation for handling user authentication, game logic, and API interactions using Node.js and Express.js. It integrates Socket.IO for real-time communication and MongoDB for data storage, following an MVC (Model-View-Controller) architecture pattern.

## Technologies Used

- Node.js
- Express.js
- Socket.IO
- MongoDB
- JWT (JSON Web Tokens) for authentication

## Installation

To set up the RealtimeChess Backend locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/realtimechess-backend.git
Navigate into the project directory:

bash
Copy code
cd realtimechess-backend
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory.
Define environment-specific variables like PORT, DATABASE_URL, and JWT_SECRET.
Start the server:

bash
Copy code
npm start
The backend server should now be running on http://localhost:your-port.
