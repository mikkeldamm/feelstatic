import { Octokit } from '@octokit/rest';
import type { NextApiRequest, NextApiResponse } from 'next';

const octokit = new Octokit({
  auth: process.env.FST_GITHUB_ACCESS_TOKEN,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const gitSha = req.query.gitsha as string;
  if (!gitSha) {
    return res.status(400).send({
      message: 'Missing gitSha query',
    });
  }

  const commitStatus = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}/status{?per_page,page}', {
    owner: process.env.FST_GITHUB_OWNER,
    repo: process.env.FST_GITHUB_REPO,
    ref: gitSha,
  });

  const commitStatuses = commitStatus.data.statuses;
  if (!commitStatuses || !commitStatuses[0]) {
    return res.status(500).send({
      message: 'No statuses found',
    });
  }

  const firstCommitStatus = commitStatuses[0];
  const isVercelDeployment = firstCommitStatus.context?.toLowerCase() === 'vercel';
  if (!isVercelDeployment) {
    return res.status(500).send({
      message: 'No Vercel deployment found',
    });
  }

  const vercelStatus = firstCommitStatus.state?.toLowerCase();
  res.status(200).send({ status: vercelStatus });
}
