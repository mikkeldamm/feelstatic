import { Octokit } from '@octokit/rest';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FeelstaticGroup } from '../../state/group';
import { FeelstaticPage } from '../../state/page';
import { readDirectory, readJsonFile } from '../../utils/fs';

const octokit = new Octokit({
  auth: process.env.FST_GITHUB_ACCESS_TOKEN,
});

const FIELDS_SUFFIX = process.env.FST_FIELDS_SUFFIX ? `.${process.env.FST_FIELDS_SUFFIX}` : '';
const EXCLUDED_PATHS = process.env.FST_EXCLUDED_PATHS?.split(',') || ['/node_modules', '/public', '/.next', '/styles'];

const getPages = async (rootPath: string, paths: string[]) => {
  const pages: FeelstaticPage[] = [];

  for await (const filePath of readDirectory(paths)) {
    if (EXCLUDED_PATHS.some((path) => filePath.includes(path))) {
      continue;
    }

    const pagePath = filePath.replace(rootPath, '') || '/';
    const isPagesFolder = pagePath.startsWith('/pages');
    const isAppFolder = pagePath.startsWith('/app');
    if (!isPagesFolder && !isAppFolder) {
      continue;
    }

    if (isAppFolder && !filePath.endsWith(`page${FIELDS_SUFFIX}.json`)) {
      continue;
    }

    if (!filePath.endsWith(`${FIELDS_SUFFIX}.json`)) {
      continue;
    }

    const componentPaths = pagePath.split('/').slice(1);
    const groups = await readJsonFile<FeelstaticGroup>(filePath);

    let parents = componentPaths.slice(1, -1);
    let name = componentPaths[componentPaths.length - 1].replace('.json', '');
    if (name === `index${FIELDS_SUFFIX}` || name === `page${FIELDS_SUFFIX}`) {
      // if the page use an "index" or "page" name, then use the parent folder name
      name = parents[parents.length - 1] || '';
      parents = parents.slice(0, -1);
    }

    pages.push({
      name: name.replaceAll('-', ' ').replace(FIELDS_SUFFIX, ''),
      parents: parents.map((parent) => parent.replaceAll('-', ' ')),
      url: '/' + [...parents, name === '' ? '' : name].join('/'),
      path: pagePath,
      lastModified: new Date(0),
      groups: groups,
    });
  }

  return await Promise.all(
    pages.map(async (page) => {
      const fileCommits = await octokit.request(
        `GET /repos/{owner}/{repo}/commits?path=${
          page.path.startsWith('/') ? page.path.substring(1) : page.path
        }&page=1&per_page=1`,
        {
          owner: process.env.FST_GITHUB_OWNER,
          repo: process.env.FST_GITHUB_REPO,
        }
      );

      return {
        ...page,
        lastModified: new Date(fileCommits?.data[0]?.commit?.committer?.date || 0),
      };
    })
  );
};

export default async function handler(rootPath: string, paths: string[], _: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(await getPages(rootPath, paths));
}
