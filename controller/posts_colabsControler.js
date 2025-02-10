const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key_here'; 

const {postNewCollab, getAllContribuitors, checkContribuitor} = require('./../services/postsColabsService')

async function putContribuitor(req, res){
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "No token provided" }));
            return;
        }

        jwt.verify(token, SECRET_KEY, async (err, user) => {
            if (err) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Invalid token" }));
                return;
            }

            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const jsonBody = JSON.parse(body);
                    const name = jsonBody.name;
                    const uploadId = jsonBody.uploadId;


                    const result = await postNewCollab(name, uploadId);

                    if(result == false){
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: "Utilizatorul neexistens sau exista deja" }));
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify("inserrare cu succes"));
                    

                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: err.message }));
                }
            });

        });

    } catch (err) {
        console.error("Error in updating the text file: ", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal server error" }));
    }

}

// async function getContribuitors(req, res){
//     const url = new URL(req.url, `http://${req.headers.host}`);
//     const id = url.searchParams.get('id');
//     try {
//         const authHeader = req.headers['authorization'];
//         const token = authHeader && authHeader.split(' ')[1];
//
//         if (!token) {
//             res.writeHead(401, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: "No token provided" }));
//             return;
//         }
//
//         jwt.verify(token, SECRET_KEY, async (err, user) => {
//             if (err) {
//                 res.writeHead(403, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify({ message: "Invalid token" }));
//                 return;
//             }
//
//             let body = '';
//
//             req.on('data', chunk => {
//                 body += chunk.toString();
//             });
//
//             req.on('end', async () => {
//                 try {
//                     const jsonBody = JSON.parse(body);
//                     const uploadId = jsonBody.uploadId;
//
//                     const result = await getAllContribuitors(uploadId);
//
//                     console.log(result);
//                     if(result == false){
//                         res.writeHead(404, { 'Content-Type': 'application/json' });
//                         res.end(JSON.stringify({ message: "Inserare nereusita" }));
//                         return;
//                     }
//
//                     res.writeHead(200, { 'Content-Type': 'application/json' });
//                     res.end(JSON.stringify(result));
//                    
//
//                 } catch (err) {
//                     res.writeHead(400, { 'Content-Type': 'application/json' });
//                     res.end(JSON.stringify({ message: err.message }));
//                 }
//             });
//
//         });
//
//     } catch (err) {
//         console.error("Error in updating the text file: ", err);
//         res.writeHead(500, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: "Internal server error" }));
//     }
// }


async function getContribuitors(req, res){
    const url = new URL(req.url, `http://${req.headers.host}`);
    const uploadId = url.searchParams.get('uploadId');
    try {
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

            

        const result = await getAllContribuitors(uploadId);
        console.log(result);
         
        if(result){
            res.writeHead(200, { 'Content-type' : 'application/json' });
            res.end(JSON.stringify(result));
        } else {
            res.writeHead(404, {'Content-type' : 'application-json' });
            res.end(JSON.stringify({message : "Contribuitors not found"}));
        }

    } catch (err) {
        console.error("Error in updating the text file: ", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal server error" }));
    }
}

async function verifyContribuitor(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const uploadId = url.searchParams.get('uploadId');
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.log("sunt aici");
            const send = false;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ send }));
            return;
        }

        let user;
        try {
            user = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid token" }));
            return;
        }

        const result = await checkContribuitor(uploadId, user.username);
        console.log(result);

        if (result === true || result === false) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ result }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Contributors not found" }));
        }
    } catch (err) {
        console.error("Error in verifying contributor: ", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Internal server error" }));
    }
}



module.exports = {
    putContribuitor,
    getContribuitors,
    verifyContribuitor
}