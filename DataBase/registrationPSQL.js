const pool = require('../Control/server');

async function registerUser(req,res) {
    const {username , password , email} = req.body;
    const sql = 'INSERT INTO registration (name, password, email, type) VALUES ($1, $2, $3, $4);'
    const values = [username, password, email, "user"];
    try{
        await isValidUser(username,password);
        pool.query(sql,values);
        res.redirect("/login")
    }catch(err){
        console.error("Got error in insertion : ",err);
        res.status(500).send("Registration failed");
    }
}

async function loginUser(req,res) {
    const {username,password} = req.body;
    const sql = 'SELECT * FROM registration WHERE name=$1 AND password=$2;'
    const values = [username,password];
    const result = await pool.query(sql,values);
    if(result.rows.length>0){
        // set a session value so the user is considered authenticated
        try{
            req.session.user = { id: result.rows[0].id || result.rows[0].name, name: result.rows[0].name };
        }catch(e){
            // if session isn't available, still redirect but consider logging
            console.error('Session not available:', e);
        }
        res.redirect("/")
    }else{
       
        res.status(500).send("login failed");
    }
}

async function isValidUser(username,password){
    const sql = 'SELECT * FROM registration WHERE name=$1';
    const values = [username];
    try{
        await pool.query(sql,values);
    }catch(err){
        res.status(500).send("login failed");
    }
}

module.exports = {registerUser,loginUser};