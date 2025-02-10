const db = require("../utils/dbQuery");
const sql = require("../utils/userQueries.js");
const userSQL = require("../utils/usersSQL.js");


async function getUserDataByUsername(username) {
    try {
        const query = "SELECT id FROM users WHERE username = ?";
        const [rows] = await db.promise().query(query, [username]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error("Error fetching user ID:", error);
        throw error;
    }
}

async function getUserById(userId) {
    try {
        const [userRows] = await db.promise().query(sql.getUserByIdQuery, [userId]);
        if (userRows.length === 0) {
            return null;
        }
        const user = userRows[0];
        
        // Obține numărul de contribuții
        const [contributionRows] = await db.promise().query(sql.getUserContributionsQuery, [userId]);
        user.contributionCount = contributionRows[0].contributionCount;

        const [uploadRows] = await db.promise().query(sql.getUserUploadsQuery, [userId]);
        user.uploads = uploadRows;
        return user;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

async function getAll() {
    try {
        const [userRows] = await db.promise().query(userSQL.getAll);
        if (userRows.length === 0) {
            return [];  
        }
        return userRows; 
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

module.exports = {
    getUserDataByUsername,
    getUserById,
    getAll
};
