If the ANTLR g4 file is edited, run command
`npm run antlr4ts path/to/antlr/file.g4`

Ignore or delete the .antlr file if it appears. It is auto generated whenever the g4 file is saved. It is not needed.

# Development and Deployment
Run `npm run start` to start a development server.

Run `npm run deploy` to deploy the changes. Navigate to about.html in `public/` and edit the html to before deploying to display the new version number.

# Testing
Run `npm run test` to run unit tests. Run `npm build` to check if everything builds correctly.
Run `npm run coverage` to generate a coverage report. You can access a webpage with the report
at `coverage/lcov-report/index.html`
