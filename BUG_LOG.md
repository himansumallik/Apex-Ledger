# Bug and Fix Log

This log records findings from the login/API investigation and the changes made in that session.

## Confirmed findings and fixes

| Finding | Evidence | Status |
| --- | --- | --- |
| The deployed frontend origin was missing from the backend CORS allowlist. A request from the Netlify site to the deployed API health route returned HTTP 500. | The live frontend is `https://apexledgerlive.netlify.app`; the backend's origin allowlist did not include it. | Fixed in `server/server.js` by allowing the Netlify origin. |
| The server installed CORS middleware twice: once with unrestricted defaults and again with an origin allowlist. | Two consecutive `cors()` middleware registrations were present. | Fixed in `server/server.js` by removing the unrestricted registration and retaining the configured allowlist. |
| The client logs the submitted email and password to the browser console. | `Login.jsx` logged the full payload on submit. | Fixed in `client/src/pages/Login.jsx` by removing credential and redundant error-detail logging. |
| The README documented `MONGODB_URI`, while the server reads `MONGO_URI`. | `server/config/db.js` connects using `process.env.MONGO_URI`. | Fixed in `README.md`. |
| The README instructed running `npm run dev` in the server, but the server package only defines `npm start`. | `server/package.json` provides a `start` script and no `dev` script. | Fixed in `README.md` to use `npm start`. |

## Code corrected or added

- `server/server.js`
  - Added `https://apexledgerlive.netlify.app` to the allowed origins.
  - Added localhost and loopback origins on ports 5173 and 3000.
  - Removed the earlier unrestricted CORS middleware so the configured origin policy is applied consistently.
- `client/src/pages/Login.jsx`
  - Removed logging of the login payload, which included the password.
  - Removed redundant console output from the login error handler; the error remains displayed in the login form.
- `README.md`
  - Changed the documented MongoDB variable from `MONGODB_URI` to `MONGO_URI`.
  - Changed the documented backend start command from `npm run dev` to `npm start`.

## Not reproduced or still to verify

- The reported login HTTP 404 was not reproduced. The deployed bundle targets `https://apex-ledger-backend.onrender.com/api`, and the server code registers `POST /api/auth/signin`; however, a live health request from the Netlify origin returned HTTP 500 during investigation. The server fix must be deployed before re-testing the live login flow.
- The client production build was not verified because the available Node.js 18 runtime does not provide `node:util.styleText`, which the installed Vite/Rolldown build requires. Run the build with a compatible Node.js version.
- Client lint completed with pre-existing warnings, including a duplicate `user` key and unused `useEffect` import in `client/src/context/AuthContext.jsx`, plus hook/dependency and unused-variable warnings in other components. These were not changed as part of the login/API fix.
