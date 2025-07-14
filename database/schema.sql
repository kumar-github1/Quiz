CREATE DATABASE IF NOT EXISTS quiz_app;
USE quiz_app;
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    category VARCHAR(50) DEFAULT 'General',
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE quiz_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    score INT NOT NULL CHECK (
        score >= 0
        AND score <= 100
    ),
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_score ON quiz_results(score);
CREATE INDEX idx_quiz_results_created_at ON quiz_results(created_at);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
INSERT INTO questions (
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        category,
        difficulty
    )
VALUES (
        'What is the primary goal of AdTech for advertisers?',
        'Build websites',
        'Improve conversion rates with targeted ads',
        'Block ads from competitors',
        'Send mass emails',
        'B',
        'Chapter 1-6',
        'Easy'
    ),
    (
        'Who are the two main players in the online advertising ecosystem?',
        'Ad agencies and marketers',
        'Advertisers and publishers',
        'Developers and designers',
        'Networks and platforms',
        'B',
        'Chapter 1-6',
        'Easy'
    ),
    (
        'What does CPM stand for?',
        'Cost Per Marketing',
        'Clicks Per Minute',
        'Cost Per Mille',
        'Cost Per Market',
        'C',
        'Chapter 1-6',
        'Easy'
    ),
    (
        'Which pricing model only charges for completed actions?',
        'CPM',
        'CPC',
        'CPA',
        'CPL',
        'C',
        'Chapter 1-6',
        'Medium'
    ),
    (
        'What is a landing page designed for?',
        'Navigation',
        'User registration',
        'Driving conversions',
        'Showing popups',
        'C',
        'Chapter 1-6',
        'Easy'
    ),
    (
        'What is an impression?',
        'A click on an ad',
        'A conversion goal',
        'An ad served to a user',
        'A failed load of ad content',
        'C',
        'Chapter 1-6',
        'Easy'
    ),
    (
        'What is a creative in advertising?',
        'The campaign name',
        'An ad designer',
        'The ad file',
        'User persona',
        'C',
        'Chapter 1-6',
        'Easy'
    ),
    (
        'Which organization sets standards for ad formats?',
        'IEEE',
        'IAB',
        'W3C',
        'FDA',
        'B',
        'Chapter 1-6',
        'Medium'
    ),
    (
        'What is the role of an ad server?',
        'Design landing pages',
        'Track user clicks only',
        'Deliver and manage ads',
        'Create social media campaigns',
        'C',
        'Chapter 1-6',
        'Medium'
    ),
    (
        'What is a viewable impression?',
        'Ad sent to multiple users',
        'Ad not blocked by browsers',
        'Ad seen by a user above the fold',
        'Any ad placed on a page',
        'C',
        'Chapter 1-6',
        'Hard'
    ),
    (
        'Which company ran the first banner ad online?',
        'Google',
        'Yahoo',
        'AT&T',
        'IBM',
        'C',
        'Chapter 1-6',
        'Medium'
    ),
    (
        'What is remnant inventory?',
        'Most premium inventory',
        'Leftover unsold inventory',
        'Inventory used for analytics',
        'Inventory used in mobile apps only',
        'B',
        'Chapter 1-6',
        'Medium'
    ),
    (
        'Which of these is NOT a common display ad format?',
        'MP4',
        'GIF',
        'HTML5',
        'JPEG',
        'A',
        'Chapter 1-6',
        'Medium'
    ),
    (
        'What term refers to the actual place an ad loads on a page?',
        'Creative',
        'Ad Slot',
        'Campaign',
        'Click-through',
        'B',
        'Chapter 1-6',
        'Easy'
    ),
    (
        'What is CTR used to measure?',
        'Ad impressions',
        'Ad effectiveness',
        'User engagement',
        'Click-through rate',
        'D',
        'Chapter 1-6',
        'Easy'
    ),
    (
        'What pricing model is best for brand awareness?',
        'CPA',
        'CPC',
        'CPM',
        'CPL',
        'C',
        'Chapter 1-6',
        'Medium'
    ),
    (
        'What metric is typically highest in retargeting campaigns?',
        'Viewability',
        'Reach',
        'CTR',
        'Cost',
        'C',
        'Chapter 1-6',
        'Medium'
    ),
    (
        'What was DoubleClick known for?',
        'Making websites',
        'Creating banner designs',
        'Building one of the first ad networks',
        'Measuring mobile traffic',
        'C',
        'Chapter 1-6',
        'Medium'
    ),
    (
        'Why was the waterfall model inefficient for publishers?',
        'High viewability',
        'Increased fraud',
        'Slower load times & poor yield',
        'Limited targeting',
        'C',
        'Chapter 1-6',
        'Hard'
    ),
    (
        'What is a premium inventory slot?',
        'Free ad space',
        'Least visible space',
        'Top-converting space',
        'Highly visible, high-demand ad space',
        'D',
        'Chapter 1-6',
        'Medium'
    ),
    (
        'What is behavioral targeting based on?',
        'Device type',
        'User’s previous actions',
        'Ad size',
        'Color of content',
        'B',
        'Chapter 7-16',
        'Medium'
    ),
    (
        'What is a DMP primarily used for?',
        'Running auctions',
        'Buying ads',
        'Storing and organizing data',
        'Analyzing page views',
        'C',
        'Chapter 7-16',
        'Medium'
    ),
    (
        'What auction type charges the second-highest bid?',
        'First-price',
        'Soft-price',
        'Second-price',
        'Dutch auction',
        'C',
        'Chapter 7-16',
        'Medium'
    ),
    (
        'Which of the following is a major challenge in mobile user identification?',
        'Fingerprinting accuracy',
        'Too many users',
        'App crashes',
        'Limited ad size',
        'A',
        'Chapter 7-16',
        'Hard'
    ),
    (
        'Which law regulates digital advertising privacy in the EU?',
        'CAN-SPAM',
        'GDPR',
        'CCPA',
        'PECR',
        'B',
        'Chapter 7-16',
        'Easy'
    ),
    (
        'Which tool helps detect fraudulent ad activity?',
        'Ad server',
        'DSP',
        'Verification service',
        'Bidder',
        'C',
        'Chapter 7-16',
        'Medium'
    ),
    (
        'What is the main role of a data broker?',
        'Buy impressions',
        'Connect DSPs to SSPs',
        'Sell user data segments',
        'Create landing pages',
        'C',
        'Chapter 7-16',
        'Medium'
    ),
    (
        'What does a DSP connect to for buying inventory?',
        'Publishers directly',
        'SSPs or exchanges',
        'Creative studios',
        'CDNs',
        'B',
        'Chapter 7-16',
        'Medium'
    ),
    (
        'What is an Agency Trading Desk (ATD)?',
        'A programmatic media buyer within an agency',
        'A content marketplace',
        'A publisher reporting tool',
        'An analytics dashboard',
        'A',
        'Chapter 7-16',
        'Medium'
    ),
    (
        'What does "walled garden" refer to?',
        'Open-source ad server',
        'User session tracking',
        'A closed ecosystem like Google or Facebook',
        'Cookie-free marketing',
        'C',
        'Chapter 7-16',
        'Easy'
    );
CREATE VIEW user_stats AS
SELECT u.id,
    u.username,
    COUNT(qr.id) as total_quizzes,
    AVG(qr.score) as average_score,
    MAX(qr.score) as best_score,
    SUM(qr.total_questions) as total_questions_attempted,
    SUM(qr.correct_answers) as total_correct_answers,
    ROUND(
        (
            SUM(qr.correct_answers) / SUM(qr.total_questions)
        ) * 100,
        2
    ) as accuracy
FROM users u
    LEFT JOIN quiz_results qr ON u.id = qr.user_id
GROUP BY u.id,
    u.username;
CREATE VIEW leaderboard AS
SELECT u.username,
    MAX(qr.score) as best_score,
    COUNT(qr.id) as total_quizzes,
    AVG(qr.score) as average_score,
    SUM(qr.correct_answers) as total_correct,
    SUM(qr.total_questions) as total_questions,
    ROUND(
        (
            SUM(qr.correct_answers) / SUM(qr.total_questions)
        ) * 100,
        2
    ) as accuracy
FROM users u
    LEFT JOIN quiz_results qr ON u.id = qr.user_id
GROUP BY u.id,
    u.username
HAVING best_score IS NOT NULL
ORDER BY best_score DESC,
    average_score DESC;