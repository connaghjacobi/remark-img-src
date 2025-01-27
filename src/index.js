import { visit } from "unist-util-visit";

/**
 * Default function.
 * @param url
 */
const defaultFunc = async (url) => { return url; };

/**
 * Rewrite a jsx or html strings url.
 * 
 * @param {*} value value for replacing
 * @param {*} func function to call to do the replacing
 */
async function rewrite(value, func)
{
  const regex = /src="(.*)"/g;
  const promises = [];
  value.replace(regex, (match, ...args) => {
    const promise = func(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return value.replace(regex, () => data.shift());
}

/**
 * Rewrite the URL of an image dynamically
 * @param {*} options 
 */
function remarkImgSrc(options = { func: defaultFunc })
{
  const { func } = options;
  return async tree => {
    const nodes = [];

    visit(tree, node => {
      if (node.type === 'image') {
        nodes.push(node);
      } else if (node.type === 'jsx' || node.type === 'html') {
        if (/<img.*>/.test(node.value)) {
          nodes.push(node);
        }
      }
    });

    await Promise.all(nodes.map(async node => {
      if (node.type === 'image') {
        node.url = await func(node.url);
      } else if (node.type === 'jsx' || node.type === 'html') {
        node.value = await rewrite(node.value, func);
      }
    }));

    return tree;
  };
}

export default remarkImgSrc;