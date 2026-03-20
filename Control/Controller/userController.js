const express = require("express");
const router  = express.Router();
const pool    = require("../server");

const { registerUser, loginUser, getUserDetails, updateUserDetails, updatePassword, deleteAccount, logout } = require("../../DataBase/registrationPSQL");
const { addToLibrary, addToHistory, getLibraryByUser, removeFromLibrary, getHistoryByUser } = require("../../DataBase/HistoryNLibPSQL");

module.exports = {
    logout,
    registerUser,
    loginUser,
    getUserDetails,
    updateUserDetails,
    removeFromLibrary,
    updatePassword,
    addToLibrary,
    addToHistory,
    getHistoryByUser,
    getLibraryByUser,
    deleteAccount
};