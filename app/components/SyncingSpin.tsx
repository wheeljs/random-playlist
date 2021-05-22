/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, PropsWithChildren } from 'react';
import { Spin, SpinProps } from 'antd';
import { random } from 'lodash-es';

const MediaExtensionMaps = [
  ['avi', 'AVI'],
  ['flv', 'FLV'],
  ['mp3', 'MP3'],
  ['mp4', 'MP4'],
  ['mpeg', 'MPEG'],
  ['ogg', 'OGG'],
  ['rmvb', 'RMVB'],
];
const SyncingTips = [
  '正在读取全局Glob 配置...',
  '正在生成缩略图...',
  '正在获取持续时间...',
  '正在将 [1] 转换为 [0]...',
  '正在压缩缩略图...',
  '正在学习Glob...',
  '正在开启Shell...',
];
const TipsContainsVariablesExp = /\[(\d+)\]/g;

export default function SyncingSpin(
  props: PropsWithChildren<SpinProps>
): JSX.Element {
  const [syncingTip, setSyncingTip] = useState<string>();

  const nextSyncingTip = () => {
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
  };

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
  }, [props.spinning, props.tip]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Spin {...props} tip={props.tip ?? syncingTip} />;
}
