const pool = require('../Control/server');

async function addFeedback(userid, bookid, rating, comment) {
    const sql = `INSERT INTO feedback (user_id, bookid, rating, comment, time, date) 
                 VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_DATE) 
                 RETURNING *`;
    const result = await pool.query(sql, [userid, bookid, rating, comment]);
    return result.rows[0];
}

async function deleteFeedback(userid, bookid) {
    const sql = 'DELETE FROM feedback WHERE user_id = $1 AND bookid = $2 RETURNING *';
    const result = await pool.query(sql, [userid, bookid]);
    return result.rows[0];
}

async function feedbacksbyUser(userid) {
    const sql = 'SELECT * FROM feedback WHERE user_id = $1';
    const result = await pool.query(sql, [userid]);
    return result.rows;
}

async function feedbacksByBook(bookid) {
    const sql = 'SELECT * FROM feedback WHERE bookid = $1';
    const result = await pool.query(sql, [bookid]);
    return result.rows;
}

async function getFeedbackByUserAndBook(userid, bookid) {
    const sql = 'SELECT * FROM feedback WHERE user_id = $1 AND bookid = $2';
    const result = await pool.query(sql, [userid, bookid]);
    return result.rows[0];
}

module.exports = { 
    addFeedback, 
    deleteFeedback, 
    feedbacksbyUser, 
    feedbacksByBook, 
    getFeedbackByUserAndBook 
};