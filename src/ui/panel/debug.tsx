import { Flex, Text } from '@chakra-ui/react';
import { useSyncExternalStore } from 'react';

import {
  getInteractionState,
  subscribeToInteractionStore,
} from '@/logic/store/interaction';
import { getWorldState, subscribeToWorldStore } from '@/logic/store/world';

export function DebugPanel() {
  const { activedPositionId } = useSyncExternalStore(
    subscribeToInteractionStore,
    getInteractionState,
  );

  const { pieces } = useSyncExternalStore(subscribeToWorldStore, getWorldState);
  const piece = activedPositionId && pieces[activedPositionId];

  return (
    <Flex
      position="fixed"
      bottom={0}
      left={0}
      zIndex={999}
      backgroundColor="rgba(255,255,255,0.7)"
      height={500}
      width={300}
      color="black"
      direction="column"
      padding="12px"
    >
      <Text>{activedPositionId}</Text>
      <Text>Piece: {piece?.id}</Text>
      <Text>OwnerId: {piece?.ownerId}</Text>
    </Flex>
  );
}
