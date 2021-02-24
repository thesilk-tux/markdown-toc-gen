/**
 * interface to handle heading information
 */
export interface IHeading {
  /** stores the heading level which is needed for the indentation */
  level: number;
  /** heading caption */
  heading: string;
  /** stores the amount of duplicated captions */
  counter: number;
}

/**
 * interface which has validation properties for parsed tocs
 */
export interface IHeadingValidation extends IHeading {
  /** checks if generated toc link is valid */
  validLink: boolean;
  /** checks if generated toc entry level is valid */
  validLevel: boolean;
  /** checks if generated toc entry caption is valid */
  validCaption?: boolean;
}

/**
 * interface which includes validation information
 */
export interface IValidation {
  /** parsed toc validation */
  existingHeadingsValidation: IHeadingValidation[];
  /** toc entries which are missing in current toc */
  missingHeadingToc: string[];
}
