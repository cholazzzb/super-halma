import { Mesh } from 'three';

export interface Interactionable extends Mesh {
  /**
   *
   * @param on
   * @description should implement the color change when hover and unhover
   */
  highlight(on: boolean): void;

  /**
   *
   * @param on
   * @description should implement the color change when active or unactive
   */
  active(on: boolean): void;

  /**
   *
   * @param on
   * @description should implement the color change when targeted or untargeted
   */
  targeted(on: boolean): void;
}
