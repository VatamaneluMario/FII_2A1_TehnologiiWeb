const http = require('http');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { login } = require('./controller/loginController');
const { registerUser } = require('./controller/registerController');
const multer = require('multer');


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const server = http.createServer((req, res) => {
    if (req.url === '/login' && req.method === 'POST') {
        login(req, res);
    } else if (req.url === '/register' && req.method === 'POST') {
        registerUser(req, res);
    } else if (req.url === '/' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'welcome.html'), 'text/html');
    } else if (req.url === '/user' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'user.html'), 'text/html');
    } else if (req.url === '/user' && req.method === 'POST') {
        handleFileUpload(req, res);
    } else if (req.url === '/register' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'CreateAccount.html'), 'text/html');
    } else if (req.url.match('\.css$')) {
        serveFile(res, path.join(__dirname, 'front', req.url), 'text/css');
    } else if (req.url.match('/Poze/')) {
        serveFile(res, path.join(__dirname, 'front', req.url), 'image/jpeg');
    } else if (req.url === '/upload' && req.method === 'POST') {
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
