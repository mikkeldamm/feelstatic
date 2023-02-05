import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send({
    token: process.env.FST_GITHUB_ACCESS_TOKEN,
    owner: process.env.FST_GITHUB_OWNER,
    repo: process.env.FST_GITHUB_REPO,
    branch: process.env.FST_GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || 'main',
  });
}
