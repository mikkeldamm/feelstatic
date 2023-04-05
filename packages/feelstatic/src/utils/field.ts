import type {
  FeelstaticField as FeelstaticFieldType,
  FeelstaticFieldValue as FeelstaticFieldValueType,
  FeelstaticReference,
  FeelstaticRepeater,
} from '../state/field';
import { FeelstaticGroup } from '../state/group';

export function getReferencedField<T>(data: FeelstaticGroup, field: FeelstaticReference): T | undefined {
  const referencedField = field.reference.split('.').reduce((acc, curr) => {
    return (acc as FeelstaticGroup | FeelstaticFieldType)[curr];
  }, (data || {}) as FeelstaticGroup | FeelstaticFieldType | FeelstaticFieldValueType) as FeelstaticRepeater;

  return referencedField.find((item) => item[field.field] === field.value) as T | undefined;
}
