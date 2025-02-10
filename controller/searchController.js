const jwt = require('jsonwebtoken');
const { searchPostsByTitle, searchUserByName } = require('./../services/searchService');
const SECRET_KEY = 'your_secret_key_here';

async function searchPosts(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = url.searchParams.get('query');

    if (!query) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Query parameter is required" }));
        return;
    }

    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    // if (!token) {
    //     res.writeHead(401, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ message: "No token provided" }));
    //     return;
    // }

    // try {
    //     jwt.verify(token, SECRET_KEY);
    // } catch (err) {
    //     res.writeHead(401, { 'Content-type': 'application/json' });
    //     res.end(JSON.stringify({ message: "Invalid token" }));
    //     return;
    // }

    try {
        const results = await searchPostsByTitle(query);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
    } catch (err) {
        console.error("Error during search:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal server error" }));
    }
}


async function searchUsers(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = url.searchParams.get('query');

    if (!query) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Query parameter is required" }));
        return;
    }

    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    // if (!token) {
    //     res.writeHead(401, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ message: "No token provided" }));
    //     return;
    // }

    // try {
    //     jwt.verify(token, SECRET_KEY);
    // } catch (err) {
    //     res.writeHead(401, { 'Content-type': 'application/json' });
    //     res.end(JSON.stringify({ message: "Invalid token" }));
    //     return;
    // }

    try {
        const results = await searchUserByName(query);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
    } catch (err) {
        console.error("Error during search:", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal server error" }));
    }
}

module.exports = {
    searchPosts,
    searchUsers
};
