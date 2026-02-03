import { put, del } from '@vercel/blob';

export async function uploadFile(file: File): Promise<{ url: string; type: 'image' | 'video' }> {
  // Mock upload for build time or when blob token is not available
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
    };
  }

  const blob = await put(file.name, file, {
    access: 'public',
  });

  const type: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';
  
  return {
    url: blob.url,
    type,
  };
}

export async function deleteFile(url: string): Promise<void> {
  await del(url);
}

export async function uploadMultipleFiles(files: File[]): Promise<{ urls: string[]; types: ('image' | 'video')[] }> {
  const results = await Promise.all(
    files.map(file => uploadFile(file))
  );

  return {
    urls: results.map(r => r.url),
    types: results.map(r => r.type),
  };
}
