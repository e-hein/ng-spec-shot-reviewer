developer information
=====================

project layout
--------------
- client: source of angular client app
- server: express server app
- api: shared betwenn client and server
- sample-projects: to take specshots for tests

first build
-----------
```bash
cd api; npm i; npm run build
cd ../server; npm i
cd ../client; npm i; npm run test
```
