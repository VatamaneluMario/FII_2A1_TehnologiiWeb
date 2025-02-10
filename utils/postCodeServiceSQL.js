const postCodeSql = {
    // pentru a face fetch a unei pagini:
    getUpload: "SELECT id, path FROM uploadVersion WHERE upload_id = ? ORDER BY version_nr DESC LIMIT 1",

    // pentru a lua versiunile anrterioare
    getAllVersions: "SELECT id, version_nr FROM uploadVersion WHERE upload_id = ?",

    getUserId: "SELECT id FROM users WHERE username = ?",
    insertPostCode: "INSERT INTO upload (user_id, description, date, days) VALUES (?, ?, ?, ?)",
    insertUploadVersion: "INSERT INTO uploadVersion (upload_id, version_nr, path, description, date) VALUES (?, ?, ?, ?, ?)", // nou query pentru uploadVersion
    getUploads: "SELECT id, description, date FROM upload WHERE user_id = ?",
    
    getMaxVersionNr: `SELECT version_nr, path FROM uploadVersion WHERE upload_id = ? ORDER BY version_nr DESC LIMIT 1`,

    getDescription : `SELECT description from upload where id = ?`
};

module.exports = postCodeSql;
 