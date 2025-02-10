const registerSql = {
    add:
        "INSERT INTO users (username, password) VALUES (?, ?)"
   
}

module.exports = registerSql;
