const cronSQL = {
  deletePosts: `
            DELETE FROM upload 
            WHERE date < NOW() - INTERVAL days DAY
        `,
};

module.exports = cronSQL;
