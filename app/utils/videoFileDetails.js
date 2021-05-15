const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

onmessage = function videoFileDetails(event) {
  const { filePaths, thumbDir } = event.data;

  // eslint-disable-next-line promise/catch-or-return
  return Promise.all(
    filePaths.map((filePath) => {
      const ffmpegInstance = ffmpeg(filePath);

      // eslint-disable-next-line promise/catch-or-return
      const filePending = Promise.all([
        new Promise((resolve) =>
          ffmpegInstance.on('filenames', (filename) => {
            ffmpegInstance.on('end', () => resolve(filename[0]));
          })
        ),
        new Promise((resolve) =>
          // eslint-disable-next-line consistent-return
          ffmpegInstance.ffprobe((err, metadata) => {
            if (err) {
              return resolve({
                success: false,
                error: err,
              });
            }
            resolve({
              success: true,
              metadata,
            });
          })
        ),
      ]).then(([thumbFilename, metadataResult]) => {
        const file = {
          path: filePath,
          extension: path.extname(filePath),
        };
        if (thumbFilename) {
          file.thumb = path.join(thumbDir, thumbFilename);
        }
        file.duration = metadataResult.success
          ? metadataResult.metadata.format.duration
          : -1;

        return file;
      });

      ffmpegInstance.screenshots({
        folder: thumbDir,
        filename: '%b_thumb.png',
        timemarks: ['00:10'],
        size: '128x?',
      });

      return filePending;
    })
  ).then((result) => postMessage(result));
};
