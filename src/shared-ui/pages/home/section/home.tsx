import { Button, Center, Text } from '@chakra-ui/react';

type Props = {
  toSetupSection: () => void;
};
export function HomeSection(props: Props) {
  return (
    <Center>
      <Text>Welcome to Super Halma!</Text>
      <Button onClick={props.toSetupSection}>Play!</Button>
    </Center>
  );
}
