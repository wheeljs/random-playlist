/* eslint-disable react/destructuring-assignment */
import { useState, useEffect, useCallback } from 'react';
import type { PropsWithChildren } from 'react';
import { Spin } from 'antd';
import type { SpinProps } from 'antd';
import { random } from 'lodash-es';
import { useTranslation } from 'react-i18next';

const MediaExtensionMaps = [
  ['avi', 'AVI'],
  ['flv', 'FLV'],
  ['mp3', 'MP3'],
  ['mp4', 'MP4'],
  ['mpeg', 'MPEG'],
  ['ogg', 'OGG'],
  ['rmvb', 'RMVB'],
];
const TipsContainsVariablesExp = /\[(\d+)\]/g;

export default function SyncingSpin(
  props: PropsWithChildren<SpinProps>
): JSX.Element {
  const { t } = useTranslation();

  const SyncingTips = t('syncing', { returnObjects: true });
  const [syncingTip, setSyncingTip] = useState<string>();

  const nextSyncingTip = useCallback(() => {
    const nextTipIndex = random(SyncingTips.length - 1);
    let nextTip = SyncingTips[nextTipIndex];
    if (TipsContainsVariablesExp.test(nextTip)) {
      const mediaExtension =
        MediaExtensionMaps[random(MediaExtensionMaps.length - 1)];
      nextTip = nextTip.replaceAll(
        TipsContainsVariablesExp,
        (_matched: string, index: string) => {
          return mediaExtension[index];
        }
      );
    }

    setSyncingTip(nextTip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!props.tip && props.spinning) {
      nextSyncingTip();

      let timer: NodeJS.Timeout;
      const push = () => {
        nextSyncingTip();
        timer = setTimeout(() => push(), random(2500, 7500));
      };
      push();

      return () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };
    }

    return () => {};
  }, [props.spinning, props.tip, nextSyncingTip]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Spin {...props} tip={props.tip ?? syncingTip} />;
}
