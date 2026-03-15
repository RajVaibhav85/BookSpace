const pool = require('../Control/server');

// HISTORY
async function getHistoryByUser(userid) {
    const sql = 'SELECT * FROM history WHERE user_id = $1 ORDER BY viewed_at DESC';
    const result = await pool.query(sql, [userid]);
    return result.rows;
}

async function addToHistory(userid, bookid) {
    const sql = 'INSERT INTO history (user_id, book_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(sql, [userid, bookid]);
    return result.rows[0];
}

async function deleteFromHistory(userid, bookid) {
    const sql = 'DELETE FROM history WHERE user_id = $1 AND book_id = $2 RETURNING *';
    const result = await pool.query(sql, [userid, bookid]);
    return result.rows[0];
}

// LIBRARY
async function getLibraryByUser(userid) {
    const sql = 'SELECT * FROM library WHERE user_id = $1 ORDER BY joined_on DESC';
    const result = await pool.query(sql, [userid]);
    return result.rows;
}

async function addToLibrary(userid, bookid) {
    const sql = 'INSERT INTO library (user_id, book_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(sql, [userid, bookid]);
    return result.rows[0];
}

async function deleteFromLibrary(userid, bookid) {
    const sql = 'DELETE FROM library WHERE user_id = $1 AND book_id = $2 RETURNING *';
    const result = await pool.query(sql, [userid, bookid]);
    return result.rows[0];
}

module.exports = {
    getHistoryByUser,
    addToHistory,
    deleteFromHistory,
    getLibraryByUser,
    addToLibrary,
    deleteFromLibrary
};