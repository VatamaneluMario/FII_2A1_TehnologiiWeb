const db = require("../utils/dbQuery");
const sql = require("./../utils/usersSQL");

async function getAll(){
    try{
        const [rows, fields] = await db.promise().query(sql.getAll);

        if (rows.length == 0) {
            console.error(`Version with id ${id} not found`);
            return null;
        }

        console.log(rows);
        return rows;
    } catch (err){
        console.error(`Error getting version details: `, err);
        throw err;
    }
}

async function getAllMatching(username){
    try{
        const [rows, fields] = await db.promise().query(sql.getAllMatching, username);

        if (rows.length == 0) {
            console.error(`Version with id ${id} not found`);
            return null;
        }

        console.log(rows);
        return rows;
    } catch (err){
        console.error(`Error getting version details: `, err);
        throw err;
    }
}

async function deleteUserByName(username){
    try{
        const [rows, fields] = await db.promise().query(sql.deleteUserByUsername, username);

        if (rows.length == 0) {
            return null;
        }

        console.log(rows);
        return rows;
    } catch (err){
        console.error(`Error getting version details: `, err);
        throw err;
    }
}


module.exports = {
    getAll,
    getAllMatching,
    deleteUserByName
};