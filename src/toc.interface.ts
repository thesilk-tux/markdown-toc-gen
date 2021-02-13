/**
 * interface to handle heading information
 */
export interface IHeading {
  /** stores the heading level which is needed for the indentation */
  level: number;
  /** heading caption */
  caption: string;
  /** stores the amount of duplicated captions */
  counter: number;
}
