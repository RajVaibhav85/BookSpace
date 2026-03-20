const pool = require('../Control/server');


async function registerUser(req, res) {
    const { username, password, email } = req.body;
    const sql    = 'INSERT INTO registration (username, password, email) VALUES ($1, $2, $3);';
    const values = [username, password, email];
    try {
        await isValidUser(username, password);
        await pool.query(sql, values);
        res.redirect('/login');
    } catch (err) {
        console.error('Got error in insertion:', err);
        const params = new URLSearchParams({ code: '401', message: err.message }).toString();
        res.status(401).redirect(`/errorpage.html?${params}`);
    }
}

async function loginUser(req, res) {
    const { username, password } = req.body;
    const sql    = 'SELECT * FROM registration WHERE username=$1 AND password=$2;';
    const values = [username, password];
    const result = await pool.query(sql, values);
    if (result.rows.length > 0) {
        try {
            req.session.userId = result.rows[0].user_id;
        } catch (e) {
            console.error('Session not available:', e);
        }
        res.redirect('/');
    } else {
        const params = new URLSearchParams({
            code: '401',
            message: 'Authentication failed. Invalid credentials.'
        }).toString();
        res.status(401).redirect(`/errorpage.html?${params}`);
    }
}

async function isValidUser(username, password) {
    const sql = 'SELECT * FROM registration WHERE username=$1';
    try {
        await pool.query(sql, [username]);
    } catch (err) {
        throw new Error('err');
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
        if (check.rows[0].password !== current_password) {
            return res.status(401).json({ error: 'Current password is incorrect.' });
        }

        await pool.query(
            'UPDATE registration SET password = $1 WHERE user_id = $2',
            [new_password, req.session.userId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

module.exports = { registerUser, loginUser, getUserDetails, updateUserDetails, updatePassword };