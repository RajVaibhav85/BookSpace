const express = require("express");
const router = express.Router();

const {registerUser,loginUser} = require("../../DataBase/registrationPSQL");
router.post("/register", registerUser);
router.post("/login",loginUser);
// logout route destroys the session
router.get('/logout', (req, res) => {
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
});
module.exports = router;