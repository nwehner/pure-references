// Import libraries
import {BibLatexParser} from "biblatex-csl-converter";
const fs = require('fs');

// Debugging help
const util = require('util');
const inspect = (err: any) => { console.log(util.inspect(err, { showHidden: false, depth: null })); };

// Read our file and parse it.
const bibFile = (alg : FormatCitation) => fs.readFile('./bibFiles/works.bib', 'utf8', (error: any, data: any) => {
    if (error) {
        console.log('Could not read file.');
        inspect(error);
        return false;
    } else {
        // We successfully read the file. Now parse it.
        const parser = new BibLatexParser(data, {processUnexpected: true, processUnknown: true, async: true})
        parser.parse().then((bib: any) => {
            Object.keys(bib.entries).forEach((key) => {
                // Parse the BibTex JSON object.
                const citation: any = bib.entries[key];
                const title: string = citation.fields.title[0].text;
                const date: string = formatDate(citation.fields.date);
                const authorList: Author[] = citation.fields.author;
                const doi: string = citation.fields.doi;
                const url: string = citation.fields.url;
                // Format into a citation.
                const work: Work = {
                    title: title,
                    date: date,
                    authorList: authorList,
                    doi: doi,
                    url: url
                }
                const formattedCitation = formatCitation(alg)(work);
                inspect(formattedCitation);
                return formattedCitation;
            });
        });
        return true;
    }
});

const formatDate = (date: string) => {
    if (date) {
        if (date.length > 4) {
            return date.substring(0,4)
        }
        else {
            return date
        }
    }
    else {
        return 'In Press'
    }
}

// Specify our types.
interface Author {
    readonly given: [
        {
            type: 'text',
            text: string
        }
    ],
    readonly family: [
        {
            type: 'text',
            text: string
        }
    ]
}

interface Work {
    readonly title: string,
    readonly date: string,
    readonly authorList: Author[],
    readonly doi: string,
    readonly url: string
}

interface Citation {
    citation: string
}

interface FormattedAuthor {
    lastFirst: string,
    firstLast: string
}

interface FormattedAuthorsString {
    authors: string
}

// Specify the algebra for formatting authors.
interface FormatAuthors {
    readonly formatAuthors: (authorList: Author[]) => FormattedAuthorsString;
}

const formatAuthors = (alg: FormatAuthors) =>
                      (authorList: Author[]) => {
    const formatAuthors = alg.formatAuthors(authorList);
    return formatAuthors;
}

// Helper function to add periods.
const addPunctuation = (text: string) => {
    if (text[text.length - 1] === '.') {
        return text
    }
    else {
        return text + '.'
    }
}

// Format a list of authors.
const formatAutherImplmentation: FormatAuthors = {
    formatAuthors: (authorList: Author[]) => {
        const formattedAuthors: FormattedAuthor[] = authorList.map((value: Author, label: number) => {
            const lastFirst: string = value.family[0].text + ', ' + value.given[0].text;
            const firstLast: string = value.given[0].text + ' ' + value.family[0].text;
            const formattedAuthor: FormattedAuthor = {
                lastFirst: lastFirst,
                firstLast: firstLast
            };
            return formattedAuthor
        });
        // Depending on the length of formattedAuthor[] we'll return the final, formatted string.
        if (formattedAuthors.length = 1) {
            // Solo author.
            return {
                authors: addPunctuation(formattedAuthors[0].lastFirst)
            }
        }
        else if (formattedAuthors.length = 2) {
            // Use and.
            return {
                authors: formattedAuthors[0].lastFirst + ' and ' + addPunctuation(formattedAuthors[1].firstLast)
            }
        }
        else {
            // Use et al.
            return {
                authors: formattedAuthors[0].lastFirst + ', et al.'
            }
        }
    }
}

// Specify the algebra for formatting the rest of the citation.
interface FormatCitation {
    readonly formatCitation: (work: Work) => Citation;
}

const formatCitation = (alg: FormatCitation) =>
                       (work: Work) => {
    const formatCitation = alg.formatCitation(work);
    return formatCitation;
}

/**
 * We can have a number of options to format the citation.
 */

// Format the citation like: {title} ({date}) {authorList}. DOI: {doi}. Available at: {url}.
const formatCitationTitleFirst: FormatCitation = {
    formatCitation: (work: Work) => {
        // Needs to return a formatted citation string.
        // First parse over the authors.
        const authors = formatAuthors(formatAutherImplmentation)(work.authorList);
        const citation = work.title + ' (' + work.date + ') ' + authors.authors + ' DOI: ' + work.doi + '. Available at: ' + work.url + '.';
        return {
            citation: citation
        }
    }
}

// Format the citation like: {authorList} {date}. {title}. DOI: {doi}. Available at: {url}.
const formatCitationAuthorsFirst: FormatCitation = {
    formatCitation: (work: Work) => {
        const authors = formatAuthors(formatAutherImplmentation)(work.authorList);
        const citation = authors.authors + ' ' + work.date + '. ' + addPunctuation(work.title) + ' DOI: ' + work.doi + '. Available at: ' + work.url;
        return {
            citation: citation
        }
    }
}

// Run the program.
bibFile(formatCitationAuthorsFirst);