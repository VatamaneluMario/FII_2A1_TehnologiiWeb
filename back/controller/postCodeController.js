
const SECRET_KEY = 'your_secret_key_here'; // Change this to a secure random string


function handleFileUpload(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "No token provided" }));
        return;
    }

    console.log(token);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Invalid token" }));
            return;
        }

        const uploadMiddleware = upload.single('fileUpload');
        uploadMiddleware(req, res, function (err) {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "File upload error" }));
                return;
            }

            const description = req.body.description;
            const filePath = req.file.path;

            // Log the file path and description
            console.log('File uploaded to:', filePath);
            console.log('Description:', description);
            console.log('Uploaded by user:', user.username);

            // Save file info to the database
            // You will implement the database part
            // saveFileInfo(description, filePath, user.username);

            // Send response with file path and description
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "File uploaded successfully", filePath: filePath, description: description }));
        });
    });
}