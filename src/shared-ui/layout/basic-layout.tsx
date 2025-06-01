import { Box, Flex } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { Footer } from './components/footer';
import { Meta } from './components/meta';

type BasicLayoutProps = {
  children: ReactNode;
};

export const BasicLayout = ({ children }: BasicLayoutProps) => {
  return (
    <Box transition="0.5s ease-out">
      <Meta />
      <Flex wrap="wrap">
        <Box width="full" as="main">
          {children}
        </Box>
        <Footer />
      </Flex>
    </Box>
  );
};
