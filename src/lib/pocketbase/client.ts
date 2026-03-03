import PocketBase from 'pocketbase';

const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://daharengineer.pockethost.io';

export const pb = new PocketBase(POCKETBASE_URL);

// Enable auto cancellation
pb.autoCancellation(false);

// Auth store helpers
export const authStore = pb.authStore;

// Collection helpers
export const collections = {
  users: pb.collection('users'),
  services: pb.collection('services'),
  software: pb.collection('software'),
  courses: pb.collection('courses'),
  portfolio: pb.collection('portfolio'),
  articles: pb.collection('articles'),
};

// File URL helper
export const getFileUrl = (
  collection: string,
  recordId: string,
  filename: string,
  options?: { thumb?: string; download?: boolean }
) => {
  let url = pb.files.getURL({ collectionId: collection, id: recordId }, filename, { thumb: options?.thumb });
  if (options?.download) {
    url += (url.includes('?') ? '&' : '?') + 'download=1';
  }
  return url;
};
