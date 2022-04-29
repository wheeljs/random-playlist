import { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
} from 'antd';
import type { ModalProps } from 'antd';
import { InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { removeWorkspace, updateWorkspace } from './workspaceSlice';
import type { Workspace } from '../../../../common/models';
import type { UpdateWorkspace } from '../../../services';

export default function EditWorkspaceModal({
  visible,
  onCancel,
  workspace,
}: Pick<ModalProps, 'visible'> & {
  onCancel: () => void;
  workspace: Workspace;
}): JSX.Element {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(workspace);
  }, [form, workspace]);

  const doSave = async (values: UpdateWorkspace) => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      await dispatch(
        updateWorkspace({
          ...values,
          id: workspace.id,
        })
      );

      onCancel();
    } catch (e) {
      message.error(`${t('edit workspace.save failed')}：${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const save = () => {
    form.submit();
  };

  const doRemove = async () => {
    try {
      setSaving(true);
      await dispatch(removeWorkspace({ workspaceId: workspace.id }));

      onCancel();
    } catch (e) {
      message.error(`${t('edit workspace.remove failed')}：${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title={t('edit workspace.title')}
      okText={t('common.save')}
      keyboard={false}
      maskClosable={false}
      onOk={save}
      confirmLoading={saving}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={workspace}
        preserve={false}
        onFinish={doSave}
      >
        <Form.Item
          label={t('workspace.name.label')}
          name="name"
          rules={[{ required: true, message: t('workspace.name.required') }]}
        >
          <Input placeholder={t('workspace.name.label')} />
        </Form.Item>
        <Form.Item label={t('workspace.order.label')} required>
          <Form.Item
            noStyle
            name="order"
            rules={[{ required: true, message: t('workspace.order.required') }]}
          >
            <InputNumber min={1} step={10} />
          </Form.Item>
          <span>
            <InfoCircleOutlined />
            {t('workspace.order.extra')}
          </span>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Popconfirm
            overlayClassName="widthed-popconfirm"
            icon={<CloseOutlined />}
            title={t('edit workspace.remove confirm')}
            okText={t('common.remove')}
            okButtonProps={{ loading: saving }}
            okType="danger"
            onConfirm={doRemove}
          >
            <Button danger type="text" icon={<CloseOutlined />}>
              {t('edit workspace.remove')}
            </Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </Modal>
  );
}
