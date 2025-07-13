# Quiz Application - Full Stack

A complete full-stack quiz application built with React, Express.js, and MySQL. Users can register, login, take quizzes, view their performance statistics, and compete on the leaderboard.

## Features

- **User Authentication**: Register and login with JWT token-based authentication
- **Interactive Quiz Interface**: Take quizzes with randomized questions and options
- **Real-time Scoring**: Immediate feedback and score calculation
- **Performance Tracking**: Detailed statistics and performance history
- **Leaderboard**: View top performers and recent activity
- **Responsive Design**: Works on desktop and mobile devices
- **User Profile**: View account details and quiz history

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React** 18 with functional components and hooks
- **React Router** for navigation
- **Axios** for API calls
- **Chart.js** for data visualization
- **React Icons** for UI icons
- **CSS3** with modern styling

## Database Schema

### Tables

1. **users** - User accounts and authentication
2. **questions** - Quiz questions with multiple choice options
3. **quiz_results** - User quiz attempts and scores

### Views

1. **user_stats** - Aggregated user statistics
2. **leaderboard** - Top performers ranking

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd quiz-app-fullstack
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Database Setup
1. Create a MySQL database
2. Import the schema:
```bash
mysql -u your_username -p < database/schema.sql
```

### 4. Environment Configuration
1. Copy the example environment file:
```bash
cp env.example .env
```

2. Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=quiz_app
JWT_SECRET=your-secure-jwt-secret
PORT=5000
```

### 5. Start the Application

#### Development Mode (Recommended)
```bash
# Start both backend and frontend concurrently
npm run dev
```

#### Production Mode
```bash
# Start backend only
npm start

# In another terminal, start frontend
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Quiz
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/stats` - Get user quiz statistics

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/history` - Get quiz history
- `GET /api/users/stats` - Get user statistics

### Scoreboard
- `GET /api/scoreboard/top-scorers` - Get leaderboard
- `GET /api/scoreboard/recent-results` - Get recent activity
- `GET /api/scoreboard/user-ranking` - Get user ranking

## Adding Questions

You can add more questions to the database by inserting records into the `questions` table:

```sql
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) 
VALUES ('Your question here?', 'Option A', 'Option B', 'Option C', 'Option D', 'A', 'Category', 'Easy');
```

## Project Structure

```
quiz-app-fullstack/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Express backend
│   ├── config/            # Database configuration
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   └── index.js
├── database/              # Database schema
│   └── schema.sql
├── package.json
└── README.md
```

## Features in Detail

### User Authentication
- Secure password hashing with bcryptjs
- JWT token-based authentication
- Protected routes and middleware
- Session management

### Quiz System
- Randomized question selection
- Shuffled answer options
- Timer functionality (10 minutes per quiz)
- Real-time progress tracking
- Immediate score calculation

### Dashboard
- Performance statistics
- Recent quiz results
- Performance trend charts
- Quick action buttons

### Leaderboard
- Top 10 performers
- User ranking system
- Recent activity feed
- Performance metrics

### User Profile
- Account information
- Complete quiz history
- Performance analytics
- Achievement tracking

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Environment variable protection

## Performance Optimizations

- Database indexing for faster queries
- Efficient SQL queries with proper joins
- React component optimization
- Lazy loading and code splitting
- Responsive design for mobile devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 