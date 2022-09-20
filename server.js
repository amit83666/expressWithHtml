const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');


const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
let path = __dirname + "/public";
let port=7000;

app.get("/", (req, res) => {
    res.sendFile("welcome.html");
})
app.get("/api/register", (req, res) => {
    res.sendFile('register.html',{root:path});
})
app.get("/api/login", (req, res) => {
    res.sendFile("login.html",{root:path});
})

app.post("/api/login", (req, res) => {
    let url = req.url;
    let userData = req.body;
    let fileName = "credentials.json";
    fs.readFile(fileName, (err, data) => {
        let streCredentials = data.toString();
        let credentials = JSON.parse(streCredentials);
        let userFound = credentials.find((user) => (user.email === userData.email && user.password === userData.password))
        if (userFound) {
           //res.send("welcome");
          // res.sendFile(__dirname + "/public/welcome.html");
          res.sendFile("welcome.html",{root:path});
        }
        else {
           res.send("invalid");
        }
    })
})

app.post("/api/register", (req, res) => {
    let duplicate;
    let userData = req.body;
    let fileName = "credentials.json";
    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.log("some thing went gone please contact to admin..");
        } else {
            let strCredentials = data.toString();
            let credentials = JSON.parse(strCredentials);
            credentials.filter((data) => {
                if (data.email == req.body.email) {
                    duplicate = true;
                }
            })

            if (duplicate == true) {
                console.log("Email has already registered...");
                res.send("Email has already existed. Please try with a different email...");
            } else {
                console.log("data not matched");
                credentials.push(userData);
                strCredentials = JSON.stringify(credentials);
                fs.writeFile(fileName, strCredentials, () => {
                    console.log("new user registered into credentials");
                    res.send("new user registered into credentials");
                });
            }
        }
    });
});


app.listen(port, () => {
    console.log(`server is listening on port no. ${port}`);
})