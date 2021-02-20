import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Workspace } from '../../models';

import styles from './WorkspaceItem.less';

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
      <Button
        type="primary"
        className="add-directory"
        icon={<PlusOutlined />}
        onClick={openImportModal}
      />
    </div>
  );
}
