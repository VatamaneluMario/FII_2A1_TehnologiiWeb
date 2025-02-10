const registerSql = {
    add:
        "INSERT INTO users (username, password, admin) VALUES (?, ?, ?)"
   
}

module.exports = registerSql;
