'use client';

import { RiFileUploadFill } from 'react-icons/ri';

export default function AdminMedia() {
  return (
    <>
      <div></div>
      <div className="min-w-[450px] pb-20 overflow-y-auto">
        <div className="sticky top-0 z-40 flex items-center px-10 py-8 before:bg-white before:inset-0 before:absolute before:z-30 before:opacity-75 after:absolute after:z-30 after:inset-0 after:backdrop-blur-sm">
          <h2 className="z-40 text-2xl font-bold truncate" style={{ direction: 'rtl' }}>
            Media library
          </h2>
          <div className="z-40 pl-10 ml-auto shrink-0">
            <div className="flex items-center px-3 py-1 font-medium text-gray-500 bg-gray-300 border border-gray-300 cursor-pointer cursor-not-allowed">
              Upload file
              <RiFileUploadFill className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-lg text-gray-400">This feature is coming soon!</div>
      </div>
    </>
  );
}
