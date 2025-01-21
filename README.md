# SLCA Pairing Software

The **SLCA Pairing Software** is a robust web application designed to streamline the organization of teams and players during tournaments hosted by the **Student Led Chess Association (SLCA)**. Built with modern web technologies like **Next.js** and **Prisma**, this application provides features for managing player rosters, creating match pairings, tracking results, and supporting multiple tournament formats.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The SLCA Pairing Software simplifies chess tournament management by automating complex processes such as player pairing, results tracking, and standings generation. It supports features like:

- Dynamic team and player management
- Round-based tournament progression (e.g., Swiss system)
- Real-time updates on pairings and results
- User authentication for secure tournament management
- Modular API routes for backend operations

---

## Features

- **Player and Team Management**:
  - Add, update, and delete players and teams.
  - View detailed rosters for each team.
- **Tournament Pairings**:
  - Generate match pairings for each round.
  - Support for various tournament formats, including Swiss pairings.
- **Result Tracking**:
  - Record and update match results.
  - Automatically update standings based on results.
- **Authentication**:
  - Secure login and user management using `next-auth`.
- **Responsive Design**:
  - Fully responsive UI for use on different devices.
- **API Support**:
  - Custom backend APIs to handle pairing logic, results, and database operations.

---

## Technologies Used

The project leverages the following technologies:

- **Frontend**: [Next.js](https://nextjs.org/) (React framework)
- **Styling**: Tailwind CSS
- **Backend**:
  - API routes via Next.js
  - Database ORM: Prisma
- **Database**: (e.g., PostgreSQL or SQLite; configurable in `.env`)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel or any Next.js-compatible platform
- **Version Control**: Git and GitHub

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server in your terminal:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
