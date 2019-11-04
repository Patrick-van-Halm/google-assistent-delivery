const express = require('express')
const dbObject = require("./database")
const bodyParser = require('body-parser')
const fs = require("fs")
var database;
const app = express()

const PORT = process.env.PORT || 80
const dialogFlowAppYT = require("./dialogFlowAppYT")
const dialogFlowAppDS = require("./dialogFlowAppDS")
const droneDialogFlowApp = new dialogFlowAppDS(database)

app.use("/static", express.static(__dirname + "/public"))
app.use(bodyParser.json())
app.post("/conv", dialogFlowAppYT)
app.post("/conv2", droneDialogFlowApp.dialog)

fs.appendFileSync('log.log', "App starting");
database = new dbObject()
database.testConnection().then(() => {
    app.listen(PORT, '0.0.0.0', function () {
        console.log('Webapp started!')
        fs.appendFileSync('log.log', "App started");
    })
}).catch(err => {
    fs.appendFileSync('errors.log', err);
    console.log(err)
})

