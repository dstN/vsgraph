/* eslint-disable */
// This file is the entry point for Plesk Passenger.
// It starts the Next.js server.
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const logFile = path.resolve(__dirname, 'startup_log.txt');
function log(msg) {
	const line = `[${new Date().toISOString()}] ${msg}\n`;
	try {
		fs.appendFileSync(logFile, line);
	} catch (e) {}
}

log('Attempting to start Next.js app...');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	createServer((req, res) => {
		const parsedUrl = parse(req.url, true);
		handle(req, res, parsedUrl);
	}).listen(process.env.PORT || 3000, (err) => {
		if (err) {
			log('CRITICAL ERROR: Failed to start Next.js server:');
			log(err.stack || err);
			throw err;
		}
		log(`> Server ready on port ${process.env.PORT || 3000}`);
	});
}).catch((err) => {
	log('CRITICAL ERROR: Failed to prepare Next.js app:');
	log(err.stack || err);
	process.exit(1);
});
