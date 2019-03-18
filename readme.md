# BibToCitation

## To run this program
Install the module via NPM in your terminal:
    npm install --save bibToCitation
Then, import the module to your program (likely your index.ts file):
    import { bibToCitation, formatCitationTitleFirst, formatCitationAuthorsFirst } from 'bibToCitation';
Once installed and imported, run the module.

### Provide a list of citations with authors first
    bibToCitation('./path/to/bibFile.bib', formatCitationAuthorsFirst);
### Provide a list of citations with titles first
    bibToCitation('./path/to/bibFile.bib', formatCitationTitleFirst);