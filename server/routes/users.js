const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const [users] = await pool.execute('SELECT id, username, email, created_at FROM users WHERE id = ?',
            [req.user.userId]);

        if (users.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            }

            );
        }

        res.json(users[0]);
    }

    catch (error) {
        console.error('Get profile error:', error);

        res.status(500).json({
            message: 'Server error'
        }

        );
    }
}

);

// Get user quiz history
router.get('/history', auth, async (req, res) => {
    try {
        const [history] = await pool.execute(`SELECT id,
                score,
                total_questions,
                correct_answers,
                created_at,
                completed_at,
                TIMESTAMPDIFF(MINUTE, created_at, completed_at) as time_taken FROM quiz_results WHERE user_id=? ORDER BY completed_at DESC`,
            [req.user.userId]);

        res.json(history);
    }

    catch (error) {
        console.error('Get history error:', error);

        res.status(500).json({
            message: 'Server error'
        }

        );
    }
}

);

// Get user statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const [stats] = await pool.execute(`SELECT COUNT(*) as total_quizzes,
                AVG(score) as average_score,
                MAX(score) as best_score,
                SUM(total_questions) as total_questions_attempted,
                SUM(correct_answers) as total_correct_answers,
                MIN(created_at) as first_quiz,
                MAX(completed_at) as last_quiz FROM quiz_results WHERE user_id=?`,
            [req.user.userId]);

        const userStats = stats[0];
        const accuracy = userStats.total_questions_attempted > 0 ? Math.round((userStats.total_correct_answers / userStats.total_questions_attempted) * 100) : 0;

        res.json({
            ...userStats,
            average_score: Math.round(userStats.average_score || 0),
            accuracy
        }

        );
    }

    catch (error) {
        console.error('Get stats error:', error);

        res.status(500).json({
            message: 'Server error'
        }

        );
    }
}

);

module.exports = router;