import { Position } from '../domain/position';

export type UIHandlerOnActiveData = {
  position: Position | null;
};
export type UIHandlerEventsCB = (
  event: 'ui-handler:on-active',
  data: UIHandlerOnActiveData,
) => void;
