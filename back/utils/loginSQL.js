const loginSql = {
    check:
        "SELECT * FROM users WHERE username = ? AND password = ?"
   
}

module.exports = loginSql;
