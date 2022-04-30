# Generate, Play（生成，播放）

Import your videos like 'Friends' and anything else, then random play them.

导入任意的视频文件，如“老友记”，然后随机播放他们。

> Forked from [`electron-react-boilerplate@1.4.0`](//electron-react-boilerplate.js.org/), Thanks for their working.

>  <p>
>    Electron React Boilerplate uses <a href="https://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="https://github.com/reactjs/redux">Redux</a>, <a href="https://github.com/reactjs/react-router">React Router</a>, <a href="https://webpack.js.org/">Webpack</a> and <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a>.
>  </p>

> 从[`electron-react-boilerplate@1.4.0`](//electron-react-boilerplate.js.org/) Fork 而来，感谢大佬们的辛勤工作。

<div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]

</div>

<hr />

## Install（安装）

Download your platform's installer in [**Releases**](releases/latest).

在[**Releases**](releases/latest) 中下载对应操作系统的安装程序。

Only tested on Windows 10 (Development Machine) and Windows 7(VMWare).

**Note: You should set a video player in _Global Settings_ before changing the language or importing videos.** I will add a `scrollIntoView()` in next release.

**注意：你应该先在*全局设置*中设置视频播放器，再切换语言或导入视频。**

## Roadmap

- Update to latest `electron-react-boilerplate` :white_check_mark:

- Directly play :white_check_mark:

- Videos' tag

- Generate log and some awesome charts (**Only** seems useful)

- Customize generates option like count, ignore some videos while generating and blahblahblah

## Contribute

Welcome! I'm a frontend developer only (and never used react before), current 'Generate' is a REAL `random()` call, in my "blueprint", 'Generate' should be more elegant and smart.

### Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/wheeljs/random-playlist.git
cd random-playlist
npm install
```

**Having issues installing? See our [debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400)**

### Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

### Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## Maintainers

- [WheelJS](https://github.com/wheeljs)

## License

MIT © [Generate, Play](https://github.com/wheeljs/random-playlist)

[github-actions-status]: https://github.com/wheeljs/random-playlist/workflows/Test/badge.svg
[github-actions-url]: https://github.com/wheeljs/random-playlist/actions
[github-tag-image]: https://img.shields.io/github/tag/electron-react-boilerplate/electron-react-boilerplate.svg?label=version
[github-tag-url]: https://github.com/wheeljs/random-playlist/releases/latest
[david-image]: https://img.shields.io/david/wheeljs/random-playlist.svg
[david-url]: https://david-dm.org/wheeljs/random-playlist
