const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const { getById, getByVersionIdAndUploadId, getAllByUploadId, getAll} = require('./../services/uploadVersionService')
const SECRET_KEY = 'your_secret_key_here'; 


async function getUploadInfo(req, res){
    const url = new URL(req.url, `http://${req.headers.host}`);
    const uploadId = url.searchParams.get('upload_id');
    const versionId = url.searchParams.get('version_id');

    if(uploadId && versionId){
        try{
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if(!token){
                res.writeHead(401, {'Content-Type' : 'application/json'});
                res.end(JSON.stringify({message : "No token provided"}));
                return;
            }

            try {
                jwt.verify(token, SECRET_KEY);
            } catch (err) { 
                res.writeHead(401, {'Content-type' : 'application/json' });
                res.end(JSON.stringify({ message : "Invalid token" }));
                return;
            }

            const result = await getByVersionIdAndUploadId(uploadId, versionId);

            if(result){
                res.writeHead(200, { 'Content-type' : 'application/json' });
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(404, {'Content-type' : 'application-json' });
                res.end(JSON.stringify({message : "Old posts not found"}));
            }

        } catch (err) {
            console.error("Eroor in getting the old variants")
            res.writeHead(500, {'Content-Type' : 'application/json' });
            res.end(JSON.stringify({message : "Internal server error"}));
        }

    } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "ID is required" }));
    }

}

async function getUploadInfoById(req, res){
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get('id');

    if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "ID is required" }));
        return;
    }

    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    // if (!token) {
    //     res.writeHead(401, {'Content-Type' : 'application/json'});
    //     res.end(JSON.stringify({message : "No token provided"}));
    //     return;
    // }

    // try {
    //     jwt.verify(token, SECRET_KEY);
    // } catch (err) { 
    //     res.writeHead(401, {'Content-type' : 'application/json' });
    //     res.end(JSON.stringify({ message : "Invalid token" }));
    //     return;
    // }

    try {
        const result = await getById(id);
        if (!result) {
            res.writeHead(404, {'Content-type' : 'application/json' });
            res.end(JSON.stringify({message : "Data not found for provided ID"}));
            return;
        }

        if (result.path) {
            const filePath = path.join(__dirname, '../', result.path);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error("Error reading file:", err);
                    res.writeHead(500, {'Content-Type' : 'application/json'});
                    res.end(JSON.stringify({message : "Error reading file"}));
                    return;
                }
                res.writeHead(200, { 'Content-type' : 'application/json' });
                res.end(JSON.stringify({ textContent: data }));
            });
        } else {
            res.writeHead(404, {'Content-type' : 'application/json' });
            res.end(JSON.stringify({message : "File path not found"}));
        }
    } catch (err) {
        console.error("Error in getting the upload info", err);
        res.writeHead(500, {'Content-Type' : 'application/json' });
        res.end(JSON.stringify({message : "Internal server error"}));
    }
}

async function getAllUploadInfo(req, res){
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get('id');
    if(id){
    try{
        // const authHeader = req.headers['authorization'];
        // const token = authHeader && authHeader.split(' ')[1];

        // if(!token){
        //     res.writeHead(401, {'Content-Type' : 'application/json'});
        //     res.end(JSON.stringify({message : "No token provided"}));
        //     return;
        // }

        // let user;
        // try {
        //     user = jwt.verify(token, SECRET_KEY);
        // } catch (err) { 
        //     res.writeHead(401, {'Content-type' : 'application/json' });
        //     res.end(JSON.stringify({ message : "Invalid token" }));
        //     return;
        // }

        const result = await getAllByUploadId(id);
        console.log(result);

        if(result){
            res.writeHead(200, { 'Content-type' : 'application/json' });
            res.end(JSON.stringify(result));
        } else {
            res.writeHead(404, {'Content-type' : 'application-json' });
            res.end(JSON.stringify({message : "Old posts not found"}));
        }

    } catch (err) {
        console.error("Eroor in getting the old variants")
        res.writeHead(500, {'Content-Type' : 'application/json' });
        res.end(JSON.stringify({message : "Internal server error"}));
    }
    } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "ID is required" }));
    }
}

async function getAllUploads(req, res){
        try{
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if(!token){
                res.writeHead(401, {'Content-Type' : 'application/json'});
                res.end(JSON.stringify({message : "No token provided"}));
                return;
            }

            try {
                jwt.verify(token, SECRET_KEY);
            } catch (err) { 
                res.writeHead(401, {'Content-type' : 'application/json' });
                res.end(JSON.stringify({ message : "Invalid token" }));
                return;
            }

            const result = await getAll();

            if(result){
                res.writeHead(200, { 'Content-type' : 'application/json' });
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(404, {'Content-type' : 'application-json' });
                res.end(JSON.stringify({message : "Old posts not found"}));
            }

        } catch (err) {
            console.error("Eroor in getting the old variants")
            res.writeHead(500, {'Content-Type' : 'application/json' });
            res.end(JSON.stringify({message : "Internal server error"}));
        }

    } 






module.exports = {
    getUploadInfo,
    getUploadInfoById,
    getAllUploadInfo,
    getAllUploads
};