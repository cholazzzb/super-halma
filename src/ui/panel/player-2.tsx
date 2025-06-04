import { Box, Flex, Text } from "@chakra-ui/react";
import { useSyncExternalStore } from "react";
import { FaStar } from "react-icons/fa";
import { Color } from "three";

import { PlayerId } from "@/logic/domain/player";
import { getPlayerState, subscribeToPlayerStore } from "@/logic/store/player";
import { getStarState, subscribeToStarStore } from "@/logic/store/star";

export function Player2Panel() {
  const { players } = useSyncExternalStore(
    subscribeToPlayerStore,
    getPlayerState,
  );

  const { starCount } = useSyncExternalStore(
    subscribeToStarStore,
    getStarState,
  );

  const player2Id = Object.keys(players)[1] as PlayerId;

  const stars = starCount[player2Id] ?? {};

  return (
    <Flex
      position="fixed"
      top="12px"
      right="12px"
      zIndex={999}
      backgroundColor={`#${new Color(players[player2Id].color).getHexString()}`}
      width={200}
      color="white"
      direction="column"
      padding="16px"
      alignItems="center"
      borderRadius="md"
      boxShadow="md"
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Player 1
      </Text>
      {Object.entries(stars).map(([color, star]) => {
        return (
          <Box key={color} display="flex" alignItems="center">
            <FaStar
              size={20}
              color={new Color(color).getHexString()}
              style={{ marginRight: "8px" }}
            />
            <Text fontSize="md">Stars: {star.count}</Text>
          </Box>
        );
      })}
    </Flex>
  );
}
