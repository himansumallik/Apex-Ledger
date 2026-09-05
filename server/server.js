import http from 'http';

const PORT = 5000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("hello from the server");
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
