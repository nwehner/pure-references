import { BibLatexParser } from "biblatex-csl-converter";
const fs = require('fs');
const util = require('util');
const inspect = (err) => { console.log(util.inspect(err, { showHidden: false, depth: null })); };
const bibFile = fs.readFile('./bibFiles/works.bib', 'utf8', (error, data) => {
    if (error) {
        inspect(error);
        return false;
    }
    else {
        const parser = new BibLatexParser(data, { processUnexpected: true, processUnknown: true, async: true });
        parser.parse().then((bib) => {
            Object.keys(bib.entries).forEach((key) => {
                const citation = bib.entries[key];
                const date = citation.fields.date;
                const title = citation.fields.title[0].text;
                const leadAuthorGivenName = citation.fields.author[0].given[0].text;
                const leadAuthorFamilyName = citation.fields.author[0].family[0].text;
                const doi = citation.fields.doi;
                const url = citation.fields.url;
                inspect(doi);
                inspect(url);
                inspect(date);
                inspect(title);
                inspect(leadAuthorGivenName);
                inspect(leadAuthorFamilyName);
            });
        });
        return true;
    }
});
const formatCitation = () => {
};
//# sourceMappingURL=index.js.map