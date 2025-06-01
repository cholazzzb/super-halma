import { Flex, Text } from '@chakra-ui/react';
import { useSyncExternalStore } from 'react';
import { Color } from 'three';

import { getGameState, subscribeToGameStore } from '@/logic/store/game';

export function TurnPanel() {
  const { turn, playerTurn } = useSyncExternalStore(
    subscribeToGameStore,
    getGameState,
  );

  return (
    <Flex
      position="fixed"
      top={10}
      left="50%"
      transform="translateX(-50%)"
      zIndex={999}
      backgroundColor="rgba(255,255,255,0.7)"
      width={150}
      color="black"
      direction="column"
      padding="12px"
      alignItems="center"
    >
      <Text>Turn: {turn}</Text>
      <Text color={`#${new Color(playerTurn?.color).getHexString()}`}>
        Player: {playerTurn?.id}
      </Text>
    </Flex>
  );
}
