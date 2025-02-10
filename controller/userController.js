const jwt = require('jsonwebtoken');
const { getUserDataByUsername } = require('./../services/userService');
const { getUserById, getAll } = require('./../services/userService');
const SECRET_KEY = 'your_secret_key_here';

async function userPage(req, res) {
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
        if (!username) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Username is required" }));
            return;
        }

        try {
            const userData = await getUserDataByUsername(username);
            if (!userData) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "User not found" }));
                return;
            }

            const userPosts = await getUserById(userData.id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userPosts));
        } catch (err) {
            console.error("Error fetching user data:", err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Internal server error" }));
        }
    } catch (error) {
        console.error("Error processing request:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal server error" }));
    }
}

async function getAllUserInfo(req, res) {
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

        try {
            const userData = await getAll();
            if (!userData) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "User not found" }));
                return;
            }

           
        } catch (err) {
            console.error("Error fetching user data:", err);
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
    userPage,
    getAllUserInfo
};