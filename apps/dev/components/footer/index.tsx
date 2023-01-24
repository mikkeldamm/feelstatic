import FeelstaticField from 'feelstatic/field';

import footer from './index.json';

const CopyrightYear = ({}: { children?: React.ReactNode }) => {
  return (
    <span
      style={{
        color: 'red',
      }}
    >
      {new Date().getFullYear()}
    </span>
  );
};

export default function Footer() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
      }}
    >
      <FeelstaticField field={footer.copyright.text} values={[CopyrightYear]} />
    </div>
  );
}
