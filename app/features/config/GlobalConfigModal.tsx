import { remote } from 'electron';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Modal,
  ModalProps,
  Row,
  Col,
  Input,
  Button,
  Typography,
  Radio,
  Anchor,
  message,
} from 'antd';
import { RootState } from '../../store';
import { fetchConfigs, selectConfigs, updateConfigs } from './configSlice';

import styles from './GlobalConfigModal.less';
import { SaveOrUpdateConfig } from '../../models';
import { ConfigKeys } from '../../services';

export default function GlobalConfigModal({
  visible,
  onClose,
}: Pick<ModalProps, 'visible'> & {
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const configs = useSelector(selectConfigs);
  const fetchStatus = useSelector((state: RootState) => state.config.status);

  const [form] = Form.useForm();

  const [
    playerParameterRequired,
    setPlayerParameterRequired,
  ] = useState<boolean>(
    form.getFieldValue(ConfigKeys.PlayerPassMode) === 'list'
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.validateFields(['playerParameter']);
  }, [form, playerParameterRequired]);

  useEffect(() => {
    if (visible) {
      if (fetchStatus === 'idle') {
        dispatch(fetchConfigs());
      } else if (fetchStatus === 'fulfilled') {
        const formValue = {};
        Object.values(configs).forEach((config) => {
          formValue[config.key] = config.value;
        });

        form.setFieldsValue(formValue);
      }
    }
  }, [visible, configs, dispatch, fetchStatus, form]);

  const handleFieldsChange = (changedFields) => {
    const playerPassMode = changedFields.find(
      (x) => x.name[0] === ConfigKeys.PlayerPassMode
    );
    if (playerPassMode == null) {
      return;
    }
    setPlayerParameterRequired(playerPassMode.value === 'list');
  };

  const selectPlayerExecutable = async () => {
    const dialogResult = await remote.dialog.showOpenDialog({
      defaultPath:
        form.getFieldValue(ConfigKeys.PlayerExecutable) ||
        remote.app.getPath('home'),
      title: '选择播放器',
      message: '请选择播放器的可执行文件',
      properties: ['openFile', 'dontAddToRecent'],
      filters: [{ name: '可执行文件', extensions: ['exe'] }],
    });
    if (dialogResult.canceled) {
      return;
    }
    const [playerExecutable] = dialogResult.filePaths;

    form.setFieldsValue({
      playerExecutable,
    });
  };

  const saveConfig = async (values: any) => {
    const saveParams: SaveOrUpdateConfig[] = Object.keys(values).map(
      (configKey) => ({
        key: configKey,
        value: values[configKey],
      })
    );
    try {
      setSaving(true);

      await dispatch(updateConfigs(saveParams));

      message.success('保存配置成功');
      onClose();
    } catch (e) {
      message.error(`保存配置失败：${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      width={1040}
      title="全局配置"
      wrapClassName="global-config-modal"
      keyboard={false}
      maskClosable={false}
      okText="保存"
      okButtonProps={{ loading: saving }}
      onOk={() => form.submit()}
      onCancel={onClose}
      destroyOnClose
    >
      <Row gutter={32}>
        <Col span={6}>
          <Anchor
            onClick={(e) => e.preventDefault()}
            getContainer={() =>
              document.querySelector<HTMLDivElement>('.global-config-modal')
            }
          >
            <Anchor.Link href="#config-player" title="播放器设置" />
          </Anchor>
        </Col>
        <Col span={18}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ playerPassMode: 'list', playerParameter: '%f' }}
            preserve={false}
            onFieldsChange={handleFieldsChange}
            onFinish={saveConfig}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className={styles['config-category']} id="config-player">
              播放器设置
            </a>
            <Form.Item required label="播放器路径">
              <Input.Group compact className="auto-width">
                <Form.Item
                  name={ConfigKeys.PlayerExecutable}
                  noStyle
                  rules={[{ required: true, message: '必须选择播放器路径' }]}
                >
                  <Input placeholder="请选择播放器的可执行文件(exe)" />
                </Form.Item>
                <Button type="primary" onClick={selectPlayerExecutable}>
                  选择
                </Button>
              </Input.Group>
            </Form.Item>
            <Form.Item
              name={ConfigKeys.PlayerPassMode}
              label="文件参数传递方式"
              tooltip="不知道如何填写，请先不修改默认参数试一试"
            >
              <Radio.Group>
                <Radio value="list">列表</Radio>
                <Radio value="separate">逐项</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name={ConfigKeys.PlayerParameter}
              label="播放器参数"
              dependencies={[ConfigKeys.PlayerPassMode]}
              help={
                <>
                  打开播放器的参数。“文件参数传递方式”为“列表”时使用
                  <Typography.Text code>%f</Typography.Text>
                  来代替文件列表；为“逐项”时在这里忽略文件列表。
                </>
              }
              rules={[
                {
                  required: playerParameterRequired,
                  message: '请填写播放器参数',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const passMode = getFieldValue(ConfigKeys.PlayerPassMode);
                    if (
                      passMode === 'list' &&
                      (!value || !value.includes('%f'))
                    ) {
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.reject(
                        '参数传递方式为列表时参数必须包含`%f`'
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
            <Form.Item
              className="ant-form-item-with-help"
              shouldUpdate={(prevVal, newVal) =>
                prevVal.playerPassMode !== newVal.playerPassMode
              }
            >
              {() => {
                return form.getFieldValue(ConfigKeys.PlayerPassMode) ===
                  'separate' ? (
                  <Form.Item
                    name={ConfigKeys.PlayerSeparateParameter}
                    label="逐项参数"
                    help={
                      <>
                        使用<Typography.Text code>%fi</Typography.Text>
                        代替文件名
                      </>
                    }
                    rules={[
                      { required: true, message: '请填写逐项参数' },
                      () => ({
                        validator(_, value) {
                          if (!value || !value.includes('%fi')) {
                            // eslint-disable-next-line prefer-promise-reject-errors
                            return Promise.reject('必须包含`%fi`');
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
}
