import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, message, Modal, ModalProps } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { updateWorkspace } from './workspaceSlice';
import { Workspace } from '../../models';
import { UpdateWorkspace } from '../../services';

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
      message.error(`保存集合失败：${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const save = () => {
    form.submit();
  };

  return (
    <Modal
      visible={visible}
      title="编辑集合"
      okText="保存"
      keyboard={false}
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
          label="集合名称"
          name="name"
          rules={[{ required: true, message: '请输入集合名称' }]}
        >
          <Input placeholder="集合名称" />
        </Form.Item>
        <Form.Item label="排序" required>
          <Form.Item
            noStyle
            name="order"
            rules={[{ required: true, message: '请指定排序' }]}
          >
            <InputNumber min={1} step={10} />
          </Form.Item>
          <span>
            <InfoCircleOutlined />
            排序最靠前的为默认集合
          </span>
        </Form.Item>
      </Form>
    </Modal>
  );
}
