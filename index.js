const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

require('dotenv').config();

// Required for EC2 deployment
const path = require('path');
app.use(express.static(path.join(__dirname, “client/build”)))

const app = express();
app.set('port', process.env.PORT || 8080);

const SELECT_ALL = 'SELECT * FROM aws_matchuptable WHERE season=2018 AND week=10 AND franchise="Nick & Mickey";'

const connection = mysql.createConnection({ 
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PW, 
    database: process.env.DB_DB, 
    port: process.env.DB_PORT
});

connection.connect(err => {
    if(err) {
        return err;
    }
});






app.use(cors());

app.get('/', (req, res) => {
    res.send('go to /api to see data')
});

app.get('/seasons/see', (req, res) => {
    const { franchise, season } = req.query;
    console.log(franchise, season);
    // const SEARCH_SEASONS = "SELECT * FROM aws_matchuptable WHERE franchise= '${franchise}' AND season='${season}';"
    const SEARCH_SEASONS = "SELECT * FROM aws_matchuptable WHERE franchise= '${ franchise }' AND season= ${ season };"
    // res.send('seeing season');
    connection.query(SEARCH_SEASONS, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            // return res.send('successfully see season')
            return res.json({
                data: results
            })
        }
    });
});

app.get('/api', (req, res) => {
    connection.query(SELECT_ALL, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});


// app.listen(4000, () => {
//     console.log("Prodcuts server listening on port 4000")
// })
app.listen(app.get('port'));