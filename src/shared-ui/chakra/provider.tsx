'use client';

import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '../styles/theme';
import { ColorModeProvider } from './color-mode';

export function Provider(props: React.PropsWithChildren) {
  return (
    <ChakraProvider value={theme}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </ChakraProvider>
  );
}
