import { existsSync } from 'fs';
import { readdir } from 'fs/promises';
import type { NextApiRequest, NextApiResponse } from 'next';
import { extname, join } from 'path';
import { FeelstaticImage } from '../../state/image';

const VALID_IMAGE_EXTENSIONS = ['jpg', 'png', 'jpeg', 'gif', 'svg'];

const getImages = async (path: string): Promise<FeelstaticImage[]> => {
  if (!existsSync(path)) {
    return [];
  }

  const paths = await readdir(path);
  const mapped = paths
    .map((path) => {
      const name = path;
      const extension = extname(path).replace('.', '').toLowerCase();
      const src = `/images/${path}`;
      return {
        name,
        extension,
        src,
        path: join('/public/images', path),
      };
    })
    .filter(({ extension }) => VALID_IMAGE_EXTENSIONS.includes(extension));

  return mapped;
};

export default async function handler(path: string, _: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(await getImages(path));
}
