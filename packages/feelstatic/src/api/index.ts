import { NextApiRequest, NextApiResponse } from 'next';
import auth from './auth';
import commit from './commit';
import components from './components';
import images from './images';
import pages from './pages';
import status from './status';

type QueryPage = { fst: ['auth', 'commit', 'pages', 'components', 'images', 'status'] };
const queryPages = {
  auth,
  commit,
  pages,
  components,
  images,
  status,
};

export const FeelstaticApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fst } = req.query as QueryPage;
  if (!fst || !fst[0] || !queryPages[fst[0]]) {
    return res.status(200).send('Feelstatic API');
  }

  return queryPages[fst[0]](req, res);
};
