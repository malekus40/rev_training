const { logger } = require('./util/logger');
const http = require('http');
const fs = require('fs');
const { json } = require('stream/consumers');
const { countReset } = require('console');

const PORT = 3001;
let IDs = 0;
const server = http.createServer((req, res) => {
    let body = "";
    
    req
        .on('data', (chunk) => {
            body += chunk;
        })
        .on("end", () => {
            body = body.length > 0 ? JSON.parse(body) : {};
            const contentType = { "Content-Type": "application/json" };

            if (req.url.startsWith("/items") && req.method === 'GET') {
                fs.readFile('data.json', 'utf8', (err, data) => {
                    logger.info("Fetched data from grocery list")
                    if (err) {
                        logger.error(err);
                        res.writeHead(500, contentType)
                        return res.end(JSON.stringify({ error: "Internal Server Error" }));
                    }

                    res.writeHead(200, contentType);
                    return res.end(data)

                });
            }
            else if (req.url.startsWith("/items") && req.method === 'POST') {
                try {
                    const newItem = body; // Parse incoming request JSON
                    newItem.id = IDs;
                    IDs +=1;
                    fs.readFile('data.json', 'utf8', (err, fileData) => {
                        if (err) {
                            logger.error(err);
                            res.writeHead(500, contentType);
                            return res.end(JSON.stringify({ error: "Internal Server Error" }));
                        }

                        let data = [];

                        // Ensure the JSON file contains an array
                        try {
                            data = JSON.parse(fileData) || []; // ✅ Corrected: Parse only once
                        } catch (parseError) {
                            logger.error("Error parsing JSON file:", parseError);
                            res.writeHead(500, contentType);
                            return res.end(JSON.stringify({ error: "Invalid JSON format in file" }));
                        }

                        data.push(newItem);

                        fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8', (err) => {
                            if (err) {
                                logger.error("Error occurred at writeFile:", err);
                                res.writeHead(500, contentType);
                                return res.end(JSON.stringify({ error: "Failed to write data" }));
                            }

                            res.writeHead(201, contentType);
                            return res.end(JSON.stringify(newItem)); 
                        });
                    });

                } catch (error) {
                    logger.error("Invalid JSON in request:", error);
                    res.writeHead(400,contentType);
                    return res.end(JSON.stringify({ error: "Invalid JSON format in request body" }));
                }
            }
            else if (req.url.startsWith("/items") && req.method === 'PUT') {
                let id = parseInt(req.url.split("/")[2]);
                let indexExists = -1; //check if the index exists
                fs.readFile('data.json', 'utf8', (err, data) => {
                    logger.info("Fetched data from grocery list for updating")
                    if (err) {
                        logger.error(err);
                        res.writeHead(500, contentType)
                        return res.end(JSON.stringify({ error: "Internal Server Error" }));
                    }
                    let items = JSON.parse(data);

                    items = items.map(item => {
                        if (item.id === id){
                            let newItem = body;
                            newItem.id = id;
                            return newItem;
                        }
                        return item;
                    });
                    fs.writeFile('data.json', JSON.stringify(items, null, 2), 'utf8', (err) => {
                        if (err) {
                            logger.error("Error occurred at writeFile:", err);
                            res.writeHead(500, contentType);
                            return res.end(JSON.stringify({ error: "Failed to write data" }));
                        }

                        res.writeHead(201, contentType);
                        return res.end(JSON.stringify({message: "item was updated"})); 
                    });

                });
                
            }
            else if (req.url.startsWith("/items") && req.method === 'DELETE') {
                const id = parseInt(req.url.split("/")[2]);
                let indexExists = -1; //check if the index exists
                fs.readFile('data.json', 'utf8', (err, data) => {
                    if (err) {
                        logger.error(err);
                        res.writeHead(500, contentType)
                        return res.end(JSON.stringify({ error: "Internal Server Error" }));
                    }
                    logger.info("Fetched data from grocery list for deleting");
                    let items = JSON.parse(data);

                    items = items.filter(item => item.id !== id);
                    logger.info("After filtering: ", items.toString());
                    
                    fs.writeFile('data.json', JSON.stringify(items, null, 2), 'utf8', (err) => {
                        if (err) {
                            logger.error("Error occurred at writeFile:", err);
                            res.writeHead(500, contentType);
                            return res.end(JSON.stringify({ error: "Failed to write data" }));
                        }

                        res.writeHead(201, contentType);
                        return res.end(JSON.stringify({message: "item was removed"})); 
                    });

                });
            }
        })
})

server.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}`);
});