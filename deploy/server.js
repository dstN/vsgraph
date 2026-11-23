/* eslint-disable */
// Startup file for Phusion Passenger on Netcup/Plesk (Application Startup File: server.js).
// The deploy renames Next's generated standalone server.js to next-server.js and puts this
// file in its place. It writes lifecycle events, crashes and memory use to a log outside the
// app root, which every deploy replaces. No request data and no IP addresses are logged.
const fs = require('fs');
const path = require('path');

const MAX_BYTES = 1024 * 1024;
const candidates = [
  process.env.APP_LOG_DIR,
  path.resolve(__dirname, '..', 'vsgraph-logs'),
  path.join(__dirname, 'tmp'),
].filter(Boolean);

let logFile = null;
for (const dir of candidates) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    logFile = path.join(dir, 'app.log');
    break;
  } catch (e) {}
}

function log(msg) {
  if (!logFile) return;
  try {
    if (fs.existsSync(logFile) && fs.statSync(logFile).size > MAX_BYTES) {
      fs.renameSync(logFile, logFile + '.1');
    }
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] pid ${process.pid} ${msg}\n`);
  } catch (e) {}
}

function memory() {
  const m = process.memoryUsage();
  const mb = (n) => Math.round(n / 1048576) + 'MB';
  return `rss ${mb(m.rss)} heap ${mb(m.heapUsed)}/${mb(m.heapTotal)} external ${mb(m.external)}`;
}

log(`start, node ${process.version}, ${memory()}`);
// Only log. If Next has not registered its own handler, keep Node's default and end the
// process, so Passenger starts a fresh one instead of leaving a broken one running.
for (const event of ['uncaughtException', 'unhandledRejection']) {
  process.on(event, (err) => {
    log(`${event}: ${(err && err.stack) || err}`);
    if (process.listenerCount(event) === 1) process.exit(1);
  });
}
for (const sig of ['SIGTERM', 'SIGINT', 'SIGHUP']) {
  process.on(sig, () => {
    log(`${sig} received, ${memory()}`);
    if (process.listenerCount(sig) === 1) process.exit(0);
  });
}
process.on('exit', (code) => log(`exit code ${code}, uptime ${Math.round(process.uptime())}s, ${memory()}`));
setInterval(() => log(memory()), 10 * 60 * 1000).unref();

require('./next-server.js');
