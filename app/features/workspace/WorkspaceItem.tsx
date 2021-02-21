import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Workspace } from '../../models';

import styles from './WorkspaceItem.less';
import ImportDirectoriesModal from '../directory/ImportDirectoriesModal';

export default function WorkspaceItem({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  workspace,
}: {
  workspace: Workspace;
}): JSX.Element {
  const [showImportModal, setShowImportModal] = useState(false);

  const openImportModal = () => setShowImportModal(true);
  const onImportModalClose = () => setShowImportModal(false);

  return (
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
    </div>
  );
}
