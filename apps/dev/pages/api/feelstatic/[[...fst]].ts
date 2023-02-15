import { FeelstaticApi } from 'feelstatic/api';
import { join } from 'path';

const ROOT_PATH = process.cwd();

export default FeelstaticApi({
  paths: {
    root: ROOT_PATH,
    pages: [join(ROOT_PATH, '/app'), join(ROOT_PATH, '/pages')],
    components: [
      join(ROOT_PATH, '/app'),
      join(ROOT_PATH, '/pages'),
      join(ROOT_PATH, '/components'),
      join(ROOT_PATH, '/views'),
    ],
    images: join(ROOT_PATH, '/public/images'),
  },
});
