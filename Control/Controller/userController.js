const express = require("express");
const router  = express.Router();
const pool    = require("../server");

const { registerUser, loginUser, getUserDetails, updateUserDetails, updatePassword } = require("../../DataBase/registrationPSQL");
const { addToLibrary, addToHistory } = require("../../DataBase/HistoryNLibPSQL");

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

module.exports = {
    logout,
    registerUser,
    loginUser,
    getUserDetails,
    updateUserDetails,
    updatePassword,
    addToLibrary,
    addToHistory
};