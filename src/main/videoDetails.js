const { nativeImage } = require('electron');
const path = require('path');
const { access, writeFile, constants } = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const { path: ffmpegPath } = require('@ffmpeg-installer/ffmpeg');
const { path: ffprobePath } = require('@ffprobe-installer/ffprobe');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

onmessage = async (event) => {
  const { filePaths, thumbDir } = event.data;
  console.log('[videoDetails]Generating video details in worker thread...');
  postMessage(
    await Promise.all(
      filePaths.map(async (filePath) => {
        const ext = path.extname(filePath);
        try {
          // video file cannot read, skip generating thumbnail and duration
          await access(filePath, constants.R_OK);
        } catch {
          return {
            path: filePath,
            extension: ext,
          };
        }

        console.log(`[videoDetails][${filePath}]: Generating thumb...`);
        const ffmpegInstance = ffmpeg(filePath);
        const thumbPath = path.join(
          thumbDir,
          `${path.basename(filePath, ext)}_thumb.png`
        );

        let thumbPending;
        /* eslint-disable promise/no-nesting */
        try {
          // thumbnail already exists, reuse
          await access(thumbPath, constants.R_OK);
          console.log(`[videoDetails][${filePath}]: Reuse existing thumb...`);
          thumbPending = Promise.resolve(thumbPath);
        } catch {
          console.log(
            `[videoDetails][${filePath}]: nativeImage.createThumbnailFromPath`
          );
          thumbPending = nativeImage
            // use electron api to get thumbnail
            .createThumbnailFromPath(filePath, {
              width: 128,
              height: 128,
            })
            .then(async (thumb) => {
              if (thumb.isEmpty()) {
                return null;
              }
              const resizedThumb = thumb
                .resize({
                  width: 128,
                  quality: 'good',
                })
                .toPNG();

              return writeFile(thumbPath, resizedThumb).then(() => thumbPath);
            })
            .catch((error) => {
              console.log(
                `[videoDetails][${filePath}]: nativeImage.createThumbnailFromPath, error: ${error}. Use ffmpeg...`
              );

              // failed to get thumbnail from local thumbnail cache reference, fallback to ffmpeg
              const ffmpegThumbPending = new Promise((resolve, reject) => {
                ffmpegInstance.on('filenames', (filename) => {
                  ffmpegInstance
                    .on('end', () => resolve(filename[0]))
                    .on('error', (err) => reject(err));
                });
              }).then((thumbFilePath) => path.join(thumbDir, thumbFilePath));

              ffmpegInstance.screenshots({
                folder: thumbDir,
                filename: '%b_thumb.png',
                timemarks: ['33%'],
                size: '128x?',
              });

              return ffmpegThumbPending;
            });
        }
        /* eslint-enable promise/no-nesting */

        return Promise.allSettled([
          thumbPending,
          new Promise((resolve, reject) => {
            ffmpegInstance
              .on('error', (err) => reject(err))
              .ffprobe((err, metadata) => {
                if (err) {
                  reject(err);
                  return;
                }

                resolve(metadata);
              });
          }),
        ]).then(([thumbPathResult, metadataResult]) => {
          const file = {
            path: filePath,
            extension: ext,
            duration: null,
          };

          if (thumbPathResult.status === 'fulfilled') {
            file.thumb = thumbPathResult.value;
          } else {
            console.error(
              `[videoDetails][${filePath}]: Generating thumb error: ${thumbPathResult.reason}`
            );
          }
          if (metadataResult.status === 'fulfilled') {
            file.duration = metadataResult.value.format.duration;
          } else {
            console.error(
              `[videoDetails][${filePath}]: Generating metadata error: ${metadataResult.reason}`
            );
          }

          return file;
        });
      })
    )
  );
};
