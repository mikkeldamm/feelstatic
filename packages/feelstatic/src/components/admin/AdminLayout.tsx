'use client';

import { useEffect } from 'react';
import AdminFooter from './AdminFooter';
import AdminLogo from './AdminLogo';
import AdminNavigation from './AdminNavigation';
import { ImageSelect } from './primitives/AdminViewImageField';

type Props = {
  children?: React.ReactNode;
  onSignOut?: () => void;
};

export default function AdminLayout({ children, onSignOut }: Props) {
  useEffect(() => {
    if (!document) {
      return;
    }

    const body = document.querySelector('body');
    if (!body) {
      return;
    }

    body.style.overflow = 'hidden';
  }, []);

  return (
    <div
      style={{
        fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif',
        zIndex: 5100,
      }}
      className="fixed inset-0 grid grid-cols-[250px,auto,1fr] h-screen text-[#09150f] bg-white"
    >
      <div className="bg-[#09150f] h-screen grid grid-rows-[auto,1fr,auto] pt-8 pb-6 px-4 text-white">
        <AdminLogo />
        <AdminNavigation />
        <AdminFooter onSignOut={onSignOut} />
      </div>
      {children}
      <ImageSelect />
    </div>
  );
}
