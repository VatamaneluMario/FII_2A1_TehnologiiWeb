const mysql = require('mysql2');

const db = mysql.createConnection({
  uri: "mysql://avnadmin:AVNS_Z2wdfjSb4C2c0hp3vfu@mysql-3b14cfc9-sarghivladut17-33b1.h.aivencloud.com:24028/defaultdb?ssl-mode=REQUIRED"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to the database.');
});

module.exports ={
  db
}