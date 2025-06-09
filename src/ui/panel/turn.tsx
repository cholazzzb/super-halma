import { Flex, Text, Box } from "@chakra-ui/react";
import { useSyncExternalStore } from "react";
import { Color } from "three";

import { getGameState, subscribeToGameStore } from "@/logic/store/game";

export function TurnPanel() {
  const { turn, playerTurn } = useSyncExternalStore(
    subscribeToGameStore,
    getGameState
  );

  return (
    <Flex
      position="fixed"
      bottom="60px"
      left="50%"
      transform="translateX(-50%)"
      zIndex={999}
      bg="whiteAlpha.700"
      width={200}
      color="gray.800"
      direction="column"
      padding="16px"
      alignItems="center"
      borderRadius="md"
      boxShadow="md"
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Turn {turn}
      </Text>
      <Box
        width="100%"
        padding="8px"
        borderRadius="md"
        bg={`#${new Color(playerTurn?.color).getHexString()}`}
        color="white"
        textAlign="center"
        fontWeight="bold"
      >
        {playerTurn?.id}
      </Box>
    </Flex>
  );
}
