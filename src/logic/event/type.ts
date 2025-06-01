import type { SetupEventsCb } from './setup';
import { TurnEventsCB } from './turn';
import { UIHandlerEventsCB } from './ui-handler';

export type BusEventsCb = SetupEventsCb | UIHandlerEventsCB | TurnEventsCB;

export type BusEventType = Parameters<BusEventsCb>[0];
export type BusEventData<T> = Extract<Parameters<BusEventsCb>, [T, unknown]>[1];
