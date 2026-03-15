const express = require("express");
const router = express.Router();
const pool = require("../server");

const {registerUser,loginUser} = require("../../DataBase/registrationPSQL");
// logout route destroys the session
const logout = (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				console.error('Error destroying session:', err);
			}
			res.redirect('/login');
		});
	} else {
		res.redirect('/login');
	}
};

const setBookmark = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const { mangaId, chapter } = req.body;

    if (!mangaId || chapter === undefined)
        return res.status(400).json({ error: 'Missing mangaId or chapter' });

    try {
        await pool.query(
            `INSERT INTO library (book_id, user_id, bookmark)
             VALUES ($1, $2, $3)
             ON CONFLICT ON CONSTRAINT library_unique
             DO UPDATE SET bookmark = $3, joined_on = CURRENT_TIMESTAMP`,
            [mangaId, userId, chapter]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Bookmark DB error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { 
    logout,
    registerUser,
    loginUser,
    setBookmark,
};