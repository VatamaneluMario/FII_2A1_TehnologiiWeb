const { checkExistence } = require('./../services/loginServices');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key_here'; 

async function login(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const requestData = JSON.parse(body);
            const username = requestData.username;
            const password = requestData.password;

            const userStatus = await checkExistence(username, password);

            if (userStatus === 2) { // Admin user
                const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ token: token, role: "admin" }));
            } else if (userStatus === 1) { // Regular user
                const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ token: token, role: "regular" }));
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