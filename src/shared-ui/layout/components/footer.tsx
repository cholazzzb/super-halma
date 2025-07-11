import { Flex, Link, Text } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Flex
      as="footer"
      width="full"
      align="center"
      alignSelf="flex-end"
      justifyContent="center"
    >
      <Text fontSize="xs">
        {new Date().getFullYear()} -{' '}
        <Link
          href="https://github.com/cholazzzb/super-halma"
          target="_blank"
          rel="noopener noreferrer"
        >
          v-0.1.0
        </Link>
      </Text>
    </Flex>
  );
};
