const db = require("../utils/dbQuery");
const { getPasswordByUsername, updatePassword } = require("../utils/changePasswordSQL");

async function changeUserPassword(username, currentPassword, newPassword) {
    try {
        const [rows] = await db.promise().query(getPasswordByUsername, [username]);
        if (rows.length === 0) {
            return false;
        }
        const user = rows[0];

        if (user.password !== currentPassword) {
            return false;
        }

        await db.promise().query(updatePassword, [newPassword, username]);
        return true;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
}

module.exports = {
    changeUserPassword
};
