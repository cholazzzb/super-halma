import { Button } from '@chakra-ui/react';

import { player1, player2, positions } from '@/data/setup-2-players';
import { useEventEmitter } from '@/shared-logic/hook/event-emitter';

type Props = {
  toPlaySection: () => void;
};
export function Setup(props: Props) {
  const eventEmitter = useEventEmitter();

  const onClick = () => {
    eventEmitter('setup:2-players', {
      player1,
      player2,
      positions,
    });
    props.toPlaySection();
  };

  return <Button onClick={onClick}>Play!</Button>;
}
