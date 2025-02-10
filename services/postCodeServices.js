const { error } = require("console");
const db = require("../utils/dbQuery");
const sql = require("./../utils/postCodeServiceSQL");
const sqlDelete = require("./../utils/deletePosts");

const fs = require('fs').promises;

async function insertPostCode(username, description, path, number) {
    try {
        await db.promise().beginTransaction();

        let user_id = 0;
        if (username !== "abcdefghijklmnopqrstuvwxyz") {
            const [userResult] = await db.promise().query(sql.getUserId, [username]);
            if (userResult.length === 0) {
                console.error(`User with username ${username} not found.`);
                await db.promise().rollback();
                return false;
            }
            user_id = userResult[0].id;
        }

        const [insertResult] = await db.promise().query(sql.insertPostCode, [user_id, description, new Date(), number]);

        if (insertResult.affectedRows > 0) {
            const upload_id = insertResult.insertId;

            const [versionInsertResult] = await db.promise().query(sql.insertUploadVersion, [upload_id, 0, path, description, new Date()]);

            if (versionInsertResult.affectedRows > 0) {
                await db.promise().commit();
                console.log(`Post code and version inserted successfully for user ${username}.`);
                return upload_id;
            } else {
                console.log(`Failed to insert upload version for post code with id ${upload_id}.`);
                await db.promise().rollback();
                return null;
            }
        } else {
            console.log(`Failed to insert post code for user ${username}.`);
            await db.promise().rollback();
            return null;
        }
    } catch (error) {
        await db.promise().rollback();
        console.error("Error inserting post code:", error);
        throw error;
    }
}

async function getMyUploads(username) {
    try {
        const [userResult] = await db.promise().query(sql.getUserId, [username]);
        if (userResult.length === 0) {
            console.error(`User with username ${username} not found.`);
            return null;
        }

        const user_id = userResult[0].id;
        const [result] = await db.promise().query(sql.getUploads, [user_id]);

        return result;
    } catch (error) {
        console.error("Error getting uploads:", error);
        throw error;
    }
}

async function getUploadDetail(id) {
    try {
        const [userResult] = await db.promise().query(sql.getUpload, [id]);
        const [userResult2] = await db.promise().query(sql.getDescription, [id]);
        if (userResult.length === 0) {
            console.error(`Post with id ${id} not found`);
            throw new Error('Post not found');
        }

        const filePath = userResult[0].path;
        const idPost = userResult[0].id;
        const fileContent = await fs.readFile(filePath, 'utf8');
        return { idPost, text: fileContent, description: userResult2[0].description };

    } catch (error) {
        console.error("Error getting uploads:", error);
        throw error;
    }
}

function getStringAfterLastDot(inputString) {
    const parts = inputString.split('.');
    return parts[parts.length - 1];
}

async function getToBeEditedDetails(id){
    try{
        const [maxAndPathVersion] = await db.promise().query(sql.getMaxVersionNr, [id]);
        let maxVersion = maxAndPathVersion[0].version_nr + 1; // Incrementing version_nr by 1
        const typeOfFile = getStringAfterLastDot(maxAndPathVersion[0].path);

        return {maxVersion, typeOfFile};


    } catch(error) {
        console.error("Error getting and putting uploads:", error);
        throw error;
    }
}

async function insertNewPost(id, path, version, description, date) {
    try {
        const [insertedDetails] = await db.promise().query(sql.insertUploadVersion, [id, version, path, description, date]);

        if (insertedDetails && insertedDetails.affectedRows > 0) {
            return id; 
        } else {
            return null; 
        }
    } catch (error) {
        console.error("Error inserting new post:", error);
        throw error; 
    }
}

async function getMyOldPosts(id){
    try {
        const [uploads] = await db.promise().query(sql.getAllVersions, [id]);
        if(uploads.length == 0){
            console.error(`Post with id ${id} not found`);
            return null;
        }

        return uploads;
    } catch (err){
        console.error(`Error getting posts: `, err);
        throw err;
    }

}

async function deletePostById(username, id) {
    try {
      const [paths] = await db.promise().query(sqlDelete.getPathsFromUploadVersion, [id]);
  
      await db.promise().query(sqlDelete.deleteFromUserUploads, [id, id]);
      await db.promise().query(sqlDelete.deleteFromUploadVersion, [id]);
      
  
      for (const { path } of paths) {
        try {
          await fs.unlink(path);
        } catch (err) {
          console.error(`Error deleting file at path ${path}:`, err);
        }
      }
  
      await db.promise().query(sqlDelete.deleteFromUploads, [id]);
  
     // await db.promise().query(sqlDelete.deleteFromUserUploads, [id]);
  
      console.log(`Successfully deleted post with id ${id}`);
    } catch (err) {
      console.error(`Error deleting post with id ${id}:`, err);
      throw err;
    }
  }


module.exports = {
    insertPostCode,
    getMyUploads,
    getUploadDetail,
    getToBeEditedDetails,
    insertNewPost,
    getMyOldPosts,
    deletePostById
};
