import React, { useState } from 'react';
import {
  Form,
  FormItemProps,
  Input,
  InputNumber,
  message,
  Modal,
  ModalProps,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { SaveWorkspace } from '../../services';
import { addWorkspace } from './workspaceSlice';
import { Workspace } from '../../models';

export default function CreateWorkspaceModal({
  visible,
  onCancel,
  addAfterWorkspace,
}: Pick<ModalProps, 'visible'> & {
  onCancel: () => void;
  addAfterWorkspace?: Workspace;
}): JSX.Element {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);

  const doSave = async (values: SaveWorkspace) => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      await dispatch(addWorkspace(values));

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

  const orderFieldProps: FormItemProps = {};
  if (addAfterWorkspace != null) {
    orderFieldProps.tooltip = (
      <span>
        默认值由当前最后的集合 {addAfterWorkspace.name}(排序:
        {` ${addAfterWorkspace.order}`}) + 10 得到。
      </span>
    );
  }

  return (
    <Modal
      visible={visible}
      title="添加集合"
      okText="添加"
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
        initialValues={
          addAfterWorkspace != null
            ? { order: addAfterWorkspace.order + 10 }
            : {}
        }
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
        <Form.Item
          label="排序"
          required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...orderFieldProps}
        >
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

CreateWorkspaceModal.defaultProps = {
  addAfterWorkspace: null,
};
