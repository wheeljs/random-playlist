import React, { useState } from 'react';
import { basename } from 'path';
import {
  Breadcrumb,
  Button,
  Card,
  CardProps,
  Col,
  Row,
  Space,
  Switch,
  Table,
  Tooltip,
} from 'antd';
import {
  FolderOpenOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Directory, File } from '../../models';

import SyncingSpin from '../../components/SyncingSpin';
import styles from './FileListCard.less';

export default function FileList({
  directory,
  fileList,
  actions,
  syncing,
  onClearSelectedDirectory,
  onSyncFiles,
}: Pick<CardProps, 'actions'> & {
  directory?: Directory;
  fileList: File[];
  syncing?: boolean;
  onClearSelectedDirectory: () => void;
  onSyncFiles: (directories?: Directory[]) => void;
}): JSX.Element {
  const [view, setView] = useState('thumb');

  let listView: JSX.Element;
  switch (view) {
    case 'thumb':
      listView = (
        <SyncingSpin spinning={syncing}>
          <Row gutter={12}>
            {Array.isArray(fileList) &&
              fileList.map((file) => (
                <Col span={3} key={file.path}>
                  <div className={styles['file-item']}>
                    <img src={file.thumb} alt={file.path} />
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
            tip: '正在同步中...',
          }}
        >
          <Table.Column<File>
            title="文件名"
            dataIndex="path"
            render={(value) => basename(value)}
          />
          <Table.Column<File>
            title="持续时间"
            dataIndex="duration"
            width={150}
            align="center"
            render={(value: number) => {
              const ceilValue = Math.ceil(value);
              const minutes = Math.floor(ceilValue / 60);
              const seconds = ceilValue % 60;
              return `${minutes
                .toString()
                .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }}
          />
          <Table.Column<File>
            title="可加入播单"
            dataIndex="generatable"
            width={110}
            align="center"
            render={() => <Switch checked />}
          />
        </Table>
      );
      break;
  }

  return (
    <div className="file-list-card">
      <Card
        bodyStyle={view === 'list' ? { padding: 0 } : {}}
        title={
          <Space size="middle">
            <Breadcrumb>
              <Breadcrumb.Item>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <a onClick={onClearSelectedDirectory}>
                  <Space>
                    <FolderOpenOutlined />
                    <span>默认空间</span>
                  </Space>
                </a>
              </Breadcrumb.Item>
              {directory != null && (
                <Breadcrumb.Item>{basename(directory.path)}</Breadcrumb.Item>
              )}
            </Breadcrumb>
            <Tooltip
              title="从硬盘同步（由于性能原因，您需要手动同步）"
              placement="right"
            >
              <Button
                icon={<ReloadOutlined />}
                onClick={() => onSyncFiles(directory ? [directory] : undefined)}
              >
                刷新
              </Button>
            </Tooltip>
          </Space>
        }
        extra={
          <>
            {/* TODO save user's choice */}
            <Tooltip title="列表" key="list-view">
              <Button
                type={view === 'list' ? 'link' : 'text'}
                icon={<UnorderedListOutlined />}
                onClick={() => setView('list')}
              />
            </Tooltip>
            <Tooltip title="缩略图" key="thumb-view">
              <Button
                type={view === 'thumb' ? 'link' : 'text'}
                icon={<AppstoreOutlined />}
                onClick={() => setView('thumb')}
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
