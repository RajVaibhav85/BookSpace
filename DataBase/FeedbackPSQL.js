const pool = require('../Control/server');

const addFeedback = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const { mangaId, rating, comment } = req.body;
    if (!mangaId || !rating) return res.status(400).json({ error: 'Missing mangaId or rating' });

    try {
        await pool.query(
            `INSERT INTO feedback (user_id, bookid, rating, comment, time, date)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_DATE)
             ON CONFLICT ON CONSTRAINT unique_feedback
             DO UPDATE SET rating = $3, comment = $4, time = CURRENT_TIMESTAMP, date = CURRENT_DATE`,
            [userId, mangaId, rating, comment || null]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Feedback DB error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

async function deleteFeedback(userid, bookid) {
    const sql = 'DELETE FROM feedback WHERE user_id = $1 AND bookid = $2 RETURNING *';
    const result = await pool.query(sql, [userid, bookid]);
    return result.rows[0];
}

async function feedbacksbyUser(userid) {
    console.log("Fetching feedbacks for user:", userid);
    const sql = 'SELECT * FROM feedback WHERE user_id = $1';
    const result = await pool.query(sql, [userid]);
    return result.rows;
}

const getFeedbackByBook = async (req, res) => {
    const { bookid } = req.params;
    try {
        const result = await pool.query(
            `SELECT f.rating, f.comment, f.time, r.username
            FROM feedback f
            JOIN registration r ON f.user_id = r.user_id
            WHERE f.bookid = $1
            ORDER BY f.time DESC`,
            [bookid]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Feedback fetch error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

async function getFeedbackByUserAndBook(userid, bookid) {
    const sql = 'SELECT * FROM feedback WHERE user_id = $1 AND bookid = $2';
    const result = await pool.query(sql, [userid, bookid]);
    return result.rows[0];
}

module.exports = { 
    addFeedback, 
    deleteFeedback, 
    feedbacksbyUser, 
    getFeedbackByBook, 
    getFeedbackByUserAndBook 
};