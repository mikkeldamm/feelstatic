'use client';

import { atom, useAtom, useSetAtom } from 'jotai';
import { encode } from 'js-base64';
import Link from 'next/link';
import { MouseEvent, useEffect, useState } from 'react';
import { RiSendPlaneFill } from 'react-icons/ri';
import { changesAtom } from '../../../state/admin/atoms';
import { createOrUpdateFiles } from '../../../utils/git';

type Status = {
  status: 'ready' | 'pending' | 'success' | 'error';
};

const commitShaAtom = atom<string | null>('234234');

let interval: NodeJS.Timeout;
let intervalCount = 0;

const PublishStatus = () => {
  const [changes] = useAtom(changesAtom);
  const hasChanges = changes.pages.length > 0;
  const [status, setStatus] = useState<'ready' | 'pending' | 'success' | 'error'>('ready');
  const [commitSha] = useAtom(commitShaAtom);

  useEffect(() => {
    if (!commitSha) {
      return;
    }

    interval = setInterval(async () => {
      await fetch(`/api/feelstatic/status?gitsha=${commitSha}`)
        .then((res) => res.json())
        .then((data: Status) => {
          setStatus(data.status);

          if (data.status === 'success') {
            clearInterval(interval);
          }
        })
        .catch(() => {
          setStatus('pending');
        });
      intervalCount++;

      if (intervalCount >= 90) {
        clearInterval(interval);
        setStatus('error');
        intervalCount = 0;
      }
    }, 2000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [commitSha]);

  if (!commitSha && !hasChanges) {
    return <div className="flex items-center justify-center text-lg text-gray-400">...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-lg">
      <h2 className="z-40 text-2xl font-bold">Publish status</h2>
      <div className="mt-1 capitalize">{status}</div>
      <div className="mt-4 text-sm text-gray-400">
        Publishing can take from 10 sec to 3 min - dependent on your setup
      </div>
    </div>
  );
};

export const PublishButton = () => {
  const [changes] = useAtom(changesAtom);
  const hasChanges = changes.pages.length > 0 || changes.components.length > 0 || changes.images.length > 0;
  const countOfChanges = changes.pages.length + changes.components.length + changes.images.length;
  const setCommitSha = useSetAtom(commitShaAtom);
  const [{ pages, components, images }] = useAtom(changesAtom);

  const publishChanges = async (event: MouseEvent) => {
    if (confirm('Are you sure you want to publish these changes?')) {
      const commitMessage = 'Feelstatic changes'; // TODO: Make user input what changes have been made

      const pageFiles = pages.map((page) => {
        return {
          path: page.path,
          content: encode(JSON.stringify(page.groups, null, 2)),
        };
      });

      const componentFiles = components.map((component) => {
        return {
          path: component.path,
          content: encode(JSON.stringify(component.groups, null, 2)),
        };
      });

      const imageFiles = images.map((image) => {
        return {
          path: image.path,
          content: image.contents as string,
        };
      });

      const commitSha = await createOrUpdateFiles([...pageFiles, ...componentFiles, ...imageFiles], commitMessage);
      setCommitSha(commitSha);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  if (!hasChanges) {
    return <></>;
  }

  return (
    <Link
      onClick={publishChanges}
      href="/feelstatic/publish"
      className="mt-10 flex items-center flex-wrap mb-2 cursor-pointer hover:bg-[#97f675] hover:text-[#09150f] py-2 px-2"
    >
      <RiSendPlaneFill className="w-5 h-5 mr-3" />
      <div>
        Publish
        <div className="text-[10px] opacity-60">
          {countOfChanges} change{countOfChanges > 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  );
};

export default function AdminPublish() {
  return (
    <>
      <div></div>
      <div className="min-w-[450px] min-h-screen overflow-y-auto">
        <PublishStatus />
      </div>
    </>
  );
}
