// create web server

import http from 'http';
import fs from 'fs';
import url from 'url';
import qs from 'querystring';

const comments = [];

http.createServer((req, res) => {
    const parseUrl = url.parse(req.url);
    const pathname = parseUrl.pathname;
    if (pathname === '/') {
        fs.readFile('./index.html', (err, data) => {
            if (err) {
                throw err;
            }
            res.end(data);
        });
    } else if (pathname === '/comments') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                const comment = qs.parse(body);
                comments.push(comment);
                res.writeHead(302, { Location: '/' });
                res.end();
            });
        } else if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(comments));
        }
    } else {
        fs.readFile(`.${pathname}`, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 Not Found');
            } else {
                res.end(data);
            }
        });
    }
}).listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
    
});