import { Button, Center, VStack } from "@chakra-ui/react";

import { player1, player2, positions } from "@/data/setup-2-players";
import { useEventEmitter } from "@/shared-logic/hook/event-emitter";

type Props = {
  toPlaySection: () => void;
};

export function Setup(props: Props) {
  const eventEmitter = useEventEmitter();

  const handlePlayClick = () => {
    eventEmitter("setup:2-players", {
      player1,
      player2,
      positions,
    });
    props.toPlaySection();
  };

  return (
    <Center height="100vh">
      <VStack align="center">
        <Button onClick={handlePlayClick}>2 Players Game</Button>
        <Button disabled>4 Players Game (Coming Soon)</Button>
      </VStack>
    </Center>
  );
}
