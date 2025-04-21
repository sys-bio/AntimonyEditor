If the ANTLR g4 file is edited, run command
npm run antlr4ts path/to/antlr/file.g4

Ignore or delete the .antlr file if it appears. It is auto generated whenever the g4 file is saved. It is not needed.

Additionally, make sure to update the version number before deploying. Navigate to HeaderMenu.tsx and update the versionNumber constant.

Run `npm run build && npm run deploy` in terminal to deploy the changes.