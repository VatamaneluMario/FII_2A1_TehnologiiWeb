const multer = require("multer");
const jwt = require("jsonwebtoken");
const path = require("path");
const {
  insertPostCode,
  getMyUploads,
  getUploadDetail,
  getToBeEditedDetails,
  insertNewPost,
  getMyOldPosts,
  deletePostById
} = require("./../services/postCodeServices");
const fs = require("fs");
const SECRET_KEY = "your_secret_key_here";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
 
function handleFileUpload(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "No token provided" }));
    return;
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid token" }));
      return;
    }

    const uploadMiddleware = upload.single("fileUpload");
    uploadMiddleware(req, res, async function (err) {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "File upload error" }));
        return;
      }

      const description = req.body.description;
      const numberField = req.body.number;
      console.log(numberField + " asdsa");
      const filePath = req.file.path;

      try {
        const result = await insertPostCode(
          user.username,
          description,
          filePath,
          numberField
        );

        if (result) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "File uploaded successfully",
              filePath: filePath,
              description: description,
              postId: result,
            })
          );
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Failed to insert post code" }));
        }
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Error inserting post code",
            error: error.message,
          })
        );
      }
    });
  });
}

// pentru utilizatorul neauntetificat
function handleFileUploadForUserGuest(req, res) {

  const uploadMiddleware = upload.single("fileUpload");
  uploadMiddleware(req, res, async function (err) {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "File upload error" }));
      return;
    }

    const description = req.body.description;
    const number = req.body.numberField;
    const filePath = req.file.path;

    try {
      const result = await insertPostCode("abcdefghijklmnopqrstuvwxyz", description, filePath, number);

      if (result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "File uploaded successfully",
            filePath: filePath,
            description: description,
            postId: result,
          })
        );
      } else {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Failed to insert post code" }));
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Error inserting post code",
          error: error.message,
        })
      );
    }
  });
}

async function handleTextUpload(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const id = parsedUrl.searchParams.get("id");

  if (id) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "No token provided" }));
        return;
      }

      jwt.verify(token, SECRET_KEY, async (err, user) => {
        if (err) {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid token" }));
          return;
        }

        let body = "";

        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          try {
            const jsonBody = JSON.parse(body);
            const newText = jsonBody.text;
            const description = jsonBody.description;

            const everyDetail = await getToBeEditedDetails(id);

            const uniqueSuffix =
              Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileName =
              "fileUpload-" + uniqueSuffix + "." + everyDetail.typeOfFile;
            const filePath = path.join("uploads", fileName);

            fs.writeFile(filePath, newText, async (err) => {
              if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "File saving error" }));
                return;
              }

              const currentDate = new Date();
              console.log("sunt aici? " + currentDate + " " + description);
              const newFileDetails = await insertNewPost(
                id,
                filePath,
                everyDetail.maxVersion,
                description,
                currentDate
              );

              if (newFileDetails) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message: "File uploaded successfully",
                    filePath: filePath,
                    postId: newFileDetails.id,
                  })
                );
              } else {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({ message: "Failed to insert post code" })
                );
              }
            });
          } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: err.message }));
          }
        });
      });
    } catch (err) {
      console.error("Error in updating the text file: ", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    }
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "ID is required" }));
  }
}

async function getUserData(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "No token provided" }));
      return;
    }

    let user;
    try {
      user = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid token" }));
      return;
    }

    const uploads = await getMyUploads(user.username);

    if (!uploads) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Uploads not found" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(uploads));
  } catch (err) {
    console.error("Error in getUserData controller:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

async function getUserDataByName(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const visitName = parsedUrl.searchParams.get("visitName");

  console.log(visitName + " numepe le care l viz");

  try {
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];

    // if (!token) {
    //   res.writeHead(401, { "Content-Type": "application/json" });
    //   res.end(JSON.stringify({ message: "No token provided" }));
    //   return;
    // }

    // let user;
    // try {
    //   user = jwt.verify(token, SECRET_KEY);
    // } catch (err) {
    //   res.writeHead(401, { "Content-Type": "application/json" });
    //   res.end(JSON.stringify({ message: "Invalid token" }));
    //   return;
    // }

    const uploads = await getMyUploads(visitName);

    if (!uploads) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Uploads not found" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(uploads));
  } catch (err) {
    console.error("Error in getUserData controller:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

async function getUploadDetails(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const id = url.searchParams.get("id");

  if (id) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        const uploadDetails = await getUploadDetail(id);
        const response = {
          ...uploadDetails,
        };
  
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
        return;
      }

      let user;
      try {
        user = jwt.verify(token, SECRET_KEY);
      } catch (err) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid token" }));
        return;
      }

     // const uploads = await getMyUploads(user.username);
      const uploadDetails = await getUploadDetail(id);

      const response = {
        ...uploadDetails,
        //description: uploads[0].description,
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error.message }));
    }
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "ID is required" }));
  }
}

async function getOldPosts(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const id = url.searchParams.get("id");
  if (id) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "No token provided" }));
        return;
      }

      let user;
      try {
        user = jwt.verify(token, SECRET_KEY);
      } catch (err) {
        res.writeHead(401, { "Content-type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid token" }));
        return;
      }

      const result = await getMyOldPosts(id);

      if (result) {
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(404, { "Content-type": "application-json" });
        res.end(JSON.stringify({ message: "Old posts not found" }));
      }
    } catch (err) {
      console.error("Eroor in getting the old variants");
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    }
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "ID is required" }));
  }
}

async function handleDeletePost(req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "No token provided" }));
      return;
    }

    let user;
    try {
      user = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid token" }));
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const parsedBody = JSON.parse(body);
        const postId = parsedBody.id;

        console.log("id: " + postId + " nume: " + user.username);

        await deletePostById(user.username, postId);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Post deleted successfully" }));
      } catch (err) {
        console.error("Error parsing request body or deleting post:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      }
    });
  } catch (err) {
    console.error("Error in deletePost controller:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}
module.exports = {
  handleFileUpload,
  handleFileUploadForUserGuest,
  getUserData,
  getUploadDetails,
  handleTextUpload,
  getOldPosts,
  handleDeletePost,
  getUserDataByName
};
