import path from 'path';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Input, message, Modal, Popover } from 'antd';
import type { ModalProps } from 'antd';
import { CloseCircleOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { uniqBy } from 'lodash-es';
import { useTranslation, Trans } from 'react-i18next';

import type { PathListed } from '../../../utils/fileHelper';
import {
  listFilesAndDirectories,
  openImportDialog,
  videoFileDetails,
} from '../../../utils/fileHelper';
import type { Workspace } from '../../../../common/models';
import { configService, directoryService } from '../../../services';

import styles from './ImportDirectoriesModal.less';
import type { ImportDirectoriesToWorkspace } from '../../../services/directory';
import { fetchWorkspaces } from '../workspace/workspaceSlice';
import SyncingSpin from '../../../components/SyncingSpin';

interface ImportPath {
  path: string;
  imported: PathListed;
}

export default function ImportDirectoriesModal({
  workspace,
  visible,
  onClose,
}: Pick<ModalProps, 'visible'> & {
  workspace: Workspace;
  onClose: () => void;
}): JSX.Element {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [busying, setBusying] = useState(false);
  const [glob, setGlob] = useState('');
  const [importPaths, setImportPaths] = useState<ImportPath[]>([]);

  useEffect(() => {
    (async () => {
      const globConfig = await configService.get('glob');
      const globText = (globConfig.value as string[]).join('\n');
      setGlob(globText);
      form.setFieldsValue({
        glob: globText,
      });
    })();
  }, [visible, form]);

  const beforeClose = () => {
    setBusying(false);
    setImportPaths([]);
    onClose();
  };

  const showDirectorySelect = async () => {
    if (busying) {
      return;
    }
    let globText = form.getFieldValue('glob');
    if (!globText) {
      globText = '**/*';
    }
    const globPatterns = globText.split('\n');

    const { canceled, filePaths } = await openImportDialog();
    if (canceled) {
      message.warn(t('import directory.canceled'));
      return;
    }
    setBusying(true);
    const pathsImported = await Promise.all(
      filePaths.map((x) =>
        listFilesAndDirectories({
          patterns: globPatterns,
          root: x,
        }).then((imported) => ({
          path: x,
          imported,
        }))
      )
    );
    setImportPaths((prev) =>
      uniqBy([...prev, ...pathsImported], (x) => x.path)
    );
    setBusying(false);
  };

  const removeImportPath = (importPath: ImportPath) => {
    setImportPaths((prev) => prev.filter((x) => x !== importPath));
  };

  const doImport = async () => {
    if (busying) {
      return;
    }
    if (importPaths.length === 0) {
      message.warn(t('import directory.have not selected'));
      return;
    }

    const globPattern = form.getFieldValue('glob');
    const specifyGlob = globPattern === glob ? null : globPattern;
    const importParams: ImportDirectoriesToWorkspace = {
      workspaceId: workspace.id,
      directories: importPaths.map((x) => ({
        path: x.path,
        glob: specifyGlob,
        files: videoFileDetails({
          filePaths: x.imported.files.map((file) => path.join(x.path, file)),
          thumbDir: path.join(x.path, '.rpcache'),
          fallbackDirectory: path.basename(x.path),
        }),
      })),
    };

    setBusying(true);
    try {
      const results = await Promise.all(
        importParams.directories.map((x) => x.files)
      );
      results.forEach(
        // eslint-disable-next-line no-return-assign
        (files, index) => (importParams.directories[index].files = files)
      );

      await directoryService.importToWorkspace(importParams);
      dispatch(fetchWorkspaces());
      beforeClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      message.warn(`${t('import directory.failed')}：${err.message}`);
    } finally {
      setBusying(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title={t('import directory.title')}
      okText={t('common.add')}
      okButtonProps={{ loading: busying }}
      keyboard={false}
      maskClosable={false}
      onOk={doImport}
      onCancel={beforeClose}
      destroyOnClose
    >
      <SyncingSpin spinning={busying}>
        <Form form={form} wrapperCol={{ offset: 6, span: 18 }} preserve={false}>
          <Form.Item
            label={t('config.glob.label')}
            name="glob"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            tooltip={
              <>
                <Trans i18nKey="config.glob.tooltip">
                  使用
                  <a
                    href="https://en.wikipedia.org/wiki/Glob_(programming)"
                    target="_blank"
                  >
                    glob
                  </a>{' '}
                  匹配选中目录的内容，不要改动除非你明确知道结果
                  <br />
                </Trans>
                {t('import directory.extra')}
              </>
            }
          >
            <Input.TextArea autoSize={{ minRows: 8, maxRows: 8 }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<FolderOpenOutlined />}
              onClick={showDirectorySelect}
            >
              {t('import directory.importPath.label')}
            </Button>
          </Form.Item>
          {importPaths.length > 0 && (
            <Form.Item>
              <span className="ant-form-text">
                <ul className={styles['import-path-container']}>
                  {importPaths.map((x) => (
                    <li key={x.path}>
                      <span className={styles['import-path-path']}>
                        {x.path}
                      </span>
                      <span className={styles['import-path-summary']}>
                        <Trans
                          i18nKey="import directory.importPath.result"
                          values={{
                            filesLength: x.imported.files.length,
                            directoriesLength: x.imported.directories.length,
                          }}
                        >
                          匹配到
                          <span
                            className={styles['import-path-summary-count']}
                          />
                          个文件，在
                          <span
                            className={styles['import-path-summary-count']}
                          />
                          个目录中。
                        </Trans>
                      </span>
                      <Popover content={t('common.remove')} placement="right">
                        <Button
                          type="text"
                          danger
                          size="small"
                          onClick={() => removeImportPath(x)}
                        >
                          <CloseCircleOutlined />
                        </Button>
                      </Popover>
                    </li>
                  ))}
                </ul>
              </span>
            </Form.Item>
          )}
        </Form>
      </SyncingSpin>
    </Modal>
  );
}
