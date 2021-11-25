import React from 'react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const { children } = props;
  return <>{children}</>;
}
