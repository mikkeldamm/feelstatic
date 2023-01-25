import { FeelstaticApi } from 'feelstatic/api';
import { join } from 'path';

export default FeelstaticApi({
  paths: {
    root: process.cwd(),
    pages: [join(process.cwd(), '/app'), join(process.cwd(), '/pages')],
    components: [
      join(process.cwd(), '/app'),
      join(process.cwd(), '/pages'),
      join(process.cwd(), '/components'),
      join(process.cwd(), '/views'),
    ],
    images: join(process.cwd(), '/public/images'),
  },
});
