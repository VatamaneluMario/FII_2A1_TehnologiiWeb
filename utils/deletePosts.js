const deletePosts = {
    deleteFromUploads: "DELETE FROM upload WHERE id = ?",
    getPathsFromUploadVersion: "SELECT path FROM uploadVersion WHERE upload_id = ?",
    deleteFromUploadVersion: "DELETE FROM uploadVersion WHERE upload_id = ?",
    deleteFromUserUploads: "DELETE FROM user_uploads WHERE upload_id = ? or user_id = ?",
   
}

module.exports = deletePosts;
