'use strict';

const fs        = require('fs-extra');
const path      = require('path');
const AWS       = require('aws-sdk');

const RESULTS_DIR = process.env.RESULTS_DIR || 'results';

/**
 * Upload results file to S3
 */
module.exports = function(project) {
    return new Promise((resolve, reject) => {

        console.info(`[${project.uid}] upload results file...`);
        let resultFile = path.join( RESULTS_DIR, project.uid + '_encoded.mp4' );

        var s3 = new AWS.S3();
        var fileStream = fs.createReadStream(resultFile);
        fileStream.on('error', function(err) {
          console.log('File Error', err);
        });
        var uploadParams = {
            Bucket: process.env.S3_RESULTS_BUCKET || 'joshea-beardclub-test',
            Key: `renders/${path.basename(resultFile)}`,
            Body: fileStream
        };
        // call S3 to retrieve upload file to specified bucket
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                reject(err);
            } if (data) {
                console.log(`[${project.uid}]  Upload Success`, data.Location);

                console.info(`[${project.uid}] deleting local copy of result video...`);

                fs.remove( resultFile, (err) => {
                    return (err) ? reject(err) : resolve(project);
                })
                resolve(project);
            }
        });
    });
};
