import React, { useEffect, useMemo, memo, useState } from 'react';
import { basename } from 'path';
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Popover,
  Row,
  Space,
  Table,
  Tooltip,
} from 'antd';
import type { CardProps, TableProps } from 'antd';
import {
  FolderOpenOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Trans, useTranslation } from 'react-i18next';
import type { Directory, IFile, ViewMode } from '../../../../common/models';

import SyncingSpin from '../../../components/SyncingSpin';
import styles from './FileListCard.less';

type SelectableFile = IFile & {
  selected?: boolean;
};

const ThumbFileListItem = memo(
  function FileListThumbItem({
    now,
    file,
    onClick,
  }: {
    // eslint-disable-next-line react/no-unused-prop-types
    now: number;
    file: SelectableFile;
    onClick: (file: SelectableFile) => void;
  }) {
    return (
      <Col span={3}>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div className={styles['file-item']} onClick={() => onClick(file)}>
          <Checkbox checked={file.selected} />
          <img
            key={`${now}_${file.path}`}
            src={`file:///${file.thumb}`}
            alt={file.path}
          />
          <span className={styles['file-name']}>{basename(file.path)}</span>
        </div>
      </Col>
    );
  },
  (prevProps, nextProps) => {
    if (nextProps.file?.id !== prevProps.file?.id) {
      return false;
    }
    if (nextProps.file?.selected !== prevProps.file?.selected) {
      return false;
    }
    if (nextProps.now !== prevProps.now) {
      return false;
    }

    return true;
  }
);

export default function FileList({
  workspaceName,
  directory,
  fileList,
  actions,
  syncing,
  viewMode,
  onViewModeChange,
  onClearSelectedDirectory,
  onSyncFiles,
  onDirectPlay,
}: Pick<CardProps, 'actions'> & {
  workspaceName: string;
  directory?: Directory;
  fileList: IFile[];
  syncing?: boolean;
  viewMode: ViewMode;
  onViewModeChange: (event: {
    directory?: Directory;
    viewMode: ViewMode;
  }) => void;
  onClearSelectedDirectory: () => void;
  onSyncFiles: (directories?: Directory[]) => void;
  onDirectPlay: (fileList: IFile[]) => void;
}): JSX.Element {
  const { t } = useTranslation();

  const [selectableFileList, setSelectableFileList] = useState<
    SelectableFile[]
  >([]);

  const [tableSelectedFiles, setTableSelectedFiles] = useState<
    SelectableFile[]
  >([]);

  const onTableSelectionChange = (
    _: string[],
    selectedRows: SelectableFile[]
  ) => {
    setTableSelectedFiles(selectedRows);
  };

  useEffect(() => {
    setSelectableFileList(
      (fileList ?? []).map((x) => ({
        ...x,
        selected: false,
      }))
    );
  }, [fileList]);

  const selectFile = (file: SelectableFile) => {
    file.selected = !file.selected;
    setSelectableFileList([...selectableFileList]);
  };

  const listView: JSX.Element = useMemo(() => {
    const now = Date.now();
    switch (viewMode) {
      case 'thumb':
        return (
          <SyncingSpin spinning={syncing}>
            <Row gutter={12}>
              {Array.isArray(selectableFileList) &&
                selectableFileList.map((file) => (
                  <ThumbFileListItem
                    key={file.path}
                    now={now}
                    file={file}
                    onClick={(f) => selectFile(f)}
                  />
                ))}
            </Row>
          </SyncingSpin>
        );
      case 'list':
      default:
        // eslint-disable-next-line no-case-declarations
        const rowSelection: TableProps<IFile>['rowSelection'] = {
          hideSelectAll: true,
          onChange: onTableSelectionChange,
        };
        return (
          <Table<IFile>
            rowKey={(row) => `${now}_${row.id}`}
            dataSource={selectableFileList}
            rowSelection={rowSelection}
            pagination={false}
            loading={{
              spinning: syncing,
              tip: t('syncing.0'),
            }}
          >
            <Table.Column<IFile>
              title={t('file list.file name')}
              dataIndex="path"
              render={(value) => basename(value)}
            />
            <Table.Column<IFile>
              title={t('file list.duration')}
              dataIndex="duration"
              width={150}
              align="center"
              render={(value: number) => {
                const ceilValue = Math.ceil(value);
                const minutes = Math.floor(ceilValue / 60);
                const seconds = ceilValue % 60;
                return `${minutes.toString().padStart(2, '0')}:${seconds
                  .toString()
                  .padStart(2, '0')}`;
              }}
            />
          </Table>
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, viewMode, selectableFileList, syncing]);

  // eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
  const setViewMode = (viewMode: ViewMode) => {
    onViewModeChange({
      directory,
      viewMode,
    });
  };

  const getSelectedFiles = () => {
    switch (viewMode) {
      case 'thumb':
        return selectableFileList.filter((x) => x.selected);
      case 'list':
      default:
        return tableSelectedFiles;
    }
  };

  const directPlay = () => {
    onDirectPlay?.(getSelectedFiles());
  };

  const dirName = directory ? basename(directory.path) : '';
  const selectedFiles = getSelectedFiles();

  return (
    <div className="file-list-card">
      <Card
        bodyStyle={viewMode === 'list' ? { padding: 0 } : {}}
        title={
          <Space size="middle">
            <Breadcrumb>
              <Breadcrumb.Item>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <a onClick={onClearSelectedDirectory}>
                  <Space>
                    <FolderOpenOutlined />
                    <span>{workspaceName}</span>
                  </Space>
                </a>
              </Breadcrumb.Item>
              {directory != null && (
                <Breadcrumb.Item>{dirName}</Breadcrumb.Item>
              )}
            </Breadcrumb>
            <Popover
              title={t('file list.sync.title', {
                name: directory ? dirName : t('workspace name'),
              })}
              content={t('file list.sync.popover')}
              placement="right"
            >
              <Button
                icon={<ReloadOutlined />}
                onClick={() => onSyncFiles(directory ? [directory] : undefined)}
              >
                {t('file list.sync.button')}
              </Button>
            </Popover>
          </Space>
        }
        extra={
          <>
            <Tooltip title={t('config.viewMode.list')} key="list-view">
              <Button
                type={viewMode === 'list' ? 'link' : 'text'}
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode('list')}
              />
            </Tooltip>
            <Tooltip title={t('config.viewMode.thumb')} key="thumb-view">
              <Button
                type={viewMode === 'thumb' ? 'link' : 'text'}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode('thumb')}
              />
            </Tooltip>
          </>
        }
        actions={[
          ...(actions ?? []),
          selectedFiles.length > 0 ? (
            <Button key="direct-play" onClick={directPlay}>
              <Trans
                i18nKey="workspace item.direct play"
                count={selectedFiles.length}
              >
                播放 {{ count: selectedFiles.length }} 个视频
              </Trans>
            </Button>
          ) : null,
        ]}
      >
        {listView}
      </Card>
    </div>
  );
}

FileList.defaultProps = {
  directory: null,
  syncing: false,
};
