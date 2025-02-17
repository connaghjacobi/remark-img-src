# remark-img-src

[**Remark**](https://github.com/remarkjs/remark) plugin to allow dynamic reconfiguration of image links.

## Installation
```bash
  npm install remark-img-src
```

## Usage

### Simple Example
Heres a simple example that should replace `http` links with `https` links.

```js
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkImgSrc from 'remark-img-src';
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
async function toHttps(url){
  return url.replace('http://','https://');
}
const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify)
  .use(remarkImgSrc, {
    func: async(url) => {
      if (!url.startsWith('http://')) {
        const updated_url = await toHttps(url);
        return updated_url;
      }
      return url;
    }
  })
  .process('![duckduckgo!](http://duckduckgo.com/?t=ddg_windows&atb=v455-1&atb=v455-1)')
  .then(({ output }) => {
    console.log(String(output))
  });

```

## Options
- `func`: An async function that recives and returns a new URL. Gets called for every image in the document. 