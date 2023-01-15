'use client';

import { RiLogoutBoxFill } from 'react-icons/ri';
import { signOut } from './primitives/AdminSignOut';
import { PublishButton } from './views/AdminPublish';

type Props = {
  onSignOut?: () => void;
};

export default function AdminFooter({ onSignOut }: Props) {
  const callSignOut = () => {
    if (onSignOut) {
      onSignOut();
      return;
    }

    signOut();
  };

  return (
    <div>
      <PublishButton />
      <div
        onClick={callSignOut}
        className="flex items-center cursor-pointer hover:bg-[#97f675] hover:text-[#09150f] hover:font-bold py-2 px-2"
      >
        <RiLogoutBoxFill className="w-5 h-5 mr-3" />
        Log out
      </div>
    </div>
  );
}
