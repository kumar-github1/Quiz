const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get top scorers (leaderboard)
router.get('/top-scorers', async (req, res) => {
    try {
        const [topScorers] = await pool.execute(
            `SELECT 
        u.username,
        MAX(qr.score) as best_score,
        COUNT(qr.id) as total_quizzes,
        AVG(qr.score) as average_score,
        SUM(qr.correct_answers) as total_correct,
        SUM(qr.total_questions) as total_questions
      FROM users u
      LEFT JOIN quiz_results qr ON u.id = qr.user_id
      GROUP BY u.id, u.username
      HAVING best_score IS NOT NULL
      ORDER BY best_score DESC, average_score DESC
      LIMIT 10`
        );

        // Calculate additional stats
        const topScorersWithStats = topScorers.map(user => ({
            ...user,
            accuracy: user.total_questions > 0
                ? Math.round((user.total_correct / user.total_questions) * 100)
                : 0,
            average_score: Math.round(user.average_score || 0)
        }));

        res.json(topScorersWithStats);
    } catch (error) {
        console.error('Get top scorers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recent quiz results
router.get('/recent-results', async (req, res) => {
    try {
        const [recentResults] = await pool.execute(
            `SELECT 
        u.username,
        qr.score,
        qr.total_questions,
        qr.correct_answers,
        qr.completed_at
      FROM quiz_results qr
      JOIN users u ON qr.user_id = u.id
      ORDER BY qr.completed_at DESC
      LIMIT 20`
        );

        res.json(recentResults);
    } catch (error) {
        console.error('Get recent results error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's ranking
router.get('/user-ranking', auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get user's best score
        const [userBest] = await pool.execute(
            'SELECT MAX(score) as best_score FROM quiz_results WHERE user_id = ?',
            [userId]
        );

        if (!userBest[0].best_score) {
            return res.json({
                ranking: null,
                message: 'No quiz attempts yet'
            });
        }

        // Get ranking
        const [ranking] = await pool.execute(
            `SELECT COUNT(*) + 1 as ranking
       FROM (
         SELECT MAX(score) as best_score
         FROM quiz_results
         GROUP BY user_id
         HAVING MAX(score) > ?
       ) as higher_scores`,
            [userBest[0].best_score]
        );

        // Get total users with quiz attempts
        const [totalUsers] = await pool.execute(
            'SELECT COUNT(DISTINCT user_id) as total FROM quiz_results'
        );

        res.json({
            ranking: ranking[0].ranking,
            totalUsers: totalUsers[0].total,
            bestScore: userBest[0].best_score
        });
    } catch (error) {
        console.error('Get user ranking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 