import type {
  FeelstaticField as FeelstaticFieldType,
  FeelstaticFieldValue as FeelstaticFieldValueType,
  FeelstaticReference,
  FeelstaticRepeater,
} from '../state/field';
import type { FeelstaticGroup } from '../state/group';

const FeelstaticFieldValue = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export function getReferencedField<T>(data: FeelstaticGroup, field: FeelstaticReference): T | undefined {
  const referencedField = field.reference.split('.').reduce((acc, curr) => {
    return (acc as FeelstaticGroup | FeelstaticFieldType)[curr];
  }, (data || {}) as FeelstaticGroup | FeelstaticFieldType | FeelstaticFieldValueType) as FeelstaticRepeater;

  return referencedField.find((item) => item[field.field] === field.value) as T | undefined;
}

export default function FeelstaticField(props: any): JSX.Element {
  const field = props.field as string;
  const values = props.values || [];
  const matches = Array.from(field?.matchAll(/{{(.+?)}}/gi));
  const components = matches.reduce((mappedComponents, match, index) => {
    const valueComponent = values[index] as React.ComponentClass<any>;
    mappedComponents[match[0]] = valueComponent;
    return mappedComponents;
  }, {} as { [key: string]: React.ComponentClass<any> });

  return (
    <>
      {field?.split(/({{.+?}})|\n/g).map((value, valueIndex) => {
        if (typeof value === 'undefined') {
          return <br key={valueIndex} />;
        }

        const ValueComponent = components[value];
        return ValueComponent ? (
          <ValueComponent key={valueIndex}>{value.replace('{{', '').replace('}}', '')}</ValueComponent>
        ) : (
          <FeelstaticFieldValue key={valueIndex}>{value}</FeelstaticFieldValue>
        );
      })}
    </>
  );
}
