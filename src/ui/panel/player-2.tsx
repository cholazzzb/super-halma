import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
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
  const color = `#${new Color(players[player2Id].color).getHexString()}`;

  const stars = starCount[player2Id] ?? {};

  const mainBlue = "#0000ff";
  const accentBlue = "#3344dd";
  const lightBg = "rgba(255, 255, 255, 0.92)";

  return (
    <Flex
      position="fixed"
      top="12px"
      right="18px"
      zIndex={999}
      color="white"
      width="125px"
      height="300px"
      direction="column"
      padding="16px"
      alignItems="center"
      borderRadius="lg"
      boxShadow={`0 0 16px 2px ${mainBlue}, 0 2px 16px 0 ${accentBlue}`}
      bg={lightBg}
      backdropFilter="blur(6px)"
      border="2px solid"
      borderColor={accentBlue}
      transition="box-shadow 0.2s, border-color 0.2s"
      _hover={{
        boxShadow: `0 0 0 3px ${mainBlue}, 0 0 16px 2px ${accentBlue}`,
        borderColor: mainBlue,
      }}
    >
      <Avatar.Root
        size="xl"
        backgroundColor={color}
        boxShadow={`0 0 0 3px ${mainBlue}, 0 2px 8px 0 ${accentBlue}`}
        border={`2.5px solid ${mainBlue}`}
        style={{
          filter: "drop-shadow(0 0 8px #0000ff)",
        }}
      >
        <Avatar.Fallback name="Player 1" />
      </Avatar.Root>
      <Text
        mt={2}
        fontWeight="extrabold"
        fontSize="lg"
        letterSpacing="wide"
        textShadow={`0 2px 8px ${mainBlue}, 0 1px 2px rgba(0,0,0,0.25)`}
        color={mainBlue}
        style={{
          textTransform: "uppercase",
        }}
      >
        Player 2
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
            bg="rgba(0,0,255,0.10)"
            border={`1.5px solid ${accentBlue}`}
            _hover={{
              bg: "rgba(0,0,255,0.18)",
              borderColor: mainBlue,
            }}
            transition="background 0.15s, border-color 0.15s"
            boxShadow={`0 0 4px 0 ${mainBlue}`}
          >
            <FaStar
              size={18}
              color={new Color(starColor).getHexString()}
              style={{
                filter: `drop-shadow(0 0 4px ${mainBlue}) drop-shadow(0 0 2px #fff)`,
                marginRight: "8px",
              }}
            />
            <Text
              fontSize="md"
              fontWeight="bold"
              letterSpacing="wider"
              color={mainBlue}
              textShadow={`0 1px 4px ${accentBlue}`}
            >
              {star.count}
            </Text>
          </Flex>
        ))}
        {Object.keys(stars).length === 0 && (
          <Text
            fontSize="sm"
            color={accentBlue}
            textAlign="center"
            mt={2}
            textShadow={`0 1px 4px ${mainBlue}`}
          >
            No stars yet
          </Text>
        )}
      </Box>
    </Flex>
  );
}
