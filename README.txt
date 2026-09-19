Change++ Fall 2026 Coding Challenge - Image Collections App

Name:  Mayank Tiku
Email: mayank.tiku@vanderbilt.edu


LIVE DEMO
---------
App:               https://fall2026-codingchallenge-change-mt.onrender.com/
Public collection: https://fall2026-codingchallenge-change-mt.onrender.com/public/WOIhR9uJdQR0stnD5opo

Note: this is on Render's free tier, which spins the server down after
inactivity. The first request can take about a minute to wake it up. If a
page looks stuck, wait a minute and refresh.


WHAT IT DOES
------------
A Pinterest-style app. Sign in with Google, create collections, search Pixabay,
save images into collections, remove them, share collections with other users
by email so they can edit too, and make a collection public so anyone with the
link can view it without signing in.


TECH
----
Frontend:  React + TypeScript (Vite), Mantine component library, React Router
Backend:   Node 24 + Express 5, written in TypeScript and run directly by Node
Database:  Firebase Firestore
Auth:      Firebase Authentication (Google sign-in)
Images:    Pixabay API, proxied through the backend so the key stays private


HOW TO RUN
----------
You need Node 24 or newer, a Firebase project, and a free Pixabay API key.

1. Firebase (console.firebase.google.com)
   - Create a project.
   - Build > Authentication > Sign-in method > enable Google.
   - Build > Firestore Database > Create database.
   - Project settings > General > Your apps > add a Web app. Paste its
     firebaseConfig into client/src/firebase.ts.
   - Project settings > Service accounts > Generate new private key.
     Save the file as server/serviceAccount.json.

2. Server (terminal 1)
     cd server
     npm install
     echo "PIXABAY_KEY=your_key_here" > .env
     npm run dev
   Runs on http://localhost:3000

3. Client (terminal 2)
     cd client
     npm install
     npm run dev
   Open http://localhost:5173. Vite forwards /api requests to the server.


API ENDPOINTS
-------------
All routes live under /api. Every route except /api/public requires the
Firebase ID token in the header  Authorization: Bearer <token>.

  GET    /search?q=term                          search Pixabay
  GET    /collections                            list my collections
  POST   /collections           {name}           create a collection
  GET    /collections/:id                        one collection with its images
  PATCH  /collections/:id       {name?, isPublic?}  edit settings
  DELETE /collections/:id                        delete a collection
  POST   /collections/:id/images {id, url, tags} save an image
  DELETE /collections/:id/images/:imageId        remove an image
  POST   /collections/:id/share  {email}         let another user view and edit
  GET    /public/:id                             view a public collection, no sign-in


PROJECT LAYOUT
--------------
client/src/pages/         one file per screen
client/src/api.ts         fetch helper that attaches the auth token
client/src/firebase.ts    Firebase client setup
server/src/routes/        one file per resource
server/src/middleware/    the auth check
server/src/firebase.ts    Firebase admin setup


KNOWN LIMITATIONS
-----------------
The Firestore security rules are currently set to allow all reads and writes,
so the database is effectively public. I am aware of this. All access in this
app goes through the Express server using the Firebase admin SDK, which
bypasses security rules entirely, so the server's membership check is the
only real protection right now. Proper rules are something I would write
before real use.


REFLECTION
----------
The challenge was definetly insightful and helped me brush up my react and 
deployment skills. I also deeply integrated agentic tooling (claude code) 
into this development lifecycle, which strengthen my ability to develop
alongside agents while still controlling decisions and features. I learned 
how to host a backend using express and node, since most times I have used 
serverless backends (like firebase). Overall, I am happty I more about web 
development than I did before.


FEEDBACK
--------
I feel the README.md file was very transparent, and is too easy to put into 
an agent to get a clean and well designed website with all the functionality.
If the README was a bit shorter, or an exact rubric wasn't published, it would
allow for easier differentiation between projects.
