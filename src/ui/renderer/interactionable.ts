import { Object3D } from "three";

export interface Interactionable extends Object3D {
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
