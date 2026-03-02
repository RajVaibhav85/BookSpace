const pool = require('../Control/server');

async function registerUser(req,res) {
    const {username , password , email} = req.body;
    const sql = 'INSERT INTO registration (name, password, email, type) VALUES ($1, $2, $3, $4);'
    const values = [username, password, email, "user"];

    if(!usernameMatch(username)){
        res.send("Username doesnt Meet Regex ^[A-Z][A-Za-z]+[0-9]+")
    }
    
    try{
        pool.query(sql,values);
        res.redirect("/login")
    }catch(err){
        console.error("Got error in insertio : ",err);
        res.status(500).send("Registration failed");
    }
}

async function loginUser(req,res) {
    const {username,password} = req.body;
    const sql = 'SELECT * FROM registration WHERE name=$1 AND password=$2;'
    const values = [username,password];
    const result = await pool.query(sql,values);
    if(result.rows.length>0){
        res.redirect("/home")
    }else{
       
        res.status(500).send("login failed");
    }
}

module.exports = {registerUser,loginUser};

function usernameMatch(input) {
    var regex = /^[A-Z][A-Za-z]+[0-9]+$/;
    return regex.test(input);
}