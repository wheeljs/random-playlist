import { access, mkdir, constants, writeFile } from 'fs-extra';
import path from 'path';
import { exec, spawn } from 'child_process';
import fg from 'fast-glob';
import type { Options } from 'fast-glob';
import {
  app,
  ipcMain,
  nativeImage,
  nativeTheme,
  BrowserWindow,
} from 'electron';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import type { FfprobeData } from 'fluent-ffmpeg';

import { Channel } from '../common/constants';
import type { VideoFile } from '../common/types';
import * as service from './services/available';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// Model Operation
ipcMain.handle(
  Channel.Model,
  (_event, servicePath: string, ...args: unknown[]) => {
    const [serviceName, methodName] = servicePath.split('.');
    if (!Object.prototype.hasOwnProperty.call(service, serviceName)) {
      return Promise.reject(new Error('Method unimplemented.'));
    }

    const srv = service[serviceName];
    const method = srv[methodName];
    if (typeof method !== 'function') {
      return Promise.reject(new Error('Not a function.'));
    }

    return method.apply(srv, args);
  }
);

ipcMain.handle(
  Channel.FastGlob,
  (_event, ...args: [string | string[], Options?]) => {
    return fg(...args);
  }
);

ipcMain.handle(
  Channel.EnsureDir,
  (_event, dir: string, fallbackDir?: string) => {
    return access(dir, constants.W_OK)
      .catch((err) => {
        if (err.code === 'ENOENT') {
          /* eslint-disable consistent-return, default-case, promise/always-return, promise/no-nesting */
          return mkdir(dir).then(() => {
            switch (process.platform) {
              case 'win32':
                return new Promise<void>((resolve) => {
                  exec(`attrib +H "${dir}"`, { windowsHide: true }, () =>
                    resolve()
                  );
                });
              default:
                return undefined;
            }
          });
          /* eslint-enable consistent-return, default-case, promise/always-return, promise/no-nesting */
        }

        throw err;
      })
      .then(() => dir)
      .catch(() => {
        const fallbackPaths = [app.getPath('cache'), 'random-playlist/'];
        if (fallbackDir) {
          fallbackPaths.push(fallbackDir);
        }

        return path.join(...fallbackPaths);
      }) as Promise<string>;
  }
);

ipcMain.handle(
  Channel.Play,
  (event, player: string, args?: readonly string[]) => {
    const childProcess = spawn(player, args, {
      detached: true,
    });
    childProcess.unref();

    BrowserWindow.fromWebContents(event.sender).minimize();
  }
);

/* eslint-disable promise/no-nesting */
ipcMain.handle(
  Channel.VideoFileDetails,
  async (
    _event,
    { filePaths, thumbDir }: { filePaths: string[]; thumbDir: string }
  ) => {
    return Promise.all(
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

        const ffmpegInstance = ffmpeg(filePath);

        let thumbPending: Promise<string>;
        const thumbPath = path.join(
          thumbDir,
          `${path.basename(filePath, ext)}_thumb.png`
        );
        try {
          // thumbnail already exists, reuse
          await access(thumbPath, constants.R_OK);
          thumbPending = Promise.resolve(thumbPath);
        } catch {
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
            .catch(() => {
              // failed to get thumbnail from local thumbnail cache reference, fallback to ffmpeg
              const ffmpegThumbPending = new Promise<string>(
                (resolve, reject) => {
                  ffmpegInstance.on('filenames', (filename) => {
                    ffmpegInstance
                      .on('end', () => resolve(filename[0]))
                      .on('error', (err) => reject(err));
                  });
                }
              ).then((thumbFilePath) => path.join(thumbDir, thumbFilePath));

              ffmpegInstance.screenshots({
                folder: thumbDir,
                filename: '%b_thumb.png',
                timemarks: ['33%'],
                size: '128x?',
              });

              return ffmpegThumbPending;
            });
        }

        return Promise.allSettled([
          thumbPending,
          new Promise<FfprobeData>((resolve, reject) => {
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
          const file: VideoFile = {
            path: filePath,
            extension: ext,
            duration: null,
          };

          if (thumbPathResult.status === 'fulfilled') {
            file.thumb = thumbPathResult.value;
          } else {
            // TODO log
            console.log(`---${filePath} thumb---`);
            console.log(thumbPathResult.reason);
          }
          if (metadataResult.status === 'fulfilled') {
            file.duration = metadataResult.value.format.duration;
          } else {
            // TODO log
            console.log(`---${filePath} metadata---`);
            console.log(metadataResult.reason);
          }

          return file;
        });
      })
    );
  }
);

ipcMain.handle(
  Channel.DarkMode,
  (_event, darkMode?: 'light' | 'dark' | 'system') => {
    if (
      typeof darkMode !== 'undefined' &&
      nativeTheme.themeSource !== darkMode
    ) {
      nativeTheme.themeSource = darkMode;
    }

    return nativeTheme.shouldUseDarkColors;
  }
);
