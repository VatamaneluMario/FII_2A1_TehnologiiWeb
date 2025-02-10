const db = require("../utils/dbQuery");
const sql = require("./../utils/uploadVersionSQL");

async function getById(id){
    console.log("aici" + id);
    try{
        
        const [rows, fields] = await db.promise().query(sql.getById, [id]);
        console.log(rows);
        if (rows.length == 0) {
        console.error(`Version with id ${id} not found`);
        return null;
        }

    return rows[0];
    } catch (err){
        console.error(`Error getting version details: `, err);
        throw err;
    }
}

async function getByVersionIdAndUploadId(upload_id, version_nr){
    try{
        const version = await db.promise().query(sql.getById, [upload_id, version_nr]);
        if(version.length == 0){
            console.error(`Version with id ${id} not found`);
            return null;
        }

        return version;
    } catch {
        console.error(`Error getting version details: `, err);
        throw err;
    }
}

async function getAllByUploadId(id){
    try {
        const [uploads] = await db.promise().query(sql.getAllVersions, [id]);
        if(uploads.length == 0){
            console.error(`Post with id ${id} not found`);
            return null;
        }

        console.log(uploads);
        return uploads;
    } catch (err){
        console.error(`Error getting posts: `, err);
        throw err;
    }

}

async function getAll(){
    try {
        const [uploads] = await db.promise().query(sql.getAllPosts);
        if(uploads.length == 0){
            return null;
        }

        console.log(uploads);
        return uploads;
    } catch (err){
        console.error(`Error getting posts: `, err);
        throw err;
    }

}

module.exports = {
    getById,
    getByVersionIdAndUploadId,
    getAllByUploadId,
    getAll
};