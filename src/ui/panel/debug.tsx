import { Flex, Text, Heading } from "@chakra-ui/react";
import { useSyncExternalStore } from "react";

import { getPlayerState, subscribeToPlayerStore } from "@/logic/store/player";
import { getWorldState, subscribeToWorldStore } from "@/logic/store/world";

export function DebugPanel() {
  const { players } = useSyncExternalStore(
    subscribeToPlayerStore,
    getPlayerState,
  );

  const { pieces, stars } = useSyncExternalStore(
    subscribeToWorldStore,
    getWorldState,
  );

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
      overflowY="scroll"
      boxShadow="md"
    >
      <Heading size="sm" mb={2}>
        Debug Panel
      </Heading>
      <Heading size="xs">Pieces</Heading>
      {Object.entries(pieces).map(([key, value]) => (
        <Text key={key} fontSize="xs">
          {key}: {value.ownerId}
        </Text>
      ))}
      <Heading size="xs" mt={4}>
        Stars
      </Heading>
      {Object.entries(stars).map(([key, value]) => (
        <Text key={key} fontSize="xs" color={value.color}>
          {key}: {value.color}
        </Text>
      ))}
      <Heading size="xs" mt={4}>
        Players
      </Heading>
      {Object.entries(players).map(([key, value]) => (
        <Text key={key} fontSize="xs" color={value.color.toString()}>
          {key}: {value.color.toString()}
        </Text>
      ))}
    </Flex>
  );
}
