const { addUser } = require('./../services/registerServices');


async function registerUser(req, res) {
    let body = '';
    
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // When the entire body has been received
    req.on('end', async () => {
        try {
            const requestData = JSON.parse(body);

            const username = requestData.username;
            const password = requestData.password;

            await addUser(username, password);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ "status": "ok", "message": "User added to db" }));
           
        } catch (error) {
            console.error("Error during login:", error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "User coulnd t be added" }));
        }
    });
}

module.exports = {
    registerUser
};
