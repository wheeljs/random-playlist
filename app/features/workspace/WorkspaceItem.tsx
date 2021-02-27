import React, { useState } from 'react';
import path from 'path';
import { Button, Card, Divider, Popover } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Workspace } from '../../models';

import styles from './WorkspaceItem.less';
import ImportDirectoriesModal from '../directory/ImportDirectoriesModal';

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
  const [showImportModal, setShowImportModal] = useState(false);

  const openImportModal = () => setShowImportModal(true);
  const onImportModalClose = () => setShowImportModal(false);

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
            <Popover key={x.id} visible={false}>
              <div className={styles['directory-item']}>
                {/* <span className={styles['directory-item-summary']}>0</span> */}
                <span className={styles['directory-item-name']}>
                  {path.basename(x.path)}
                </span>
              </div>
            </Popover>
          ))}
      </div>
      <Divider />
      <Card
        actions={[
          <Button type="primary" key="generate">
            生成并播放
          </Button>,
        ]}
      />
    </div>
  );
}
