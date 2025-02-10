const cron = require('node-cron');
const db = require("../utils/dbQuery");
const sql = require("../utils/cronJobsSQL")

async function deleteOldPosts() {
    try {
        const [results] = await db.promise().query(sql.delete);
        console.log(`Deleted ${results.affectedRows} old posts`);
    } catch (error) {
        console.error('Error deleting old posts:', error);
    } finally {
        await connection.end();
    }
}

function scheduleCronJobs() {
    cron.schedule('0 0 * * *', () => {
        console.log('Checking to delete');
        deleteOldPosts();
    });
}

module.exports = { scheduleCronJobs };