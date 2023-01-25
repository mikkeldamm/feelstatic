import { NextApiRequest, NextApiResponse } from 'next';
import auth from './auth';
import commit from './commit';
import components from './components';
import images from './images';
import pages from './pages';
import status from './status';

type QueryPage = { fst: ('auth' | 'commit' | 'pages' | 'components' | 'images' | 'status')[] };
const queryPages = {
  auth,
  commit,
  pages,
  components,
  images,
  status,
};

type FeelstaticApiConfig = {
  paths: {
    root: string;
    pages: string[];
    components: string[];
    images: string;
  };
};

export const FeelstaticApi =
  ({ paths: { root, pages: pagesPaths, components: componentsPaths, images: imagePath } }: FeelstaticApiConfig) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { fst } = req.query as QueryPage;
    if (!fst || !fst[0] || !queryPages[fst[0]]) {
      return res.status(200).send('Feelstatic API');
    }

    if (fst[0] === 'pages') {
      return queryPages[fst[0]](root, pagesPaths, req, res);
    }

    if (fst[0] === 'components') {
      return queryPages[fst[0]](root, componentsPaths, req, res);
    }

    if (fst[0] === 'images') {
      return queryPages[fst[0]](imagePath, req, res);
    }

    return queryPages[fst[0]](req, res);
  };
