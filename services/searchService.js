const db = require("../utils/dbQuery");
const sqlSearch = require("./../utils/searchSQL");
const sqlUser = require("../utils/usersSQL");

async function searchPostsByTitle(title) {
    try {
        const [rows, fields] = await db.promise().query(sqlSearch.searchByTitle, [title]);
        return rows;
    } catch (error) {
        console.error("Error searching posts by title:", error);
        throw error;
    }
}

async function searchUserByName(name) {
    try {
        const [rows, fields] = await db.promise().query(sqlUser.getAllMatching, name);
        return rows;
    } catch (error) { 
        console.error("Error searching posts by title:", error);
        throw error;
    }
}

module.exports = {
    searchPostsByTitle,
    searchUserByName
};
