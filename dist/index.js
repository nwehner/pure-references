"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const biblatex_csl_converter_1 = require("biblatex-csl-converter");
const fs = require('fs');
const util = require('util');
const inspect = (err) => { console.log(util.inspect(err, { showHidden: false, depth: null })); };
const bibFile = (alg) => fs.readFile('./bibFiles/works.bib', 'utf8', (error, data) => {
    if (error) {
        console.log('Could not read file.');
        inspect(error);
        return false;
    }
    else {
        const parser = new biblatex_csl_converter_1.BibLatexParser(data, { processUnexpected: true, processUnknown: true, async: true });
        parser.parse().then((bib) => {
            Object.keys(bib.entries).forEach((key) => {
                const citation = bib.entries[key];
                const title = citation.fields.title[0].text;
                const date = citation.fields.date;
                const authorList = citation.fields.author[0];
                const doi = citation.fields.doi;
                const url = citation.fields.url;
                const work = {
                    title: title,
                    date: date,
                    authorList: authorList,
                    doi: doi,
                    url: url
                };
                const formattedCitation = formatCitation(alg)(work);
                inspect(formattedCitation);
                return formattedCitation;
            });
        });
        return true;
    }
});
const formatAuthors = (alg) => (authorList) => {
    const formatAuthors = alg.formatAuthors(authorList);
    return formatAuthors;
};
const formatAutherImplmentation = {
    formatAuthors: (authorList) => ({ authors: 'formatted authors' })
};
const formatCitation = (alg) => (work) => {
    const formatCitation = alg.formatCitation(work);
    return formatCitation;
};
const formatCitationImplementation = {
    formatCitation: (work) => {
        const authors = formatAuthors(formatAutherImplmentation)(work.authorList);
        const citation = work.title + ' (' + work.date + ') ' + authors.authors + '. DOI: ' + work.doi + '. Available at: ' + work.url + '.';
        return {
            citation: citation
        };
    }
};
bibFile(formatCitationImplementation);
//# sourceMappingURL=index.js.map