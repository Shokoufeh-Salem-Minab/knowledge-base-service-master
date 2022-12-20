import http from "http";
import url from "url";
import {config} from "./config.mjs";
import {routeGetNames, routeUpdateName} from "./routes.mjs";

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json'); //response in json
    response.setHeader('Access-Control-Allow-Origin', '*'); //enabling CORS

    const reqUrl = url.parse(request.url).pathname;

    if (request.method === "GET") {
        if (reqUrl === "/names") {
            routeGetNames(request, response);
        }
    } else if (request.method === "POST") {
        if (reqUrl === "/update") {
            routeUpdateName(request, response);
        }
    }
    response.end();
});

server.listen(config.port, config.hostname, () => {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);
    
});

