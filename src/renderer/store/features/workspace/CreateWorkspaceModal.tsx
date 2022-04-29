import { useState } from 'react';
import { Form, Input, InputNumber, message, Modal } from 'antd';
import type { FormItemProps, ModalProps } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import type { SaveWorkspace } from '../../../services';
import { addWorkspace } from './workspaceSlice';
import type { Workspace } from '../../../../common/models';

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
  const { t } = useTranslation();

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
      message.error(`${t('edit workspace.save failed')}：${e.message}`);
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
        <Trans i18nKey="workspace.order.next" values={addAfterWorkspace}>
          默认值由当前最后的集合 {addAfterWorkspace.name}(排序:
          {` ${addAfterWorkspace.order}`}) + 10 得到。
        </Trans>
      </span>
    );
  }

  return (
    <Modal
      visible={visible}
      title={t('create workspace.title')}
      okText={t('common.add')}
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
          label={t('workspace.name.label')}
          name="name"
          rules={[{ required: true, message: t('workspace.name.required') }]}
        >
          <Input placeholder={t('workspace.name.label')} />
        </Form.Item>
        <Form.Item
          label={t('workspace.order.label')}
          required
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...orderFieldProps}
        >
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
      </Form>
    </Modal>
  );
}

CreateWorkspaceModal.defaultProps = {
  addAfterWorkspace: null,
};
