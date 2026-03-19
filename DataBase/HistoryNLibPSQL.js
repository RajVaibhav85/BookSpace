const pool = require('../Control/server');

// HISTORY
async function getHistoryByUser(userid) {
    const sql = 'SELECT * FROM history WHERE user_id = $1 ORDER BY viewed_at DESC';
    const result = await pool.query(sql, [userid]);
    return result.rows;
}

const addToHistory = async (req , res) => {
    // const sql = 'INSERT INTO history (user_id, book_id) VALUES ($1, $2) RETURNING *';
    // const result = await pool.query(sql, [userid, bookid]);
    // return result.rows[0];


    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const { mangaId } = req.body;

    if (!mangaId)
        return res.status(400).json({ error: 'Missing mangaId' });

    try {
        await pool.query(
            `INSERT INTO history (book_id, user_id)
             VALUES ($1, $2)
             ON CONFLICT ON CONSTRAINT unique_history_entry
             DO UPDATE SET viewed_at = CURRENT_TIMESTAMP`,
            [mangaId, userId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Bookmark DB error:', err.message);
        res.status(500).json({ error: err.message });
    }
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

const addToLibrary = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const { mangaId, chapter } = req.body;

    if (!mangaId || chapter === undefined)
        return res.status(400).json({ error: 'Missing mangaId or chapter' });

    try {
        await pool.query(
            `INSERT INTO library (book_id, user_id, bookmark)
             VALUES ($1, $2, $3)
             ON CONFLICT ON CONSTRAINT unique_library_entry
             DO UPDATE SET bookmark = $3, joined_on = CURRENT_TIMESTAMP`,
            [mangaId, userId, chapter]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Bookmark DB error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

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