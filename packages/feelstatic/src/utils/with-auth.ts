import { NextApiRequest, NextApiResponse } from 'next';

type NextApiRequestWithUser = NextApiRequest & {
  feelstaticUser: { id: string };
};

export type NextApiHandlerWithUser<T = any> = (
  req: NextApiRequestWithUser,
  res: NextApiResponse<T>
) => unknown | Promise<unknown>;

export const withAuth =
  (apiRoute: NextApiHandlerWithUser) => async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    if (!req.feelstaticUser) {
      res.status(401).end();
      return;
    }

    return await apiRoute(req, res);
  };
