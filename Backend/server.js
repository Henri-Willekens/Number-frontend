const express = require("express");
const multer = require("multer")
const bodyParser = require('body-parser');
const cors = require("cors");
const fs = require("fs");
const readline = require('readline');

var mysql = require('mysql')
 
const app = express();
//app.use(multer({dest:'./uploads/'}));

app.use(cors());
// parse application/json
app.use(bodyParser.json());
  
//create database connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'phonenumbers'
});
 
//connect to database
conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
});
 
 
//add new phonenumbers
app.post('/store-data',multer({ dest: './uploads/'}).single('inputCSV'), (req, res) => {

    let csv_filename = req.file.originalname
    if (csv_filename.length > 64) csv_filename = csv_filename.substr(0, 64)

    conn.query("INSERT INTO csv (name) VALUES (?)", [ csv_filename ], (err, results) => {
        if(err) throw err;
        const csv_id = results.insertId

        let readingInterface = readline.createInterface({ input: fs.createReadStream(req.file.path) });

        let numbers = []

        readingInterface.on('line', function (number) {
            const MAX_LENGTH = 12 + 1 //Assignment states 316123456 = 316123456xx. Therefore 12 is max length according to assignment
            const original_number = number

            if (isNaN(number.replace('x', ''))) {
                //invalid characters
                console.log('Discarding invalid number', original_number)
                return
            }

            if (number.indexOf('+3') == 0) {
                //+3110558769
                //do nothing, input is valid
            } else if (number.length > 1 && number[0] == 3) {
                //3150170012
                //add +
                number = '+' + number
            } else if (number.indexOf('003') == 0) {
                //00311086988
                //replace 00 with +
                number = '+' + number.slice(2)
            } else if (number.length >= 2 && number[0] == '0' && number[1] != '0') {
                //0502278313
                //assumes netherland, convert into +31
                number = '+31' + number.slice(1)
            }

            if (number.length > MAX_LENGTH) {
                console.log('Discarding invalid number', original_number, '(', number, ')')
                return
            }

            number = number.padEnd(MAX_LENGTH, 'x')
            numbers.push([number, csv_id])
        })
        
        readingInterface.on('close', function () {
            numbers.sort()
            conn.query("INSERT INTO phones (number, csv_id) VALUES ?", [numbers], (err, results) => {
                if(err) throw err;
                res.send(JSON.stringify({"status": 200, "error": null, "response": 'success'}));
            })
        })
        
    });
});

//read phonenumbers
app.get("/numbers", (req,res)=>{
    let csv_id = parseInt(req.query.id)
    conn.query("SELECT * FROM phones WHERE csv_id = ?", [csv_id], (err,numbers)=>{
        if(err) return res.json(err)
        conn.query("SELECT name FROM csv WHERE _id = ?", [csv_id], (err,name)=>{
            if(err) return res.json(err)
            return res.json({
                name: name[0].name,
                numbers: numbers
            })
        })
    })
})

app.get("/csv", (req,res)=>{
    conn.query("SELECT * FROM csv", (err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})
 
app.listen(3001, () => {
    console.log("Server running successfully on 3001");
});