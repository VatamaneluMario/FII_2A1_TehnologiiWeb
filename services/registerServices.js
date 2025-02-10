const db = require("../utils/dbQuery");
const sql = require("../utils/registerSQL.js");

async function addUser(username, password, admin) {
    try {
        const adminValue = admin === true ? 1 : 0;

        const [rows, fields] = await db.promise().query(sql.add, [username, password, adminValue]);
        
        // Check if any rows were returned
        if (rows.length > 0) {
            console.log(username + " " + password + "her");
            return true;
        } else {
            console.log(username + " " + password + "false");
            return false;
        }
    } catch (error) {
        console.error("Error checking user existence:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}

module.exports = {
    addUser
};
