const usersSQL = {
    // toati useri
    getAll : `SELECT id, username from users`,

    // toati useri ce dau un match pe nume
    getAllMatching : `SELECT id, username from users where username like '%' || ? || '%'`,

    // returnam id ul dupa nume
    getFromName: `SELECT id from users where username like ?`,

    // returnam dupa id
    getFromId: `SELECT username from users where id = ?`,

    // stergem un user dupa numele sau
    deleteUserByUsername: `DELETE FROM users where username like ?`
 

};

module.exports = usersSQL;
 