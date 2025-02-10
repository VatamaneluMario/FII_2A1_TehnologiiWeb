const jwt = require('jsonwebtoken');
const { changeUserPassword } = require('./../services/changePasswordService');
const SECRET_KEY = 'your_secret_key_here';

async function changePassword(req, res) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "No token provided" }));
            return;
        }

        let user;
        try {
            user = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            res.writeHead(401, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid token" }));
            return;
        }

        const username = user.username;
        const { currentPassword, newPassword } = req.body;

        if (!username || !currentPassword || !newPassword) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Username, current password, and new password are required" }));
            return;
        }

        try {
            const result = await changeUserPassword(username, currentPassword, newPassword);
            if (!result) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Current password is incorrect" }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Password changed successfully" }));
        } catch (err) {
            console.error("Error changing password:", err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Internal server error" }));
        }
    } catch (error) {
        console.error("Error processing request:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal server error" }));
    }
}

module.exports = {
    changePassword
};
