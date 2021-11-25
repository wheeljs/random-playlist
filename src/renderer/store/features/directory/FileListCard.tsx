import React from 'react';
import { basename } from 'path';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Popover,
  Row,
  Space,
  Table,
  Tooltip,
} from 'antd';
import type { CardProps } from 'antd';
import {
  FolderOpenOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Directory, File, ViewMode } from '../../../../common/models';

import SyncingSpin from '../../../components/SyncingSpin';
import styles from './FileListCard.less';

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
}: Pick<CardProps, 'actions'> & {
  workspaceName: string;
  directory?: Directory;
  fileList: File[];
  syncing?: boolean;
  viewMode: ViewMode;
  onViewModeChange: (event: {
    directory?: Directory;
    viewMode: ViewMode;
  }) => void;
  onClearSelectedDirectory: () => void;
  onSyncFiles: (directories?: Directory[]) => void;
}): JSX.Element {
  const { t } = useTranslation();

  let listView: JSX.Element;
  switch (viewMode) {
    case 'thumb':
      listView = (
        <SyncingSpin spinning={syncing}>
          <Row gutter={12}>
            {Array.isArray(fileList) &&
              fileList.map((file) => (
                <Col span={3} key={file.path}>
                  <div className={styles['file-item']}>
                    <img src={`file:///${file.thumb}`} alt={file.path} />
                    <span className={styles['file-name']}>
                      {basename(file.path)}
                    </span>
                  </div>
                </Col>
              ))}
          </Row>
        </SyncingSpin>
      );
      break;
    case 'list':
    default:
      listView = (
        <Table<File>
          rowKey={(row) => row.id}
          dataSource={fileList}
          pagination={false}
          loading={{
            spinning: syncing,
            tip: t('syncing.0'),
          }}
        >
          <Table.Column<File>
            title={t('file list.file name')}
            dataIndex="path"
            render={(value) => basename(value)}
          />
          <Table.Column<File>
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
      break;
  }

  // eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
  const setViewMode = (viewMode: ViewMode) => {
    onViewModeChange({
      directory,
      viewMode,
    });
  };

  const dirName = directory ? basename(directory.path) : '';

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
        actions={actions}
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
