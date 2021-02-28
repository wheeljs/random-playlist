import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  ModalProps,
  Popconfirm,
} from 'antd';
import { InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { removeWorkspace, updateWorkspace } from './workspaceSlice';
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

  const doRemove = async () => {
    try {
      setSaving(true);
      await dispatch(removeWorkspace({ workspaceId: workspace.id }));

      onCancel();
    } catch (e) {
      message.error(`删除集合失败：${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="编辑集合"
      okText="保存"
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
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Popconfirm
            overlayClassName="widthed-popconfirm"
            icon={<CloseOutlined />}
            title="确定要删除这个集合吗？该操作不会影响集合中的文件夹、文件"
            okText="删除"
            okButtonProps={{ loading: saving }}
            okType="danger"
            onConfirm={doRemove}
          >
            <Button danger type="text" icon={<CloseOutlined />}>
              删除集合
            </Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </Modal>
  );
}
