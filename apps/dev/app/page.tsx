import { Inter } from '@next/font/google';
import Image from 'next/image';
import styles from './page.module.css';

import Footer from '@/components/footer';
import page from './page.json';

import { getReferencedField } from 'feelstatic/field';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          {page.hero.headline}
          <code className={styles.code}>app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image src="/vercel.svg" alt="Vercel Logo" className={styles.vercelLogo} width={100} height={24} priority />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image className={styles.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
        <div className={styles.thirteen}>
          <Image src="/thirteen.svg" alt="13" width={40} height={31} priority />
        </div>
      </div>

      <div className={styles.grid}>
        <a
          href="https://beta.nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Docs <span>-&gt;</span>
          </h2>
          <p className={inter.className}>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Templates <span>-&gt;</span>
          </h2>
          <p className={inter.className}>Explore the Next.js 13 playground.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Deploy <span>-&gt;</span>
          </h2>
          <p className={inter.className}>Instantly deploy your Next.js site to a shareable URL with Vercel.</p>
        </a>
      </div>
      <div>
        <h2>{page.contact.headline}</h2>
        <small>Locations</small>
        <div>
          {page.contact.locations.map((location) => {
            const country = getReferencedField<(typeof page)['common']['countries'][0]>(page, location.country);
            return (
              <div key={location.city}>
                <h3>{location.city}</h3>
                <p>{country?.name}</p>
                <p>
                  {country?.phone_ext} {location.phone}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
