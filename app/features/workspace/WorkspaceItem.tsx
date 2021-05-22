import path from 'path';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message, Popconfirm, Popover } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { shuffle } from 'lodash-es';
import { Directory, Workspace } from '../../models';

import styles from './WorkspaceItem.less';
import ImportDirectoriesModal from '../directory/ImportDirectoriesModal';
import FileListCard from '../directory/FileListCard';
import { selectConfigs, setVisible } from '../config/configSlice';
import { ConfigKeys, configService, directoryService } from '../../services';
import {
  listFilesAndDirectories,
  play,
  videoFileDetails,
} from '../../utils/fileHelper';
import { fetchWorkspaces } from './workspaceSlice';

export default function WorkspaceItem({
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  workspace,
}: Pick<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
  'className'
> & {
  workspace: Workspace;
}): JSX.Element {
  const dispatch = useDispatch();

  const configs = useSelector(selectConfigs);

  const [selectedDir, setSelectedDir] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const openImportModal = () => setShowImportModal(true);
  const onImportModalClose = () => setShowImportModal(false);

  const generateAndPlay = async () => {
    if (!configs[ConfigKeys.PlayerExecutable]?.value) {
      message.warning('请先配置播放器');
      dispatch(setVisible(true));
      return;
    }

    const files = workspace.directories.flatMap((x) =>
      x.files.map((file) => file.path)
    );

    setGenerating(true);
    play({
      configs,
      fileList: shuffle(files).splice(0, 10),
    });
    setGenerating(false);
  };

  const deleteDirectory = async (directory: Directory) => {
    await directoryService.remove(directory.id);

    await dispatch(fetchWorkspaces());
    setSelectedDir(null);
  };

  const syncFiles = async (
    directories: Directory[] = workspace.directories
  ) => {
    const globConfig = await configService.get('glob');

    setSyncing(true);
    try {
      await directoryService.syncFiles(
        await Promise.all(
          directories.map(async (directory) => {
            const files = (
              await listFilesAndDirectories({
                root: directory.path,
                patterns: directory.glob ?? globConfig.value,
              })
            ).files.map((filePath) => path.join(directory.path, filePath));

            const details = await videoFileDetails({
              filePaths: files,
              thumbDir: path.join(directory.path, '.rpcache'),
              fallbackDirectory: path.basename(directory.path),
            });

            return {
              directoryId: directory.id,
              files: details,
            };
          })
        )
      );

      dispatch(fetchWorkspaces());
    } finally {
      setSyncing(false);
    }
  };

  const selectDir = (directory: Directory) => {
    if (selectedDir === directory) {
      setSelectedDir(null);
      return;
    }
    setSelectedDir(directory);
  };

  const fileList = selectedDir
    ? selectedDir.files
    : workspace.directories.flatMap((x) => x.files);

  return (
    <div className={[className, styles['workspace-item']].join(' ')}>
      <div className={styles['directories-container']}>
        <Popover content="添加目录" placement="right">
          <Button
            type="primary"
            className="add-directory"
            icon={<PlusOutlined />}
            onClick={openImportModal}
          />
        </Popover>
        <ImportDirectoriesModal
          workspace={workspace}
          visible={showImportModal}
          onClose={onImportModalClose}
        />
        {Array.isArray(workspace.directories) &&
          workspace.directories.map((x) => (
            <Popover
              key={x.id}
              placement="right"
              content={
                <>
                  {x.path}
                  <div className={styles['directory-actions']}>
                    <Popconfirm
                      title="从集合中删除该目录，物理文件不受影响。"
                      placement="bottom"
                      okText="删除"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => deleteDirectory(x)}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </div>
                </>
              }
            >
              {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events */}
              <div
                className={[
                  styles['directory-item'],
                  x === selectedDir ? styles.selected : '',
                ].join(' ')}
                role="button"
                onClick={() => selectDir(x)}
              >
                <span className={styles['directory-item-summary']}>
                  {x.files.length}
                </span>
                <span className={styles['directory-item-name']}>
                  {path.basename(x.path)}
                </span>
              </div>
            </Popover>
          ))}
      </div>

      <FileListCard
        fileList={fileList}
        syncing={syncing}
        directory={selectedDir}
        actions={[
          <Button
            type="primary"
            key="generate"
            loading={generating}
            onClick={generateAndPlay}
          >
            生成并播放
          </Button>,
        ]}
        onClearSelectedDirectory={() => setSelectedDir(null)}
        onSyncFiles={syncFiles}
      />
    </div>
  );
}
