"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const biblatex_csl_converter_1 = require("biblatex-csl-converter");
const fs = require('fs');
const util = require('util');
const inspect = (err) => { console.log(util.inspect(err, { showHidden: false, depth: null })); };
const bibToCitation = (bibFile) => (alg) => fs.readFile(bibFile, 'utf8', (error, data) => {
    if (error) {
        console.log('Could not read file.');
        inspect(error);
        return error;
    }
    else {
        const parser = new biblatex_csl_converter_1.BibLatexParser(data, { processUnexpected: true, processUnknown: true, async: true });
        return parser.parse().then((bib) => {
            Object.keys(bib.entries).forEach((key) => {
                const citation = bib.entries[key];
                const title = citation.fields.title[0].text;
                const date = formatDate(citation.fields.date);
                const authorList = citation.fields.author;
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
                inspect(formattedCitation.citation);
                return formattedCitation;
            });
        });
    }
});
exports.bibToCitation = bibToCitation;
const formatDate = (date) => {
    if (date) {
        if (date.length > 4) {
            return date.substring(0, 4);
        }
        else {
            return date;
        }
    }
    else {
        return 'In Press';
    }
};
const formatAuthors = (alg) => (authorList) => {
    const formatAuthors = alg.formatAuthors(authorList);
    return formatAuthors;
};
const addPunctuation = (text) => {
    if (text[text.length - 1] === '.') {
        return text;
    }
    else {
        return text + '.';
    }
};
const formatAutherImplmentation = {
    formatAuthors: (authorList) => {
        const formattedAuthors = authorList.map((value, label) => {
            const lastFirst = value.family[0].text + ', ' + value.given[0].text;
            const firstLast = value.given[0].text + ' ' + value.family[0].text;
            const formattedAuthor = {
                lastFirst: lastFirst,
                firstLast: firstLast
            };
            return formattedAuthor;
        });
        if (formattedAuthors.length === 1) {
            return {
                authors: addPunctuation(formattedAuthors[0].lastFirst)
            };
        }
        else if (formattedAuthors.length === 2) {
            return {
                authors: formattedAuthors[0].lastFirst + ' and ' + addPunctuation(formattedAuthors[1].firstLast)
            };
        }
        else {
            return {
                authors: formattedAuthors[0].lastFirst + ', et al.'
            };
        }
    }
};
const formatCitation = (alg) => (work) => {
    const formatCitation = alg.formatCitation(work);
    return formatCitation;
};
const formatCitationTitleFirst = {
    formatCitation: (work) => {
        const authors = formatAuthors(formatAutherImplmentation)(work.authorList);
        const citation = work.title + ' (' + work.date + ') ' + authors.authors + ' DOI: ' + work.doi + '. Available at: ' + work.url + '.';
        return {
            citation: citation
        };
    }
};
exports.formatCitationTitleFirst = formatCitationTitleFirst;
const formatCitationAuthorsFirst = {
    formatCitation: (work) => {
        const authors = formatAuthors(formatAutherImplmentation)(work.authorList);
        const citation = authors.authors + ' ' + work.date + '. ' + addPunctuation(work.title) + ' DOI: ' + work.doi + '. Available at: ' + work.url;
        return {
            citation: citation
        };
    }
};
exports.formatCitationAuthorsFirst = formatCitationAuthorsFirst;
//# sourceMappingURL=index.js.map