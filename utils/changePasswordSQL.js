const changePasswordSQL = {
    getPasswordByUsername: "SELECT password FROM users WHERE username = ?",
    updatePassword: "UPDATE users SET password = ? WHERE username = ?"
};

module.exports = changePasswordSQL;
