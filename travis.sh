#!/bin/bash
npm install
npm install -g codeclimate-test-reporter

npm test
CODECLIMATE_REPO_TOKEN=0e70ba0ce60de05fcb22e6a0466210b5aa755dbbeda1b742039cfcdf4f5bf925 codeclimate < report/lcov.info
