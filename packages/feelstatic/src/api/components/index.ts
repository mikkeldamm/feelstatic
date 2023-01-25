import { Octokit } from '@octokit/rest';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FeelstaticComponent } from '../../state/component';
import type { FeelstaticGroup } from '../../state/group';
import { readDirectory, readJsonFile } from '../../utils/fs';

const octokit = new Octokit({
  auth: process.env.FST_GITHUB_ACCESS_TOKEN,
});

const FIELDS_SUFFIX = process.env.FST_FIELDS_SUFFIX ? `.${process.env.FST_FIELDS_SUFFIX}` : '';
const EXCLUDED_PATHS = process.env.FST_EXCLUDED_PATHS?.split(',') || ['/node_modules', '/public', '/.next', '/styles'];

const getComponents = async (rootPath: string, paths: string[]) => {
  const components: FeelstaticComponent[] = [];

  for await (const filePath of readDirectory(paths)) {
    if (EXCLUDED_PATHS.some((path) => filePath.includes(path))) {
      continue;
    }

    if (filePath.endsWith(`page${FIELDS_SUFFIX}.json`)) {
      continue;
    }

    if (!filePath.endsWith(`${FIELDS_SUFFIX}.json`)) {
      continue;
    }

    const componentPath = filePath.replace(rootPath, '') || '/';
    const componentPaths = componentPath.split('/');
    if (componentPaths.length <= 2) {
      continue;
    }

    const groups = await readJsonFile<FeelstaticGroup>(filePath);

    let parents = componentPaths.slice(1, -1);
    let name = componentPaths[componentPaths.length - 1].replace('.json', '');
    if (name === `index${FIELDS_SUFFIX}`) {
      // if the component use an "index" name, then use the parent folder name
      name = parents[parents.length - 1];
      parents = parents.slice(0, -1);
    }

    components.push({
      name: name.replaceAll('-', ' ').replace(FIELDS_SUFFIX, ''),
      parents: parents.map((parent) => parent.replaceAll('-', ' ')),
      url: '/' + name.replace(FIELDS_SUFFIX, '').toLowerCase(),
      path: componentPath,
      lastModified: new Date(0),
      groups: groups,
    });
  }

  return await Promise.all(
    components.map(async (component) => {
      const fileCommits = await octokit.request(
        `GET /repos/{owner}/{repo}/commits?path=${
          component.path.startsWith('/') ? component.path.substring(1) : component.path
        }&page=1&per_page=1`,
        {
          owner: process.env.FST_GITHUB_OWNER,
          repo: process.env.FST_GITHUB_REPO,
        }
      );

      return {
        ...component,
        lastModified: new Date(fileCommits?.data[0]?.commit?.committer?.date || 0),
      };
    })
  );
};

export default async function handler(rootPath: string, paths: string[], _: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(await getComponents(rootPath, paths));
}
