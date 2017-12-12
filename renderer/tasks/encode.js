'use strict';

const fs        = require('fs-extra');
const path      = require('path');
const async     = require('async');
const ffmpeg    = require('fluent-ffmpeg');

const RESULTS_DIR = process.env.RESULTS_DIR || 'results';

/**
 * Clean up all workpath files and remove folder
 */
module.exports = function(project) {
    return new Promise((resolve, reject) => {

        console.info(`[${project.uid}] encoding video...`);
        let resultFile = path.join( RESULTS_DIR, project.uid + '_' + project.resultname );
        let encodedFile = path.join( RESULTS_DIR, project.uid + '_encoded.mp4' );

        ffmpeg(resultFile)
          .videoCodec('libx264')
          .outputOptions([
            '-preset slow',
            '-profile:v baseline',
            '-level 3.0',
            '-pix_fmt yuv420p'
          ])
          .on('error', function(err) {
            reject(err);
          })
          .on('end', function() {
            console.info(`[${project.uid}] ffmpeg processing finished`);
            return resolve(project);
          })
          .save(encodedFile);

    });
};
