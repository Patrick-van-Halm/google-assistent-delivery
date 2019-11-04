const mysql = require('mysql');
const fs = require("fs");
var pool

function database(){
    let config = JSON.parse(fs.readFileSync("config.json"));
    pool = mysql.createPool({
        host            : config.db_host,
        user            : config.db_user,
        password        : config.db_pass,
        database        : config.db_database
    });
    this.testConnection()
}

database.prototype.testConnection = function(){
    return new Promise((resolves, rejects) => {
        pool.getConnection((err, con) => {
            if(err){
                rejects(err)
            }
            else{
                con.release();
                resolves();
            }
        })
    })
}

database.prototype.query = function(query){
    return new Promise((resolves, rejects) => {
        pool.getConnection((err, con) => {
            if(err){
                rejects(err)
            }
            else{
                con.query(query, (err, results) => {
                    if(err){
                        rejects(err)
                    }
                    else{
                        con.release()
                        resolves(results)
                    }
                })
            }
        })
    })
}

database.prototype.prepare = function(query, values){
    return new Promise((resolves, rejects) => {
        pool.getConnection((err, con) => {
            if(err){
                rejects(err)
            }
            else{
                con.query(mysql.format(query, values), (err, results) => {
                    if(err){
                        rejects(err)
                    }
                    else{
                        con.release()
                        resolves(results)
                    }
                })
            }
        })
    })
}

module.exports = database;