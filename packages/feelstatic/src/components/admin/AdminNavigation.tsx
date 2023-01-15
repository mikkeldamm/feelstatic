'use client';

import Link from 'next/link';
import { RiImageFill, RiLayout2Fill, RiPagesFill } from 'react-icons/ri';

export default function AdminNavigation() {
  return (
    <nav className="text-[15px]">
      <Link
        href="/feelstatic"
        className="flex items-center mb-2 cursor-pointer hover:bg-[#97f675] hover:text-[#09150f] hover:font-bold py-2 px-2"
      >
        <RiPagesFill className="w-5 h-5 mr-3" />
        Pages
      </Link>
      <Link
        href="/feelstatic/components"
        className="flex items-center mb-2 cursor-pointer hover:bg-[#97f675] hover:text-[#09150f] hover:font-bold py-2 px-2"
      >
        <RiLayout2Fill className="w-5 h-5 mr-3" />
        Components
      </Link>
      <Link
        href="/feelstatic/media"
        className="flex items-center mb-2 cursor-pointer hover:bg-[#97f675] hover:text-[#09150f] hover:font-bold py-2 px-2"
      >
        <RiImageFill className="w-5 h-5 mr-3" />
        Media
      </Link>
    </nav>
  );
}
