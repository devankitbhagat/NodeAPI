SYSTEM REQUIREMENTS:

NODE VERSION: 10.15.3
MONGO: 4.2.0
REDIS SERVER: 3.2

SET CONFIG:
All configs like port, DB URI etc has been defined in config.js and can be changed accordingly

HOW TO RUN:
1. Install dependencies
RUN: npm install

2. Seed MongoDB with dummy users
RUN: npm run seed

3. Run Node Server
RUN: npm run start

API'S:

1. ENDPOINT: /users
   FN: Creats a new user
   METHOD: POST
   BODY PARMS: name, password

2. ENDPOINT: /users
   FN: Gets users in paginated format
   METHOD: GET
   BODY PARMS: page (page number to load), limit (number of documents to return)
   Bearer token needed in auth header

3. ENDPOINT: /block
   FN: Blocks a particular user
   METHOD: POST
   BODY PARMS: userId (user whom to block)
   Bearer token needed in auth header

4. ENDPOINT: /login
   FN: Logs in a particular user
   METHOD: POST
   BODY PARMS: name, password

5. ENDPOINT: /actions
   FN: like or super like a user
   METHOD: POST
   BODY PARMS: userId (user whom to block), actionType (like or super_like)
   Bearer token needed in auth header