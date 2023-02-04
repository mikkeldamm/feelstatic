export type FeelstaticRepeater = {
  [key: FeelstaticFieldName]: FeelstaticFieldValue;
}[];

export type FeelstaticReference = {
  value: string;
  reference: string;
  field: string;
  label?: string;
};

export type FeelstaticFieldName = string;
export type FeelstaticFieldValue = string | number | boolean | FeelstaticRepeater | FeelstaticReference;
export type FeelstaticField = {
  [key: FeelstaticFieldName]: FeelstaticFieldValue;
};
