import * as remote from '@electron/remote';
import React, { useEffect, useState, useRef, useCallback } from 'react';
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
import AnchorLink from 'antd/lib/anchor/AnchorLink';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useTranslation, Trans } from 'react-i18next';
import Flags from 'country-flag-icons/react/3x2';
import { RootState } from '../../store';
import { fetchConfigs, selectConfigs, updateConfigs } from './configSlice';

import styles from './GlobalConfigModal.less';
import { SaveOrUpdateConfig } from '../../../../common/models';
import { ConfigKeys } from '../../../services';

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
  const { t } = useTranslation();

  const [playerParameterRequired, setPlayerParameterRequired] =
    useState<boolean>(form.getFieldValue(ConfigKeys.PlayerPassMode) === 'list');
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
          switch (config.key) {
            case ConfigKeys.Glob:
              formValue[config.key] = (config.value as string[]).join('\n');
              break;
            default:
              formValue[config.key] = config.value;
              break;
          }
        });

        form.setFieldsValue(formValue);
      }
    }
  }, [visible, configs, dispatch, fetchStatus, form]);

  const l10nCategoryAnchor = useCallback(
    (node: AnchorLink) => {
      if (!form.getFieldValue(ConfigKeys.Language) && node != null) {
        message.info(t('config.language.required'));
        setTimeout(() => {
          node.handleClick(
            new MouseEvent('click') as unknown as React.MouseEvent<HTMLElement>
          );
        });
      }
    },
    [t, form]
  );

  const scrollContainer = useRef(null);

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
      title: t('config.select player.title'),
      message: t('config.playerExecutable.placeholder'),
      properties: ['openFile', 'dontAddToRecent'],
      filters: [
        { name: t('config.select player.exe filter'), extensions: ['exe'] },
      ],
    });
    if (dialogResult.canceled) {
      return;
    }
    const [playerExecutable] = dialogResult.filePaths;

    form.setFieldsValue({
      playerExecutable,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveConfig = async (values: any) => {
    const saveParams: SaveOrUpdateConfig[] = Object.keys(values).map(
      (configKey) => {
        switch (configKey) {
          case ConfigKeys.Glob:
            return {
              key: configKey,
              value: values.glob.split('\n'),
            };
            break;
          default:
            return {
              key: configKey,
              value: values[configKey],
            };
        }
      }
    );
    try {
      setSaving(true);

      await dispatch(updateConfigs(saveParams));

      message.success(t('global config.save success'));
      onClose();
    } catch (e) {
      message.error(`${t('global config.save failed')}：${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <Modal
      visible={visible}
      width={1040}
      title={t('global config.title')}
      keyboard={false}
      maskClosable={false}
      okText={t('common.save')}
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
              scrollContainer.current ||
              document.querySelector<HTMLDivElement>('.config-modal-scroll') ||
              window
            }
          >
            <Anchor.Link href="#config-player" title={t('config.player')} />
            <Anchor.Link href="#config-match" title={t('config.match')} />
            <Anchor.Link href="#config-view" title={t('config.view')} />
            <Anchor.Link
              href="#config-l10n"
              title={t('config.localization')}
              ref={l10nCategoryAnchor}
            />
          </Anchor>
        </Col>
        <Col
          span={18}
          className={styles['config-modal-scroll']}
          ref={scrollContainer}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ playerPassMode: 'list', playerParameter: '%f' }}
            preserve={false}
            onFieldsChange={handleFieldsChange}
            onFinish={saveConfig}
          >
            <a className={styles['config-category']} id="config-player">
              {t('config.player')}
            </a>
            <Form.Item required label={t('config.playerExecutable.label')}>
              <Input.Group compact className="auto-width">
                <Form.Item
                  name={ConfigKeys.PlayerExecutable}
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: t('config.playerExecutable.required'),
                    },
                  ]}
                >
                  <Input
                    placeholder={`${t(
                      'config.playerExecutable.placeholder'
                    )}(exe)`}
                  />
                </Form.Item>
                <Button type="primary" onClick={selectPlayerExecutable}>
                  {t('common.choose')}
                </Button>
              </Input.Group>
            </Form.Item>
            <Form.Item
              name={ConfigKeys.PlayerPassMode}
              label={t('config.playerPassMode.label')}
              tooltip={t('config.playerPassMode.tooltip')}
            >
              <Radio.Group>
                <Radio value="list">{t('config.playerPassMode.list')}</Radio>
                <Radio value="separate">
                  {t('config.playerPassMode.separate')}
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name={ConfigKeys.PlayerParameter}
              label={t('config.playerParameter.label')}
              dependencies={[ConfigKeys.PlayerPassMode]}
              help={
                <Trans i18nKey="config.playerParameter.help">
                  打开播放器的参数。“文件参数传递方式”为“列表”时使用
                  <Typography.Text code>%f</Typography.Text>
                  来代替文件列表；为“逐项”时在这里忽略文件列表。
                </Trans>
              }
              rules={[
                {
                  required: playerParameterRequired,
                  message: t('config.playerParameter.required'),
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
                        t('config.playerParameter.invalid list')
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
                    label={t('config.playerSeparateParameter.label')}
                    help={
                      <Trans i18nKey="config.playerSeparateParameter.help">
                        使用<Typography.Text code>%fi</Typography.Text>
                        代替文件名
                      </Trans>
                    }
                    rules={[
                      {
                        required: true,
                        message: t('config.playerSeparateParameter.required'),
                      },
                      () => ({
                        validator(_, value) {
                          if (!value || !value.includes('%fi')) {
                            // eslint-disable-next-line prefer-promise-reject-errors
                            return Promise.reject(
                              t('config.playerSeparate.invalid separate')
                            );
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

            <a className={styles['config-category']} id="config-match">
              {t('config.match')}
            </a>
            <Form.Item
              name={ConfigKeys.Glob}
              label={t('config.glob.label')}
              tooltip={
                <Trans i18nKey="config.glob.tooltip">
                  使用
                  <a
                    href="https://en.wikipedia.org/wiki/Glob_(programming)"
                    target="_blank"
                  >
                    glob
                  </a>{' '}
                  匹配选中目录的内容，不要改动除非你明确知道结果
                </Trans>
              }
            >
              <Input.TextArea autoSize={{ minRows: 8, maxRows: 8 }} />
            </Form.Item>

            <a className={styles['config-category']} id="config-view">
              {t('config.view')}
            </a>
            <Form.Item
              label={t('config.viewMode.label')}
              name={ConfigKeys.ViewMode}
              tooltip={t('config.viewMode.tooltip')}
            >
              <Radio.Group>
                <Radio.Button value="thumb">
                  <AppstoreOutlined />
                  &nbsp;{t('config.viewMode.thumb')}
                </Radio.Button>
                <Radio.Button value="list">
                  <UnorderedListOutlined />
                  &nbsp;{t('config.viewMode.list')}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <a className={styles['config-category']} id="config-l10n">
              {t('config.localization')}
            </a>
            <Form.Item
              label={t('config.language.label')}
              name={ConfigKeys.Language}
              className={styles['country-flags-radio-group']}
            >
              <Radio.Group>
                <Radio.Button value="zh-CN">
                  <Flags.CN title={t('language.zh-CN')} />
                </Radio.Button>
                <Radio.Button value="en">
                  <Flags.US title={t('language.en')} />
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
}
