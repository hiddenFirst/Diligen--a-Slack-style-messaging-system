A mobile-first messaging web application built for the UCSC CSE186 course. It supports user authentication, workspace/channel/message navigation, real-time reply threads, and persistent last-visited location tracking using a PostgreSQL backend.

## 🚀 Features

- 🔐 User authentication with hashed passwords and JWT
- 🧭 Remembers last visited workspace/channel/message without localStorage
- 💬 Messaging with thread-style replies and real-time updates
- 🌐 Responsive UI with Material-UI (mobile-first)
- 🧪 Unit & E2E test coverage >90% using Vitest & Puppeteer
- 📃 REST API documented with OpenAPI

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Material-UI, Context API
- **Backend:** Node.js, Express, PostgreSQL
- **Auth:** bcrypt, JSON Web Token (JWT)
- **Testing:** Vitest, Testing Library, Puppeteer
- **Documentation:** Swagger (OpenAPI 3.0)

## Per-requirement
You should have downloaded docker before running this app because our database run in docker.
Also, you should have Node.js

## Start Database and backend
- First start database Docker container, in the backend folder run `docker compose up -d`
- To start the backend dev servers, run the following command `npm start` in the same floder

## Start Frontend 
- To start frontend you should go to frontend folder and run `npm run dev`
