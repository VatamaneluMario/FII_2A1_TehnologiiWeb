const getUserByIdQuery = `
    SELECT u.username, COUNT(p.id) AS postCount
    FROM users u
    LEFT JOIN upload p ON u.id = p.user_id
    WHERE u.id = ?
    GROUP BY u.id;
`;

const getUserUploadsQuery = `
    SELECT id, description
    FROM upload
    WHERE user_id = ?;
`;

const getUserContributionsQuery = `
    SELECT COUNT(*) AS contributionCount
    FROM user_uploads
    WHERE user_id = ?;
`;
module.exports = {
    getUserByIdQuery,
    getUserUploadsQuery,
    getUserContributionsQuery
};
