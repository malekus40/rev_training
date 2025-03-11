const http = require('http');
const {logger} = require('./util/logger')

const PORT = 3000

const server = http.createServer((req, res) => {
    //handle request logic

    logger.info(`[${req.method}]: ${req.url}`);
    res.setHeader('Content-Type', 'application/json')
    let body = "";
    switch(req.method){
        case('GET'):
            res.statusCode = 200;
            res.end(JSON.stringify({message: "GET request handled"}));
            break;
        case('POST'):
            body = '';
            req.on('data', (chunk) => {
                body += chunk;
            })
            req.on('end', () => {
                logger.info(`Request Body: ${body}`);
                let data = JSON.parse(body);
                console.log(data.data)
                res.statusCode = 201;
                res.end(JSON.stringify({message: "POST request handled"}))
            })
            break;
        case('PUT'):
            body = '';
            req.on('data', (chunk) => {
                body += chunk;
            })
            req.on('end', () => {
                logger.info(`Request Body: ${body}`);
                let data = JSON.parse(body);
                console.log(data.data)
                res.statusCode = 200;
                res.end(JSON.stringify({message: "PUT request handled"}));
            })
            break;
        case('DELETE'):
            res.statusCode = 200;
            res.end(JSON.stringify({message: "DELETE request handled"}))
            break;
        default: 
            res.statusCode = 405;
            res.end(JSON.stringify({message: "Method not supported"}));
    }
})

server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});