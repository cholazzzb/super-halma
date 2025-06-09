import { Button, Center, VStack } from "@chakra-ui/react";

import { player1, player2, positions } from "@/data/setup-2-players";
import { SetupService } from "@/logic/service/setup";
import { TurnService } from "@/logic/service/turn";
import { UIHandlerService } from "@/logic/service/ui-handler";
import { registerSingleton } from "@/shared-logic/decorator/dependency-injection";
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
    <Center height="100vh" backgroundColor="#80b0ff">
      <VStack align="center">
        <Button onClick={handlePlayClick}>2 Players Game</Button>
        <Button disabled>4 Players Game (Coming Soon)</Button>
      </VStack>
    </Center>
  );
}

const setupService = new SetupService();
registerSingleton(SetupService, setupService);
const uiHandlerService = new UIHandlerService();
registerSingleton(UIHandlerService, uiHandlerService);
const turnService = new TurnService();
registerSingleton(TurnService, turnService);
