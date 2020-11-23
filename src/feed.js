require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const { Parser } = require('json2csv');
const TurndownService = require('turndown');
const turndownService = new TurndownService();

let start = 0;
let limit = 25;

// fetch call to the Zotero API
const getCitations = async (url = '') => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Zotero-API-Version': 3,
      'Zotero-API-Key': process.env.ZOTERO_API_KEY,
    },
  });
  return response.json();
};

// format from JSON to CSV
const formatCitations = (citations) => {
  const fields = [
    'key',
    'title',
    'creators',
    'date',
    'tags',
    'citation',
    'citationAuthor',
    'bib',
  ]; // headers for csv
  const opts = { fields };
  const parser = new Parser(opts);

  const csv = parser.parse(citations);
  // write csv file
  fs.writeFile('citations.csv', csv, (error) => {
    if (error) throw error;
    console.log('A CSV file of all citations has been saved to citations.csv.');
  });
};

const getAll = async () => {
  console.log('Starting...');

  let citations;

  while (limit > 0) {
    // url from which to pull data from Zotero
    let urlNote = `https://api.zotero.org/groups/${process.env.ZOTERO_GROUP_ID}/items/top?format=json&include=data,bib,citation&style=chicago-note-bibliography&start=${start}&limit=${limit}`;

    let urlAuthor = `https://api.zotero.org/groups/${process.env.ZOTERO_GROUP_ID}/items/top?format=json&include=citation&style=chicago-author-date&start=${start}&limit=${limit}`;

    await getCitations(urlNote)
      .then((data) => {
        console.log(`Fetching another ${data.length} items...`);
        limit = data.length;
        start += limit;

        try {
          // make necessary fields top level key:value pairs in the citations object for pulling data
          data.map((citation) => {
            let tags = [];
            let authors;

            citation.data.tags.map((tag) => {
              return tags.push(tag.tag);
            });

            citation.data.creators.map((creator) => {
              authors =
                authors == undefined
                  ? `${creator.lastName}, ${creator.firstName};`
                  : authors +
                    `${' '}${creator.lastName}, ${creator.firstName};`;
            });

            citation.title = citation.data.title;
            citation.creators = authors;
            citation.date = citation.data.date;
            citation.tags = tags.toString();
            citation.citation = turndownService.turndown(citation.citation);
            citation.bib = turndownService.turndown(citation.bib);
          });
          citations = citations == undefined ? data : citations.concat(data);
        } catch (err) {
          console.error(`Whoops, an error occurred: ${err}`);
        }
        return;
      })
      .catch((err) => {
        console.log(`Whoops, an error occurred: ${err}`);
      });

    await getCitations(urlAuthor)
      .then((data) => {
        const withAuthor = data;

        withAuthor.map((item) => {
          citations.map((citation) => {
            if (item.key == citation.key) {
              citation.citationAuthor = turndownService
                .turndown(item.citation)
                .slice(1, -1);
            }
          });
        });
        return;
      })
      .catch((err) => {
        console.error(`Whoops, an error occurred: ${err}`);
      });
  }

  formatCitations(citations);
};

getAll();
