const { checkExistence } = require('./../services/loginServices');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'your_secret_key_here'; // Change this to a secure random string

async function login(req, res) {
    let body = '';

    // Read the request body stream
    
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    console.log("am treecut" + body);

    // When the entire body has been received
    req.on('end', async () => {
        try {
            console.log("am treecut2");
            const requestData = JSON.parse(body);

            const username = requestData.username;
            const password = requestData.password;

            const userExists = await checkExistence(username, password);

            if (userExists) {
                const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ token: token }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Invalid username or password" }));
            }
        } catch (error) {
            console.error("Error during login:", error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
        }
    });
}

module.exports = {
    login
};
