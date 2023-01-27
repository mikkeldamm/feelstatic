'use client';

export const signOut = async () => {
  fetch(`/api/feelstatic/pages`, {
    method: 'GET',
    headers: {
      Authorization: 'Basic imsigningout',
    },
  });
  window.location.href = '/';
};
