import { useEffect, useState } from 'react';
import { Button, Spin, Tabs, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import styles from './WorkspaceIndex.less';
import type { RootState } from '../store';
import type { Workspace } from '../../common/models';
import {
  fetchWorkspaces,
  selectLastWorkspace,
  selectWorkspaceOrDefault,
  selectWorkspaces,
  setSelectedId,
} from '../store/features/workspace/workspaceSlice';
import CreateWorkspaceModal from '../store/features/workspace/CreateWorkspaceModal';
import EditWorkspaceModal from '../store/features/workspace/EditWorkspaceModal';
import WorkspaceItem from '../store/features/workspace/WorkspaceItem';
import GlobalConfigModal from '../store/features/config/GlobalConfigModal';
import {
  setVisible,
  selectShowing,
  fetchConfigs,
} from '../store/features/config/configSlice';

const { TabPane } = Tabs;

export default function WorkspaceIndex(): JSX.Element {
  const dispatch = useDispatch();
  const selectedWorkspace = useSelector(selectWorkspaceOrDefault);
  const workspaces = useSelector(selectWorkspaces);
  const fetchStatus = useSelector((state: RootState) => state.workspace.status);
  const configFetchStatus = useSelector(
    (state: RootState) => state.config.status
  );

  const { t } = useTranslation();

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchWorkspaces());
    }
    if (configFetchStatus === 'idle') {
      dispatch(fetchConfigs());
    }
  }, [fetchStatus, dispatch, configFetchStatus]);

  const [showAddModal, setShowAddModal] = useState(false);
  const lastWorkspace = useSelector(selectLastWorkspace);
  const onWorkspaceTabClicked = (key: string) => dispatch(setSelectedId(key));
  const onAddWorkspaceClicked = () => setShowAddModal(true);
  const onCancelAddModal = () => setShowAddModal(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace>(null);
  const editWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setShowEditModal(true);
  };
  const onCancelEditModal = () => setShowEditModal(false);

  const showConfigModal = useSelector(selectShowing);
  const closeConfigModal = () => dispatch(setVisible(false));

  return (
    <div
      className={[styles['workspace-index-container'], 'h-100p'].join(' ')}
      data-tid="container"
    >
      <Spin
        wrapperClassName="h-100p"
        size="large"
        spinning={fetchStatus === 'loading'}
      >
        <Tabs
          className="h-100p"
          {...{
            activeKey: selectedWorkspace != null ? selectedWorkspace.id : '',
          }}
          tabBarExtraContent={
            <Tooltip title={t('create workspace.title')}>
              <Button icon={<PlusOutlined />} onClick={onAddWorkspaceClicked} />
            </Tooltip>
          }
          onTabClick={onWorkspaceTabClicked}
        >
          {workspaces.map((x) => (
            <TabPane
              tab={
                <Tooltip title={`${t('common.order')}: ${x.order}`}>
                  {x.name}&nbsp;
                  <Typography.Text type="secondary">
                    <EditOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        editWorkspace(x);
                      }}
                    />
                  </Typography.Text>
                </Tooltip>
              }
              key={x.id}
            >
              <WorkspaceItem className="h-100p" workspace={x} />
            </TabPane>
          ))}
        </Tabs>
      </Spin>
      <CreateWorkspaceModal
        visible={showAddModal}
        addAfterWorkspace={lastWorkspace}
        onCancel={onCancelAddModal}
      />

      <EditWorkspaceModal
        visible={showEditModal}
        workspace={editingWorkspace}
        onCancel={onCancelEditModal}
      />

      <GlobalConfigModal visible={showConfigModal} onClose={closeConfigModal} />
    </div>
  );
}
