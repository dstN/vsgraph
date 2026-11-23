# Changelog

## [0.1.2] - 2026-11-23

### Fixed
- Every deploy deleted the live app directory before uploading the new build, so the site answered with 500 for the length of the upload. The build is now uploaded next to the live app and swapped in afterwards; the previous release stays as `<app dir>.prev`.
- `/icon` and `/apple-icon` ran in the edge runtime and were rendered again on every page view. They are generated once at build time now.

### Added
- `server.js` is now a small wrapper around Next's standalone server. It writes start, shutdown (with exit code or signal), uncaught errors and memory use every 10 minutes to `vsgraph-logs/app.log` next to the app directory, so an outage leaves a trace. It logs no request data and no IP addresses.

## [0.1.1] - 2026-11-23

### Changed
- Page title, description, hero line and the method notes in the charts use commas and colons instead of dashes, and the comparison placeholder just says it is loading.
- The theme toggle is labelled in German ("Zum dunklen Design wechseln") instead of "Dark Mode".

### Fixed
- The note on the 2005 change closed "Ausländisch" with a straight quote; it uses the German closing quote now.
