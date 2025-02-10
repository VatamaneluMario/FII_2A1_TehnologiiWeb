const uploadVersionSQL = {
    // toate detaliile unei versiuni
    getById : `SELECT * from uploadVersion where id = ?`,
    
    // dupa o anumitra specificatie
    getByVersionAndUploadIds : `SELECT * from uploadVersion where upload_id = ? & version_nr = ?`,
    
    // pentru a lua versiunile anrterioare
    getAllVersions: "SELECT * FROM uploadVersion WHERE upload_id = ?",

    // luam id ul postarii dupa versiune
    getFromVersion: `SELECT * from uploadVersion where upload_id = ? & version_nr = ?`,

    // toate postarile
    getAllPosts: `SELECT * FROM upload`


};

module.exports = uploadVersionSQL;
 