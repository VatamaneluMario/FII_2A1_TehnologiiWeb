const http = require('http');
const fs = require('fs');
const path = require('path');
const { login } = require('./controller/loginController');
const { registerUser } = require('./controller/registerController');
const { handleFileUpload, handleFileUploadForUserGuest, getUserData, getUploadDetails, handleTextUpload, getOldPosts, handleDeletePost, getUserDataByName } = require('./controller/postCodeController');

const {getAllUsers, getAllUsersMatching, deleteUser } = require('./controller/usersController');

// pentru stergrea automata a postarilor
const { scheduleCronJobs } = require('./utils/cronJobs');

// pentru uploadVersion:
const { getUploadInfoById, getUploadInfo, getAllUploadInfo, getAllUploads, deletePost} = require('./controller/uploadVersionController');
const { searchPosts, searchUsers } = require('./controller/searchController');
const { userPage, getAllUserInfo } = require('./controller/userController');
const { putContribuitor, getContribuitors, verifyContribuitor } = require ('./controller/posts_colabsControler');
const { changePassword } = require('./controller/changePasswordController'); 
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key_here';

function getQueryParams(url) {
    const queryString = url.split('?')[1];
    const params = new URLSearchParams(queryString);
    return Object.fromEntries(params.entries());
}

function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    // fetch utile pentru paginile html: 
    if (req.url === '/' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'welcome.html'), 'text/html');
    } else if (req.url === '/' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'welcome.html'), 'text/html');
    } else if (req.url === '/AboutUs' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'AboutUs.html'), 'text/html');
    } else if (req.url === '/user/searchResults' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'search.html'), 'text/html');
    } else if (req.url === '/user/searchResult/visitPost' && req.method === 'GET') { // la user o sa avem toate postarile acestuia
        serveFile(res, path.join(__dirname, 'front', 'visitPost.html'), 'text/html');
    } else if (req.url === '/user/searchResult/visitUser' && req.method === 'GET') { // la user o sa avem toate postarile acestuia
        serveFile(res, path.join(__dirname, 'front', 'visitProfile.html'), 'text/html');
    } else if (req.url === '/user' && req.method === 'GET') { // la user o sa avem toate postarile acestuia
        serveFile(res, path.join(__dirname, 'front', 'user.html'), 'text/html');
    } else if (req.url === '/admin' && req.method === 'GET') { // la user o sa avem toate postarile acestuia
        serveFile(res, path.join(__dirname, 'front', 'userAdmin.html'), 'text/html');
    } else if (req.url === '/user/upload' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'uploads.html'), 'text/html');
    } else if (req.url.startsWith('/user/userPage') && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'userPage.html'), 'text/html');
    } else if (req.url === '/register' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'CreateAccount.html'), 'text/html');
    }  else if (req.url === '/PIt_Documentatie_Sarghi_Vatamanelu.html' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'PIt_Documentatie_Sarghi_Vatamanelu.html'), 'text/html');
    } 

    // paginile de guest
    else if (req.url === '/userGuest' && req.method === 'GET') { 
        serveFile(res, path.join(__dirname, 'front', 'userGuest.html'), 'text/html');
    } else if (req.url === '/userGuest/searchResults' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'front', 'search.html'), 'text/html');
    } else if (req.url.match('\.css$')) {
        serveFile(res, path.join(__dirname, 'front', req.url), 'text/css');
    } else if (req.url.match('/Poze/')) {
        serveFile(res, path.join(__dirname, 'front', req.url), 'image/jpeg');
    } else if (req.url === '/userGuest/searchResult/visitPost' && req.method === 'GET') { // la user o sa avem toate postarile acestuia
        serveFile(res, path.join(__dirname, 'front', 'visitPost.html'), 'text/html');
    } else if (req.url === '/userGuest/visitPost' && req.method === 'GET') { // la user o sa avem toate postarile acestuia
        serveFile(res, path.join(__dirname, 'front', 'visitPost.html'), 'text/html');
    } else if (req.url === '/userGuest/searchResult/visitUser' && req.method === 'GET') { // la user o sa avem toate postarile acestuia
        serveFile(res, path.join(__dirname, 'front', 'visitProfile.html'), 'text/html');
    } else if (req.url === '/userAdmin/visitPost' && req.method === 'GET') { // la user o sa avem toate postarile acestuia
        serveFile(res, path.join(__dirname, 'front', 'visitPost.html'), 'text/html');
    }

    // pentru login si inregistrarea contului: 
    else if (req.url === '/login' && req.method === 'POST') {
        login(req, res);
    }
    else if (req.url === '/register' && req.method === 'POST') {
        registerUser(req, res);
    }

    // pentru profilul de user: 
    else if (req.url === '/user/data' && req.method === 'GET') {
        getUserData(req, res);
    } else if (req.url.startsWith('/user/data') && req.method === 'GET') {
        getUserDataByName(req, res);
    } 
    else if (req.url.startsWith('/user/stats') && req.method === 'GET') {
        const queryParams = getQueryParams(req.url);
        req.query = queryParams;
        userPage(req, res);
    } else if (req.url === '/user' && req.method === 'POST') {
        handleFileUpload(req, res);
    } else if (req.url === '/user' && req.method === 'DELETE') {
        handleDeletePost(req, res);
    } else if (req.url === '/userGuest' && req.method === 'POST') {
        handleFileUploadForUserGuest(req, res);
    }

    // pentru pagina cu cod: 
    else if (req.url.startsWith('/api/uploadsDetails/rollBack/oldVersion') && req.method === 'GET') { 
        getUploadInfoById(req, res);
    } else if (req.url.startsWith('/api/uploadsDetails/rollBack') && req.method === 'GET') { 
        getAllUploadInfo(req, res);
    } else if (req.url.startsWith('/api/uploadsDetails') && req.method === 'GET') { 
        getUploadDetails(req, res);
    } else if (req.url.startsWith('/api/uploadsDetails') && req.method === 'PUT') { 
        handleTextUpload(req, res);
    }

    // pentru detalii despre useri
    else if (req.url === '/api/users' && req.method === 'GET') {
        getAllUsers(req, res);
    }
    else if (req.url === '/api/users' && req.method === 'DELETE') {
        deleteUser(req, res);
    }
    else if (req.url === '/api/posts' && req.method === 'GET') {
        getAllUploads(req, res);
    }
    else if (req.url === '/api/posts' && req.method === 'DELETE') {
        handleDeletePost(req, res);
    }
    else if (req.url.startsWith('/api/users') && req.method === 'GET') {
        console.log("cautare matching");
        getAllUsersMatching(req, res);
    } 
    
    // Ruta pentru căutare:
    else if (req.url.startsWith('/api/searchResults/posts') && req.method === 'GET') {
        searchPosts(req, res);
    }
    else if (req.url.startsWith('/api/searchResults/users') && req.method === 'GET') {
        searchUsers(req, res);
    }

    // pentru contribuitorii
    else if (req.url.startsWith('/api/Contributors') && req.method === 'POST') {
        putContribuitor(req, res);
    }
    else if(req.url.startsWith('/api/Contributors/checkRole') && req.method === 'GET'){
        console.log("verific contribuitorul");
        verifyContribuitor(req, res);
    }
    else if(req.url.startsWith('/api/Contributors') && req.method === 'GET'){
        console.log("acii");
        getContribuitors(req, res);
    }
    
    // pentru schimbarea parolei
    else if (req.url === '/changePassword' && req.method === 'POST') {
        try {
            const body = await parseRequestBody(req);
            req.body = body;
            changePassword(req, res);
        } catch (error) {
            console.error("Error processing request:", error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid request body" }));
        }
    }
    
    else {
        console.log(req.url);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            console.error('Error reading file:', filePath, err);  // Log the specific error and file path
            res.writeHead(500);
            res.end('Server Error: Unable to read file');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    scheduleCronJobs(); 
});