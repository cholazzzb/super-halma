import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { useSyncExternalStore } from "react";
import { FaStar } from "react-icons/fa";
import { Color } from "three";

import { PlayerId } from "@/logic/domain/player";
import { getPlayerState, subscribeToPlayerStore } from "@/logic/store/player";
import { getStarState, subscribeToStarStore } from "@/logic/store/star";

export function Player1Panel() {
  const { players } = useSyncExternalStore(
    subscribeToPlayerStore,
    getPlayerState,
  );

  const { starCount } = useSyncExternalStore(
    subscribeToStarStore,
    getStarState,
  );

  const player1Id = Object.keys(players)[0] as PlayerId;
  const color = `#${new Color(players[player1Id].color).getHexString()}`;

  const stars = starCount[player1Id] ?? {};

  const mainRed = "#ff0000";
  const accentRed = "#dd3344";

  return (
    <Flex
      position="fixed"
      top="12px"
      left="18px"
      zIndex={999}
      color="white"
      width="125px"
      height="300px"
      direction="column"
      padding="16px"
      alignItems="center"
      borderRadius="lg"
      boxShadow={`0 0 16px 2px ${mainRed}, 0 2px 16px 0 ${accentRed}`}
      bg={"transparent"}
      backdropFilter="blur(6px)"
      border="2px solid"
      borderColor={accentRed}
      transition="box-shadow 0.2s, border-color 0.2s"
      _hover={{
        boxShadow: `0 0 0 3px ${mainRed}, 0 0 16px 2px ${accentRed}`,
        borderColor: mainRed,
      }}
    >
      <Avatar.Root
        size="xl"
        backgroundColor={color}
        boxShadow={`0 0 0 3px ${mainRed}, 0 2px 8px 0 ${accentRed}`}
        border={`2.5px solid ${mainRed}`}
        style={{
          filter: "drop-shadow(0 0 8px #ff0000)",
        }}
      >
        <Avatar.Fallback name="Player 1" />
      </Avatar.Root>
      <Text
        mt={2}
        fontWeight="extrabold"
        fontSize="lg"
        letterSpacing="wide"
        textShadow={`0 2px 8px ${mainRed}, 0 1px 2px rgba(0,0,0,0.25)`}
        color={mainRed}
        style={{
          textTransform: "uppercase",
        }}
      >
        Player 1
      </Text>
      <Box mt={3} width="100%">
        {Object.entries(stars).map(([starColor, star]) => (
          <Flex
            key={starColor}
            align="center"
            justify="flex-start"
            mb={1}
            px={2}
            py={1}
            borderRadius="md"
            bg="rgba(255,0,0,0.10)"
            border={`1.5px solid ${accentRed}`}
            _hover={{
              bg: "rgba(255,0,0,0.18)",
              borderColor: mainRed,
            }}
            transition="background 0.15s, border-color 0.15s"
            boxShadow={`0 0 4px 0 ${mainRed}`}
          >
            <FaStar
              size={18}
              color={new Color(starColor).getHexString()}
              style={{
                filter: `drop-shadow(0 0 4px ${mainRed}) drop-shadow(0 0 2px #fff)`,
                marginRight: "8px",
              }}
            />
            <Text
              fontSize="md"
              fontWeight="bold"
              letterSpacing="wider"
              color={mainRed}
              textShadow={`0 1px 4px ${accentRed}`}
            >
              {star.count}
            </Text>
          </Flex>
        ))}
        {Object.keys(stars).length === 0 && (
          <Text
            fontSize="sm"
            color={accentRed}
            textAlign="center"
            mt={2}
            textShadow={`0 1px 4px ${mainRed}`}
          >
            No stars yet
          </Text>
        )}
      </Box>
    </Flex>
  );
}
