#!/usr/bin/env node

'use strict';

const GEOTREK_PATH  = 'geotrek-rando-source';
const child_process = require('child_process');

[
    'git submodule add -b latest https://github.com/makinacorpus/Geotrek-rando.git ' + GEOTREK_PATH,
    'git submodule update --init --depth=5 ' + GEOTREK_PATH,
    'mkdir -p custom',
        /**
         * -p, --parents
         * 		no error if existing, make parent directories as needed
         */
    'ln -fnrs custom ' + GEOTREK_PATH + '/custom',
        /**
         * -f, --force
         * 		remove existing destination files
         * 		> Avoid error if link already exists
         * -n, --no-dereference
         * 		treat LINK_NAME as a normal file if it is a symbolic link to a directory
         * 		> Don't resolve `geotrek-rando-source/custom` if it already exists
         * 	-r, --relative
         * 		create symbolic links relative to link location
         * 		> Allow to use `custom` for source instead of `../custom`
         * 	-s, --symbolic
         * 		make symbolic links instead of hard links
         * 		> We don't need the link to be hardlink
         */
].forEach((command) => console.log(child_process.execSync(command).toString()));

const ENV = {
    PATH: process.env.PATH,
    NODE_ENV: 'production',
    'npm_config_color': 'always',
    'npm_config_silent': 'true',
    'npm_config_loglevel': 'silent',
    'npm_config_unsafe-perm': 'true'
};

const npmi = child_process.exec('npm install', {
    cwd: GEOTREK_PATH,
    env: ENV
});

npmi.stdout.on('data', (data) => process.stdout.write(data));
npmi.stderr.on('data', (data) => process.stderr.write(data));
npmi.on('close',       (code) => process.exit(code));
