import React, { useEffect, useState } from 'react';
import { Button, Spin, Tabs, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Home.less';
import { RootState } from '../store';
import {
  fetchWorkspaces,
  selectLastWorkspace,
  selectWorkspaceOrDefault,
  selectWorkspaces,
  setSelectedId,
} from '../features/workspace/workspaceSlice';
import CreateWorkspaceModal from '../features/workspace/CreateWorkspaceModal';

const { TabPane } = Tabs;

export default function Home(): JSX.Element {
  const dispatch = useDispatch();
  const selectedWorkspace = useSelector(selectWorkspaceOrDefault);
  const workspaces = useSelector(selectWorkspaces);
  const fetchStatus = useSelector((state: RootState) => state.workspace.status);

  const [showAddModal, setShowAddModal] = useState(false);
  const lastWorkspace = useSelector(selectLastWorkspace);

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchWorkspaces());
    }
  }, [fetchStatus, dispatch]);

  const onWorkspaceTabClicked = (key: string) => dispatch(setSelectedId(key));
  const onAddWorkspaceClicked = () => setShowAddModal(true);
  const onCancelAddModal = () => setShowAddModal(false);

  return (
    <div className={styles['home-container']} data-tid="container">
      <Spin size="large" spinning={fetchStatus === 'loading'}>
        <Tabs
          {...{
            activeKey: selectedWorkspace != null ? selectedWorkspace.id : '',
          }}
          tabBarExtraContent={
            <Tooltip title="添加集合">
              <Button icon={<PlusOutlined />} onClick={onAddWorkspaceClicked} />
            </Tooltip>
          }
          onTabClick={onWorkspaceTabClicked}
        >
          {workspaces.map((x) => (
            <TabPane
              tab={
                <>
                  {x.name}&nbsp;
                  <Typography.Text type="secondary">
                    <EditOutlined />
                  </Typography.Text>
                </>
              }
              key={x.id}
            >
              {Array.isArray(x.directories) ? x.directories.length : 'unknown'}
            </TabPane>
          ))}
        </Tabs>
      </Spin>
      <CreateWorkspaceModal
        visible={showAddModal}
        addAfterWorkspace={lastWorkspace}
        onCancel={onCancelAddModal}
      />
    </div>
  );
}
