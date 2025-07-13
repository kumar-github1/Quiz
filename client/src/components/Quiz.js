import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaCheck, FaClock } from 'react-icons/fa';
import './Quiz.css';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && !showResults) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showResults) {
            handleSubmit();
        }
    }, [timeLeft, showResults]);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get('/api/quiz/questions');
            setQuestions(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to load questions');
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length === 0) {
            setError('Please answer at least one question');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
                questionId: parseInt(questionId),
                selectedOption
            }));

            const response = await axios.post('/api/quiz/submit', { answers: answersArray });
            setResults(response.data);
            setShowResults(true);
        } catch (error) {
            setError('Failed to submit quiz');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = () => {
        return ((currentQuestion + 1) / questions.length) * 100;
    };

    if (loading) {
        return <div className="loading">Loading quiz questions...</div>;
    }

    if (error) {
        return <div className="alert alert-error">{error}</div>;
    }

    if (showResults && results) {
        return (
            <div className="quiz-container">
                <div className="quiz-results">
                    <h2>Quiz Results</h2>
                    <div className="results-summary">
                        <div className="result-card">
                            <h3>{results.score}%</h3>
                            <p>Your Score</p>
                        </div>
                        <div className="result-card">
                            <h3>{results.correctAnswers}/{results.totalQuestions}</h3>
                            <p>Correct Answers</p>
                        </div>
                    </div>

                    <div className="results-message">
                        {results.score >= 80 && <p className="excellent">Excellent! Great job!</p>}
                        {results.score >= 60 && results.score < 80 && <p className="good">Good work! Keep it up!</p>}
                        {results.score < 60 && <p className="improve">Keep practicing to improve!</p>}
                    </div>

                    <div className="results-actions">
                        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                            Back to Dashboard
                        </button>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            Take Another Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div className="alert alert-error">No questions available</div>;
    }

    const currentQ = questions[currentQuestion];

    return (
        <div className="quiz-container">
            {/* Timer and Progress */}
            <div className="quiz-header">
                <div className="quiz-timer">
                    <FaClock /> Time Left: {formatTime(timeLeft)}
                </div>
                <div className="quiz-progress">
                    Question {currentQuestion + 1} of {questions.length}
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="quiz-question">
                <h3>{currentQ.question}</h3>
                <div className="quiz-options">
                    {currentQ.options.map((option, index) => (
                        <div
                            key={index}
                            className={`quiz-option ${answers[currentQ.id] === option.key ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect(currentQ.id, option.key)}
                        >
                            <span className="option-key">{option.key}.</span>
                            <span className="option-text">{option.text}</span>
                            {answers[currentQ.id] === option.key && <FaCheck className="check-icon" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="quiz-navigation">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="btn btn-secondary"
                >
                    <FaArrowLeft /> Previous
                </button>

                <div className="question-indicators">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            className={`indicator ${index === currentQuestion ? 'current' : ''} ${answers[questions[index].id] ? 'answered' : ''}`}
                            onClick={() => setCurrentQuestion(index)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>

                {currentQuestion === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="btn btn-primary"
                    >
                        {submitting ? 'Submitting...' : <><FaCheck /> Submit Quiz</>}
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="btn btn-primary"
                    >
                        Next <FaArrowRight />
                    </button>
                )}
            </div>

            {/* Answer Summary */}
            <div className="answer-summary">
                <p>
                    Answered: {Object.keys(answers).length} / {questions.length} questions
                </p>
            </div>
        </div>
    );
};

export default Quiz; 