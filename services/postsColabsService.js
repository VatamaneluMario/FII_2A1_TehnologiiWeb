const db = require("../utils/dbQuery");
const sqlCollab = require("./../utils/postColabSQLjs");
const sqlUplaod = require("./../utils/uploadVersionSQL");
const sqlUser = require("./../utils/usersSQL");



async function postNewCollab(name, versionId) {
    try {

        const [rows] = await db.promise().query(sqlUser.getFromName, name);

        if (rows.length <= 0) { 
        console.error(`User with username ${name} not found.`);
        return null;
        }

        const [alreadyExists] = await db.promise().query(sqlCollab.checkExistence, [rows[0].id, versionId]);

        if(alreadyExists.length > 0){
        return false;
        }
        const [result] = await db.promise().query(sqlCollab.insertNewCollab, [rows[0].id, versionId]);

        if (result.affectedRows > 0) {
            console.log(`Collaboration successfully added. Insert ID: ${result.insertId}`);
            return true; 
        } else {
            console.log("No rows affected. Collaboration might already exist or IDs are incorrect.");
            return false; 
        }

        
    } catch (error) {
        console.error("Error inserting new colab", error);
        throw error;
    }
}

async function getAllContribuitors(upload_id) {
    try {
        console.log(upload_id);
        // Obține ID-urile utilizatorilor pentru un anumit upload
        const [IDs] = await db.promise().query(sqlCollab.getUsersIDs, [upload_id]);

        if (IDs.length === 0) {
            console.log("0 contributors");
            return [];
        }

        // Array pentru a stoca numele utilizatorilor
        const names = [];

        // Utilizăm forEach pentru a parcurge fiecare ID și a obține numele utilizatorului
        for (const idObj of IDs) {
            const [rows] = await db.promise().query(sqlUser.getFromId, [idObj.user_id]);
            if (rows.length > 0) {
                // console.log(rows[0].username);
                names.push(rows[0].username);
            }
        }

        return names;

    } catch (error) {
        console.error("Error fetching contributors", error);
        throw error;
    }
}


async function checkContribuitor(upload_id, username) {
    try {
        const [rows] = await db.promise().query(sqlUser.getFromName, username);

        if (rows.length <= 0) { 
        console.error(`User with username ${username} not found.`);
        return null;
        }

        const [alreadyExists] = await db.promise().query(sqlCollab.checkExistence, [rows[0].id, upload_id]);

        if(alreadyExists.length > 0){
        return true;
        }

        return false;
        
       

    } catch (error) {
        console.error("Error fetching contributors", error);
        throw error;
    }
}
module.exports = { 
    postNewCollab,
    getAllContribuitors,
    checkContribuitor

}
