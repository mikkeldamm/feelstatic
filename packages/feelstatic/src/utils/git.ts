import { Octokit } from '@octokit/rest';
import OctokitPlugin from 'octokit-commit-multiple-files';
const OctokitModule = Octokit.plugin(OctokitPlugin);

type File = {
  path: string;
  content: string;
};

type Auth = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  lookup: string;
};

export const createOrUpdateFiles = async (files: File[], message: string) => {
  const auth = await fetch('/api/feelstatic/commit').then((res) => res.json() as unknown as Auth);
  const octokit = new OctokitModule({
    auth: auth.token,
  });

  const { commits } = await octokit.rest.repos.createOrUpdateFiles({
    owner: auth.owner,
    repo: auth.repo,
    branch: auth.branch,
    changes: [
      {
        message,
        files: files.reduce((acc, file) => {
          acc[file.path.startsWith('/') ? file.path.substring(1) : file.path] = file.content;
          return acc;
        }, <{ [key: string]: string }>{}),
      },
    ],
  });

  return commits[commits.length - 1].sha;
};
