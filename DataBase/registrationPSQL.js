const pool = require('../Control/server');
const bcrypt = require('bcrypt');


async function registerUser(req, res) {
    const { username, password, email } = req.body;
    try {
        await isValidUser(username);
        const hashed = await bcrypt.hash(password, 10);
        const sql = `
            INSERT INTO registration (username, password, email)
            VALUES ($1,$2,$3)
        `;
        await pool.query(sql, [username, hashed, email]);
        res.redirect('/login');
    } catch (err) {
        console.error('Got error in insertion:', err);
        const params = new URLSearchParams({
            code: '401',
            message: err.message
        }).toString();
        res.status(401).redirect(`/errorpage.html?${params}`);
    }
}

async function loginUser(req, res) {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM registration WHERE username=$1',
            [username]
        );
        if (result.rows.length === 0) {
            const params = new URLSearchParams({
                code: '401',
                message: 'Authentication failed. Invalid credentials.'
            }).toString();
            return res.status(401).redirect(`/errorpage.html?${params}`);
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            const params = new URLSearchParams({
                code: '401',
                message: 'Authentication failed. Invalid credentials.'
            }).toString();
            return res.status(401).redirect(`/errorpage.html?${params}`);
        }
        req.session.userId = user.user_id;
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}

async function isValidUser(username) {
    const sql = 'SELECT * FROM registration WHERE username=$1';
    const result = await pool.query(sql, [username]);
    if (result.rows.length > 0) {
        throw new Error('Username already exists');
    }
}

const getUserDetails = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    try {
        const result = await pool.query(
            `SELECT username, email, displayname, location,
                    TO_CHAR(joined, 'Month YYYY') AS joined_fmt,
                    reading, finished, liked, bio
             FROM registration WHERE user_id = $1`,
            [req.session.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateUserDetails = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    const { displayname, email, location, bio } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email cannot be empty.' });
    }
    try {
        await pool.query(
            `UPDATE registration
             SET displayname = $1,
                 email       = $2,
                 location    = $3,
                 bio         = $4
             WHERE user_id = $5`,
            [displayname || null, email, location || null, bio || null, req.session.userId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Update failed' });
    }
};

const updatePassword = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password || !confirm_password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    if (new_password !== confirm_password) {
        return res.status(400).json({ error: 'New passwords do not match.' });
    }
    if (new_password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    try {
        const check = await pool.query(
            'SELECT password FROM registration WHERE user_id = $1',
            [req.session.userId]
        );
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        if (bcrypt.compare(current_password, check.rows[0].password) === false) {
            return res.status(401).json({ error: 'Current password is incorrect.' });
        }
        const hashed = await bcrypt.hash(new_password, 10);
        await pool.query(
            'UPDATE registration SET password = $1 WHERE user_id = $2',
            [hashed, req.session.userId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

const deleteAccount = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    try {
        await pool.query('DELETE FROM history WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM library WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM feedback WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM registration WHERE user_id = $1', [userId]);
        req.session.destroy(err => {});
        res.json({ success: true, message: 'Account deleted successfully.' });
    } catch (err) {
        console.error("deleteAccount error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

const logout = (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) console.error('Error destroying session:', err);
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
};

module.exports = { registerUser, loginUser, getUserDetails, updateUserDetails, updatePassword, deleteAccount, logout };