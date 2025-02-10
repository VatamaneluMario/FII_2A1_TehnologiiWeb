const searchSQL = {
    searchByTitle :` SELECT * FROM upload WHERE description LIKE  '%' || ? || '%'`
}

module.exports = searchSQL;
