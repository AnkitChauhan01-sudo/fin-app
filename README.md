# Personal Finance Tracker

A modern web application to help you track your personal finances, manage expenses, and monitor your financial health.

## Features

- Track income and expenses
- Categorize transactions
- View financial overview and analytics
- Monthly budget planning
- Transaction history
- Responsive design for all devices

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: MongoDB
- Styling: Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the backend directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/finance-tracker
     JWT_SECRET=your_jwt_secret
     ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
finance-tracker/
├── frontend/           # React frontend application
├── backend/           # Node.js backend server
└── README.md
``` 