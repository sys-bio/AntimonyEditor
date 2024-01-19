If the ANTLR g4 file is edited, run command
npm run antlr4ts path/to/antlr/file.g4

Ignore or delete the .antlr file if it appears. It is auto generated whenever the g4 file is saved. It is not needed.

During deployment, you must ADD
"homepage": "https://sys-bio.github.io/AntimonyEditor/"
to package.json. After deployment, REMOVE it from package.json.
This ensures that libantimonyjs is able to work locally for "npm start"
while also making sure that the deployment url is correct.