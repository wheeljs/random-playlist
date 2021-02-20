import React from 'react';
import { Button, Form, message, Modal, ModalProps } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import {
  listFilesAndDirectories,
  openImportDialog,
} from '../../utils/importHelper';

export default function ImportDirectoriesModal({
  visible,
  onClose,
}: Pick<ModalProps, 'visible'> & {
  onClose: () => void;
}): JSX.Element {
  const [form] = Form.useForm();

  const showDirectorySelect = async () => {
    const { canceled, filePaths } = await openImportDialog();
    if (canceled) {
      message.warn('用户取消了导入');
    }
  };

  return (
    <Modal
      visible={visible}
      title="导入文件夹"
      okText="导入"
      keyboard={false}
      onCancel={onClose}
      destroyOnClose
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        preserve={false}
      >
        <Form.Item label="选择文件夹">
          <Button
            type="primary"
            icon={<FolderOpenOutlined />}
            onClick={showDirectorySelect}
          >
            选择文件夹
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
