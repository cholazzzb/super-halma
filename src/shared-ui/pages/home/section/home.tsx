import { Box, Button, Center, Heading, Text, VStack } from "@chakra-ui/react";

type Props = {
  toSetupSection: () => void;
};

export function HomeSection(props: Props) {
  return (
    <Center height="100vh" bgColor="#80b0ff">
      <VStack
        align="center"
        justify="center"
        padding={8}
        borderRadius="lg"
        boxShadow="xl"
        bg="whiteAlpha.900"
      >
        <Heading
          as="h1"
          size="2xl"
          fontWeight="bold"
          textAlign="center"
          color="gray.800"
        >
          Super Halma
        </Heading>
        <Text fontSize="xl" textAlign="center" maxW="md" color="gray.700">
          A strategic board game of leaps and bounds! Outmaneuver your opponents
          and be the first to collect the stars.
        </Text>
        <Button
          backgroundColor="red.300"
          size="lg"
          onClick={props.toSetupSection}
        >
          Play Now!
        </Button>
        <Box mt={4}>
          <Text fontSize="sm" color="gray.500">
            © 2025 Toro Corp. All rights reserved.
          </Text>
        </Box>
      </VStack>
    </Center>
  );
}
