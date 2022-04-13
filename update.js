/* eslint-disable
  no-magic-numbers,
*/

const axios                  = require(`axios`);
const { parseStringPromise } = require(`xml2js`);
const path                   = require(`path`);

const {
  readFile,
  writeFile,
} = require(`fs`).promises;

const dlxFeedURL     = `https://medium.com/feed/digital-linguistics`;
const dlxPlaceholder = `<!-- dlx-posts -->`;

const readmePath         = path.join(__dirname, `./README.md`);
const readmeTemplatePath = path.join(__dirname, `./README-template.md`);

function convertPosts(posts) {
  return posts
  .map(({ title: [title], link: [url] }) => ({ title, url }))
    .reduce((text, { title, url }) => `${text}\n- [${title}](${url})`, ``);
}

async function updateReadme() {


  const dlxResponse = await axios.get(dlxFeedURL);
  const dlxFeed     = await parseStringPromise(dlxResponse.data);
  const dlxEntries  = dlxFeed.rss.channel[0].item.slice(0, 4);
  const dlxPosts    = convertPosts(dlxEntries);

  let readme = await readFile(readmeTemplatePath, `utf8`);

  readme = readme.replace(dlxPlaceholder, dlxPosts);

  await writeFile(readmePath, readme, `utf8`);

}

updateReadme()
.catch(console.error);
