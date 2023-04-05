const FeelstaticFieldValue = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

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
