/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { shell } from 'electron';

export default function NativeAnchor(
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
) {
  const onAnchorClick = (e) => {
    e.preventDefault();
    shell.openExternal(props.href);
  };
  return <a {...props} onClick={onAnchorClick} />;
}
