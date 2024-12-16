import remarkImgSrc from "../src";
import { remark } from 'remark';

async function run(input, options) {
  const processor = remark().use(remarkImgSrc, options);
  const { value } = await processor.process(input);
  return value;
}

describe('remark-link-rewrite', () => {
  test('Should return same value if no function provided', async () => {
    const input = '![image](logo192.png)';
    const output = await run(input);
    expect(output).toMatch(input);
  });

  test('Should replace URL', async () => {
    const input = '![image](http://link.com/image)';
    const output = await run(input, 
      {
        func: (url) => {
          if(url.startsWith('http://')){
            return url.replace('http', 'https');
          }
          return url;
        }
      }
    )
    expect(output).toMatch('![image](https://link.com/image)')
  });
});