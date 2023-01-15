export type FeelstaticRepeater = {
  [key: FeelstaticFieldName]: string | number | boolean;
}[];

export type FeelstaticFieldName = string;
export type FeelstaticFieldValue = string | number | boolean | FeelstaticRepeater;
export type FeelstaticField = {
  [key: FeelstaticFieldName]: FeelstaticFieldValue;
};
