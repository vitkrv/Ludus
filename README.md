# Ludus web-site
## Start development

Requires:
- Node.JS (recommended 0.10.x)
- MongoDB
- Gulp (recommended 3.8.7)
- Bower (recommended 1.3.9)

Recommended: WebStorm 10

## Setup MongoDB
You should set path to the your DB in `%project_folder%/api/config.json` in the `mongoose.uri` variable. For example, it may be `mongodb://localhost/ludus`.

## Running

Backend:

1. Go to folder `%project_folder%/api`
2. Run from CMD `npm install` (shorter `npm i`)

Frontend:

1. Go to folder `%project_folder%/app`
2. Run from CMD `npm install` (shorter `npm i`)
3. Run from CMD `bower install` (shorter `bower i`)
4. Run from CMD `gulp watch`

### Run Node.js server

If you are using WebStorm, create new *Node.js* configuration.
In this case:
- Working directory - `%project_folder%/api`
- JavaScript file - `bin\www`
- Environment variables - `DEBUG=Ludus`

If you want to start application from console, then set up environment variable:
- Windows: run in console `setx DEBUG=Ludus`
- Linux: run in console `export DEBUG=Ludus` or `set DEBUG=Ludus`

After that, go to the api folder `cd %project_folder%/api` and run `node ./bin/www`

Finally, website is available on `http://localhost:3000/`

# TL;DR

1. Run watchers - `gulp watch`
2. Run Node.js
3. Go to the `http://localhost:3000/`
