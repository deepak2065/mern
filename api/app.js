const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const userModal = require("./modals/userModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRound = 10;
const encryctKey = "1236547895";
const expiryTime = "30d";
const PORT = 5252;

const auth = (req, res, next)=>{
    const headers = req.headers;
    if(!headers.hasOwnProperty("authorization")){
        res.status(401).json({"msg":"Authorization header not found"});
    }
    let token  = headers.authorization;
    if(!token){
        res.status(401).json({"msg":"Token header not found"});
    }
    token = token.split("Bearer ")[1];
    jwt.verify(token,encryctKey,(err,decoded)=>{
        console.log(decoded)
        if(!decoded){
            res.status(401).json({"msg":"Invalid Token"});
        } 
    })
}

app.get("/",(req, res)=>{
    return res.send("Working")
})

app.post("/register-user", (req, res)=>{
    const userData = req.body;
    userData.password = bcrypt.hashSync(userData.password,saltRound);
    userModal.create(userData).then((doc,err)=>{
        if(err) throw(err);
        res.send(`user created with ${doc._id}`);
    }).catch((error)=>{
        throw(error);
    });
});

app.post("/login", async (req,res)=>{
    const {email,password} = req.body;
    const user = await userModal.findOne({email});
    if(!user) return res.send("Email and password not mantch.");
    const isMatch = bcrypt.compareSync(password,user.password);
    if(!isMatch) return res.send("Email and password not mantch.");
    const accessToekn = await jwt.sign({id:user._id},encryctKey,{expiresIn:expiryTime});
    return res.json({...user.toJSON(),accessToekn});
});

app.get("/users",auth,async (req,res)=>{
    const users = await userModal.find({});
    return res.json(users);
})

app.listen(PORT,(res,req)=>{
    console.log(`Sever running on http://localhost:${PORT}`);
})
