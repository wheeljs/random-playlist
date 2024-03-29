# [1.1.1](https://github.com/wheeljs/random-playlist/compare/v1.1.0...v1.1.1) (2022-10-15)

### Bug Fixes

- **workspace/files:** show placeholder icon for file without thumbnail ([f71a421](https://github.com/wheeljs/random-playlist/commit/f71a421fdc09bc7f7c18e5d1ea9918cb44c56d9f))

# [1.1.0](https://github.com/wheeljs/random-playlist/compare/v1.0.0...v1.1.0) (2022-04-30)

### Bug Fixes

- app window's title ([9ab5bd7](https://github.com/wheeljs/random-playlist/commit/9ab5bd7b06b3ff896ff62d60a95505f1ba469bc5))
- **darkMode:** style precedence ([dff929a](https://github.com/wheeljs/random-playlist/commit/dff929a36b45db2adee95d0bce9e6e4ad6ec321f))
- **directory/import:** correct js url loaded by web worker ([18771a2](https://github.com/wheeljs/random-playlist/commit/18771a207c935cfa8ed96e2191fc4ef2d0e15242))
- **directory/import:** missing a sentence translating ([53acf9f](https://github.com/wheeljs/random-playlist/commit/53acf9fd2b65c1b0d05ce8bfd1e4f61ededb36c5))
- **global:** load local resource and use `fs`, blahblahblah in renderer process ([26a7130](https://github.com/wheeljs/random-playlist/commit/26a71301336ed5e8518e830f10e39d5eadd0f585))
- **global:** use global less ([4a1ce4d](https://github.com/wheeljs/random-playlist/commit/4a1ce4d79ed04f00c3a8a2a182b131375e43fa85))
- **index:** space between tab bar and add icon ([5276ba8](https://github.com/wheeljs/random-playlist/commit/5276ba868ae79432b9adbc191551d4e6c4ab176b))
- **model:** import/export type use `import/export type` syntax ([07bd1af](https://github.com/wheeljs/random-playlist/commit/07bd1afc9877bffbe9b335ab592ba6646533f1f1))
- **model:** migrations ([bba7a04](https://github.com/wheeljs/random-playlist/commit/bba7a04fb94bc4abfa935029a0dc92fc5da48646))
- **workspace/files:** add empty for thumbnail view ([2b84a62](https://github.com/wheeljs/random-playlist/commit/2b84a625405acdeb9d5ff0f394ba7e5479e72531))
- **workspace/files:** force file protocol when displaying thumbnails ([ec3f280](https://github.com/wheeljs/random-playlist/commit/ec3f280efe12df2599f3e9b457972cba67d3225c))
- **workspace/files:** only show play button when workspace have videos ([c217d3e](https://github.com/wheeljs/random-playlist/commit/c217d3eb477cc39594c7165a3a7d348770be76dc))
- **workspace/files:** reload thumbnail after syncing ([64f777e](https://github.com/wheeljs/random-playlist/commit/64f777e7632ac9e54ad70260a2eca1dc2fac0503))
- **workspace/files:** thumbnail size ([98d2de7](https://github.com/wheeljs/random-playlist/commit/98d2de7d2ed328a0551a9279e538f33d893e8b31))

### Features

- **darkMode:** add ([ceac74f](https://github.com/wheeljs/random-playlist/commit/ceac74fea18a691338322a8faa468ac7fc8e3dab))
- **darkMode:** components' styles ([448c33e](https://github.com/wheeljs/random-playlist/commit/448c33e4c9b8703f684065904d72b6d444bde0ce))
- **workspace/files:** direct play selected videos ([377fae7](https://github.com/wheeljs/random-playlist/commit/377fae72011ee767e5d2ddb125fec2387fd10361))

# [1.0.0](https://github.com/wheeljs/random-playlist/compare/d6350b9a8c4809cd637672914f761cf9dccc71ac...v1.0.0) (2021-07-25)

### Bug Fixes

- **directory/import:** '导入'=> '匹配' ([2e7c4b0](https://github.com/wheeljs/random-playlist/commit/2e7c4b08a41b10df734d1b88a39cf94463c986db))
- **directory/import:** refresh directories after import ([6cbb2ef](https://github.com/wheeljs/random-playlist/commit/6cbb2ef76167843b2496d6088e02c6801bbdd432))
- **directory/import:** spinning after user canceled ([e20c352](https://github.com/wheeljs/random-playlist/commit/e20c352f704d7ff64bdebc0ca7a76550031e4cea))
- **directory/remove:** clear selected after delete ([cdbaed3](https://github.com/wheeljs/random-playlist/commit/cdbaed3e2ea488d51a7f8538c66286ffb3aeb966))
- **directory/remove:** removed directory still show ([30eafe3](https://github.com/wheeljs/random-playlist/commit/30eafe3347e062e0669e4da56bf8a2edcbcdc65f))
- **file:** avoid video detail promises pending forever ([0126737](https://github.com/wheeljs/random-playlist/commit/012673702afb3a9355f1102cf88b1f7a31facf87))
- **global/modal:** set `maskClosable=false` for add, edit modals ([8017be2](https://github.com/wheeljs/random-playlist/commit/8017be2e9771b0f05351037acd2c9e23b340278f))
- **global/modal:** use Chinese quotes ([a8a9da2](https://github.com/wheeljs/random-playlist/commit/a8a9da27d36766d2319320244f4a418760d325dd))
- misused `createConnection` to `getConnection` ([d6350b9](https://github.com/wheeljs/random-playlist/commit/d6350b9a8c4809cd637672914f761cf9dccc71ac))
- **modal/file:** correct directory relation, eager load Directory#files ([9a16cdd](https://github.com/wheeljs/random-playlist/commit/9a16cddda348e3bc7d3c81daf6af5a40523ac8cb))
- **model:** ensure default connection for renderer ([8b83d88](https://github.com/wheeljs/random-playlist/commit/8b83d88ebd91e8b6c8384af44173c44c8297bf21))
- **model:** not transform empty date field value ([0753544](https://github.com/wheeljs/random-playlist/commit/07535440ab06a17c4e084eeacd1d0996eaa5d231))
- **model:** use `@Transform` from `class-transformer` instead of typeorm's ValueTransformer ([058115f](https://github.com/wheeljs/random-playlist/commit/058115fb9058c4356f772aceb0bf41dc513f8329))
- **workspace/files:** add spinning tip, add `rowKey` for <Table> ([1c77acd](https://github.com/wheeljs/random-playlist/commit/1c77acd6a2ac8a8f105efe3a9dff3fc51cbbc36c))
- **workspace/files:** delete directory file records when resyncing ([36c7116](https://github.com/wheeljs/random-playlist/commit/36c711649f5b12faa39cbc81daf96567167894b9))
- **workspace/files:** display correctly workspace name ([b2771e7](https://github.com/wheeljs/random-playlist/commit/b2771e76dc2e574f7609730bc0e0aaf49536c6e7))
- **workspace/files:** pass `undefined` when syncing files without selected directory ([d5b3bde](https://github.com/wheeljs/random-playlist/commit/d5b3bde4814c364ffc99a75cc3177dad5ad26725))
- **workspace/files:** remove unused column ([5f97382](https://github.com/wheeljs/random-playlist/commit/5f97382568036c0366c037f145e4f32fdf5fd209))
- **workspace/files:** sync button's popover contains what(workspace/directory) will be sync ([d7faa8a](https://github.com/wheeljs/random-playlist/commit/d7faa8a0d8414e481f54649e23523e2c4877a1f7))
- **workspace:** entity's name changed by bundling will cause a sql error ([4e3f6da](https://github.com/wheeljs/random-playlist/commit/4e3f6dac1beca00d6245fab0f426db72b9ec505a))
- **workspace:** use cached files generating playlist ([7ea3ced](https://github.com/wheeljs/random-playlist/commit/7ea3cedd17bd9b664c7f12b821d1cf1d739295bf))

### Features

- **config/modal:** add configurations ([359ed86](https://github.com/wheeljs/random-playlist/commit/359ed86501cb248d3907d53595cd86d2c00700c2))
- **config/modal:** add language configuration ([6514bfb](https://github.com/wheeljs/random-playlist/commit/6514bfbdc541690d8f0fb7bd9eb229e021ab0e45))
- **config/modal:** global glob and view mode configurations ([83fc211](https://github.com/wheeljs/random-playlist/commit/83fc211c0c234b6df3c0060b9fe7bdeb8981afb6))
- **config/save:** save configurations ([bfa6664](https://github.com/wheeljs/random-playlist/commit/bfa6664369e89e2067652e4aff9188f02390a94b))
- **config:** add redux slice ([208b56e](https://github.com/wheeljs/random-playlist/commit/208b56ee65bfe57317dfd150739e413f9a4eab59))
- **directory/import:** sync files when importing ([0b2135c](https://github.com/wheeljs/random-playlist/commit/0b2135c6b12a67f918946bdf70e9958c0d5e1957))
- **directory/remove:** cascade **hard** remove files ([24713c8](https://github.com/wheeljs/random-playlist/commit/24713c89a0b498958f1b2237babc7ac76d68a266))
- **directory/remove:** remove imported directory from collection ([405b7c3](https://github.com/wheeljs/random-playlist/commit/405b7c3b928d45beed0890f8f2658140c9433b99))
- **file:** get videos thumbnail and duration by ffmpeg ([e3592a4](https://github.com/wheeljs/random-playlist/commit/e3592a4878fe196a41790154aa718c7686bf670b))
- **i18n:** menu ([f83e12b](https://github.com/wheeljs/random-playlist/commit/f83e12be2374646f221bd36e5ef6967853bff8a0))
- **menu:** add global settings item ([060412a](https://github.com/wheeljs/random-playlist/commit/060412a5c4d77917c03d99ddac428d10fd47c717))
- **model/config:** add list config by keys method ([0ea7db9](https://github.com/wheeljs/random-playlist/commit/0ea7db990fa41497d012d7e1322a97fdfb1957cb))
- **model/file:** add thumb field store thumbnail's path ([01cee31](https://github.com/wheeljs/random-playlist/commit/01cee312cbd32fae2c187778ec6d5db835b72410))
- rename app name ([25e66ba](https://github.com/wheeljs/random-playlist/commit/25e66baf032cde787c0ab3e3dda879750b92d4ec))
- **worksapce/files:** show selected directory's files ([16469ce](https://github.com/wheeljs/random-playlist/commit/16469ceadff11d354f7ad57843ec0c4735a22c43))
- **workspace/files:** `view_mode` field save user's choice ([915097d](https://github.com/wheeljs/random-playlist/commit/915097d3833a1446fa718dd65ac62658328c08ed))
- **workspace/files:** add spinning component with predefined importing tips ([2f9b615](https://github.com/wheeljs/random-playlist/commit/2f9b615b4ff7b6f14ae8a2156bf61d825e11bfbb))
- **workspace/files:** hide `.rpcache` folder on windows ([7edd74d](https://github.com/wheeljs/random-playlist/commit/7edd74d32ab80e178888fc0eb4ee5307a3b789ed))
- **workspace/files:** sync files into db, show workspace's files ([102a4ae](https://github.com/wheeljs/random-playlist/commit/102a4aeefe1a098e0a8bc4f5c19550f8a04dd802))
- **workspace/item:** show imported directories ([f57c9d9](https://github.com/wheeljs/random-playlist/commit/f57c9d90a6d6a84f437a0634e309196fbf89775b))
- **workspace:** generate and play ([6165e6c](https://github.com/wheeljs/random-playlist/commit/6165e6c1e577a57af580c8e3bddbcb3a03904351))
