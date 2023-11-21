### How to Run the Website
To run the website, run
npm start

### ANTLR Grammar Instructions
If the ANTLR g4 file is edited, run command (the antlr file handles the grammar for antimony, do not edit unless you know what you're doing)
npm run antlr4ts path/to/antlr/file.g4

Ignore or delete the .antlr file if it appears. It is auto generated whenever the g4 file is saved. It is not needed.

### Deployment Instructions
When ready to deploy to github pages, run
npm run deploy

Do not delete the gh-pages branch, this is the branch that github pages refers to.