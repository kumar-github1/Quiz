const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all questions for a quiz
router.get('/questions', auth, async (req, res) => {
    try {
        const [questions] = await pool.execute(
            'SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions ORDER BY RAND() LIMIT 10'
        );

        // Shuffle options for each question
        const questionsWithShuffledOptions = questions.map(q => {
            const options = [
                { key: 'A', text: q.option_a },
                { key: 'B', text: q.option_b },
                { key: 'C', text: q.option_c },
                { key: 'D', text: q.option_d }
            ];

            // Shuffle options
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }

            return {
                id: q.id,
                question: q.question_text,
                options: options
            };
        });

        res.json(questionsWithShuffledOptions);
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit quiz answers
router.post('/submit', auth, async (req, res) => {
    try {
        const { answers } = req.body;
        const userId = req.user.userId;

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Invalid answers format' });
        }

        let correctAnswers = 0;
        let totalQuestions = answers.length;

        // Check each answer
        for (const answer of answers) {
            const [questions] = await pool.execute(
                'SELECT correct_answer FROM questions WHERE id = ?',
                [answer.questionId]
            );

            if (questions.length > 0 && questions[0].correct_answer === answer.selectedOption) {
                correctAnswers++;
            }
        }

        const score = Math.round((correctAnswers / totalQuestions) * 100);

        // Save quiz result
        const [result] = await pool.execute(
            'INSERT INTO quiz_results (user_id, score, total_questions, correct_answers, completed_at) VALUES (?, ?, ?, ?, NOW())',
            [userId, score, totalQuestions, correctAnswers]
        );

        res.json({
            message: 'Quiz submitted successfully',
            score,
            correctAnswers,
            totalQuestions,
            resultId: result.insertId
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get quiz statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get user's quiz history
        const [results] = await pool.execute(
            `SELECT 
        score, 
        total_questions, 
        correct_answers, 
        completed_at,
        TIMESTAMPDIFF(MINUTE, created_at, completed_at) as time_taken
      FROM quiz_results 
      WHERE user_id = ? 
      ORDER BY completed_at DESC`,
            [userId]
        );

        // Calculate statistics
        const totalQuizzes = results.length;
        const averageScore = totalQuizzes > 0
            ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalQuizzes)
            : 0;
        const bestScore = totalQuizzes > 0 ? Math.max(...results.map(r => r.score)) : 0;
        const totalQuestions = results.reduce((sum, r) => sum + r.total_questions, 0);
        const totalCorrect = results.reduce((sum, r) => sum + r.correct_answers, 0);

        res.json({
            totalQuizzes,
            averageScore,
            bestScore,
            totalQuestions,
            totalCorrect,
            accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
            recentResults: results.slice(0, 5) // Last 5 results
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 