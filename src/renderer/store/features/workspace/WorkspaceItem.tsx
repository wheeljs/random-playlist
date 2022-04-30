import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message, Popconfirm, Popover } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { shuffle } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import type {
  Directory,
  Workspace,
  ViewMode,
  IFile,
} from '../../../../common/models';

import styles from './WorkspaceItem.module.less';
import ImportDirectoriesModal from '../directory/ImportDirectoriesModal';
import FileListCard from '../directory/FileListCard';
import { selectConfigs, setVisible } from '../config/configSlice';
import { ConfigKeys, configService, directoryService } from '../../../services';
import {
  listFilesAndDirectories,
  play,
  videoFileDetails,
} from '../../../utils/fileHelper';
import { fetchWorkspaces, updateWorkspace } from './workspaceSlice';
import { updateDirectory } from '../directory/directorySlice';

const { path } = rpHost;

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
  const { t } = useTranslation();

  const configs = useSelector(selectConfigs);

  const [selectedDirId, setSelectedDirId] = useState<string>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const openImportModal = () => setShowImportModal(true);
  const onImportModalClose = () => setShowImportModal(false);

  const ensurePlayerExecutable = () => {
    if (!configs[ConfigKeys.PlayerExecutable]?.value) {
      message.warning(t('workspace item.ensure player'));
      dispatch(setVisible(true));
      return false;
    }

    return true;
  };

  const generateAndPlay = async () => {
    if (!ensurePlayerExecutable()) {
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

  const directPlay = async (fileList: IFile[]) => {
    if (!ensurePlayerExecutable()) {
      return;
    }

    play({
      configs,
      fileList: fileList.map((x) => x.path),
    });
  };

  const deleteDirectory = async (directory: Directory) => {
    await directoryService.remove(directory.id);

    await dispatch(fetchWorkspaces());
    setSelectedDirId(null);
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
    if (selectedDirId === directory.id) {
      setSelectedDirId(null);
      return;
    }
    setSelectedDirId(directory.id);
  };

  const setViewMode = ({
    directory,
    viewMode,
  }: {
    directory?: Directory;
    viewMode: ViewMode;
  }) => {
    if (directory != null) {
      dispatch(
        updateDirectory({
          id: directory.id,
          viewMode,
          workspace: { id: workspace.id },
        })
      );
    } else {
      dispatch(
        updateWorkspace({
          id: workspace.id,
          viewMode,
        })
      );
    }
  };

  const selectedDir =
    selectedDirId != null
      ? workspace.directories.find((x) => x.id === selectedDirId)
      : null;
  const fileList = selectedDir
    ? selectedDir.files
    : workspace.directories.flatMap((x) => x.files);

  let viewMode: ViewMode;
  if (selectedDir != null && selectedDir.viewMode) {
    viewMode = selectedDir.viewMode;
  } else if (workspace.viewMode) {
    viewMode = workspace.viewMode;
  } else {
    viewMode = configs.viewMode.value as ViewMode;
  }

  return (
    <div className={[className, styles['workspace-item']].join(' ')}>
      <div className={styles['directories-container']}>
        <Popover content={t('import directory.title')} placement="right">
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
                      title={t('delete directory')}
                      placement="bottom"
                      okText={t('common.remove')}
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
                  x.id === selectedDirId ? styles.selected : '',
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
        workspaceName={workspace.name}
        fileList={fileList}
        syncing={syncing}
        directory={selectedDir}
        actions={
          fileList.length > 0
            ? [
                <Button
                  type="primary"
                  key="generate"
                  loading={generating}
                  onClick={generateAndPlay}
                >
                  {t('workspace item.generate and play')}
                </Button>,
              ]
            : []
        }
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearSelectedDirectory={() => setSelectedDirId(null)}
        onSyncFiles={syncFiles}
        onDirectPlay={directPlay}
      />
    </div>
  );
}
