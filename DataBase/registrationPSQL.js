const pool = require('../Control/server');

async function registerUser(req,res) {
    const {username , password , email} = req.body;
    const sql = 'INSERT INTO registration (username, password, email) VALUES ($1, $2, $3);'
    const values = [username, password, email];
    try{
        await isValidUser(username,password);
        await pool.query(sql,values);
        res.redirect("/login")
    }catch(err){
        console.error("Got error in insertion : ",err);
        const params = new URLSearchParams({
            code: '401',
            message : err.message
        }).toString();
        res.status(401).redirect(`/errorpage.html?${params}`)
    }
}

async function loginUser(req,res) {
    const {username,password} = req.body;
    const sql = 'SELECT * FROM registration WHERE username=$1 AND password=$2;'
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
       
        const params = new URLSearchParams({
            code: '401',
            message : "Authentication failed. Invalid credentials."
        }).toString();
        res.status(401).redirect(`/errorpage.html?${params}`)   
    }
}

async function isValidUser(username,password){
    const sql = 'SELECT * FROM registration WHERE username=$1';
    const values = [username];
    try{
        await pool.query(sql,values);
        return
    }catch(err){
       throw new Error("err");
    }
}

module.exports = {registerUser,loginUser};