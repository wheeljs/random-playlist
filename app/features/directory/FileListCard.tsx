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
  Spin,
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
import { Directory } from '../../models';

import styles from './FileListCard.less';
import { VideoFile } from '../../utils/fileHelper';

export default function FileList({
  directory,
  fileList,
  actions,
  syncing,
  onSyncFiles,
}: Pick<CardProps, 'actions'> & {
  directory?: Directory;
  fileList: VideoFile[];
  syncing?: boolean;
  onSyncFiles: (directories?: Directory[]) => void;
}): JSX.Element {
  const [view, setView] = useState('thumb');

  let listView: JSX.Element;
  switch (view) {
    case 'thumb':
      listView = (
        <Spin spinning={syncing}>
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
        </Spin>
      );
      break;
    case 'list':
    default:
      listView = (
        <Table<VideoFile>
          dataSource={fileList}
          pagination={false}
          loading={syncing}
        >
          <Table.Column<VideoFile>
            title="文件名"
            dataIndex="path"
            render={(value) => basename(value)}
          />
          <Table.Column<VideoFile>
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
          <Table.Column<VideoFile>
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
                <FolderOpenOutlined />
                <span>默认空间</span>
              </Breadcrumb.Item>
              {directory != null && (
                <Breadcrumb.Item>{basename(directory.path)}</Breadcrumb.Item>
              )}
            </Breadcrumb>
            <Tooltip
              title="从硬盘同步（由于性能原因，您需要手动同步）"
              placement="right"
            >
              <Button icon={<ReloadOutlined />} onClick={() => onSyncFiles()}>
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
