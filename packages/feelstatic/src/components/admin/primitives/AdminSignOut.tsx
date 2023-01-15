'use client';

export const signOut = async () => {
  window.location.href = '/';
  await fetch(location.origin + '/feelstatic', {
    method: 'GET',
    headers: {
      Authorization: 'Basic abc',
    },
  });
};
