const express = require('express')
const mongoose = require('mongoose')
const model = require('./schema.js')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const app = express()

const secret = "secretkey";

mongoose.connect('mongodb://localhost:27017/logindetails')
    .then(() => console.log("connected to mongodb"))
    .catch((error) => console.log("error connecting to mongodb", error))

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "templates/signup.html"))
}
)

app.post('/adddetails', async (req, res) => {
    const { fname, lname, userid, password } = req.body;

    const hashedpw = await bcrypt.hash(password, 10);
    const details = new model({ fname, lname, userid, password: hashedpw });

    try {
        await details.save();

        res.redirect("/")
    }
    catch (error) {
        console.log(error);
        res.json({
            msg: "cant create account",
            error: error
        })
    }
})


app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, "templates/login.html"))
}
)
app.post('/', async (req, res) => {
    const { id, pass } = req.body;
    try {
        const user = await model.findOne({ userid: id })

        if (!user) {
            return res.send(`<h1>User not found<h1>`);
        }

        const match = await bcrypt.compare(pass, user.password);

        if (match === true) {
            const token = jwt.sign({ userid: user.userid, fname: user.fname, lname: user.lname }, secret);
            res.cookie("token", token,);
            res.redirect("/home");

        } else
            res.send(`<h1>wrong password<h1>`)
    }
    catch (error) { res.send(error) }

})


app.get('/home', (req, res) => {

    const token = req.cookies.token;
    const verify = jwt.verify(token, secret,)
    res.send(`<h1>Welcome ${verify.fname} ${verify.lname}!</h1>`);
})


app.listen(3000, () =>
    console.log("server started at port 3000")
)



