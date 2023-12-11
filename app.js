const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
    res.json({
        mensaje:"Nodejs & JWT"
    });
});

//Se modificó
app.post("/api/login", (req, res) => {
    const user = {
        id: 1,
        nombre: "Usuario",
        email: "usuario@email.com"
    }

    jwt.sign({user: user}, 'secretkey', {expiresIn: '32s'},(err, token) => {
        res.json({
            token: token
        });
    });
});

app.post("/api/posts", verifyToken, (req, res) => {    
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if (error) {
            res.sendStatus(403);            
        } else {
            res.json({
                mensaje: "Post fue creado",
                authData
            });
        }
    });
});

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;        
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(3008, function(){
    console.log("App corriendo en puerto 3008")
})