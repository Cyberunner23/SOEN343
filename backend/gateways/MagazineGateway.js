const mysql = require('mysql');
const db = require('../DatabaseConnection').getInstance();
const Magazine = require('../business_objects/Magazine').Magazine;
const Exceptions = require('../Exceptions').Exceptions;

class MagazineGateway {
    
    async loadMagazines(){
        return new Promise((resolve,reject) => {
            var query= "SELECT * FROM magazines";
            db.query(query, (err,result) => {
                if(!err){
                    resolve(getMagazineArray(result));
                }else{
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })
    }
    async addMagazine(jsonMagazines){
        return new Promise((resolve,reject) => {
            var query= 'INSERT INTO magazines (title, publisher, date, language, isbn10, isbn13) VALUES(?,?,?,?,?,?)';
            var inserts= [jsonMagazines.title, jsonMagazines.publisher, jsonMagazines.date, jsonMagazines.language, 
                         jsonMagazines.isbn10, jsonMagazines.isbn13];
                
            query=mysql.format(query,inserts);

            db.query(query, (err,response) => {
                if(err){
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }else{
                   var newMagazine= new Magazine(jsonMagazines);
                   resolve(newMagazine);
                }
            }); 
        })  
    }
    async updateMagazine(jsonMagazines){
        return new Promise((resolve,reject) => {
            var query= "UPDATE magazines SET title=?, publisher=?, date=?, language=?, isbn10=? WHERE isbn13=?";
            var inserts=[jsonMagazines.title, jsonMagazines.publisher, jsonMagazines.date, jsonMagazines.language, 
                jsonMagazines.isbn10, jsonMagazines.isbn13];
            query=mysql.format(query,inserts);
            db.query(query, (err,response) => {
                if(err){
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }else{
                   resolve();
                }
            })
        })
    }
    async deleteMagazines(isbn13sToDelete){
        return new Promise((resolve, reject) => {
            var query;
            if(isbn13sToDelete)  {
                query='DELETE FROM magazines WHERE isbn13 IN (' + isbn13sToDelete.join() + ')';
            }else{
                query='Delete FROM magazines';
            }
            db.query(query, (err, result) => {
                if (!err) {
                    resolve();
                }
                else {
                    console.log(err);
                    reject(Exceptions.InternalServerError);
                }
            })
        })
    }
}

const instance = new MagazineGateway();
exports.getInstance = () => {
    return instance;
}

getMagazineArray = (jsonMagazines) => {
    var magazines = [];
    jsonMagazines.forEach((jsonMagazine) => {
        magazines.push(new Book(jsonMagazine));
    })
    return magazines;
}