const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const handlebars = require('handlebars');
const moment = require('moment');

handlebars.registerHelper('date', dateHandlebarsHelper);
registerPartials();

export default function (input, output) {
    const template = compileTemplate(input);
    const documents = parseDocuments();
    fs.writeFileSync(output, template(documents));
}

// Uncomment to see documents; useful while tweaking the templates
// console.log(require("util").inspect(documents, { depth: Infinity }));

function compileTemplate(input) {
    return handlebars.compile(fs.readFileSync(input, { encoding: 'utf-8' }));
}

function registerPartials() {
    const assignmentsFilename = path.resolve(__dirname, '../templates/assignments.hbs');
    handlebars.registerPartial('assignments', fs.readFileSync(assignmentsFilename, { encoding: 'utf-8' }));
}

function parseDocuments() {
    const topics = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../data/topics.yml')));

    let assignmentsFrontmatter, assignments;
    let i = 0;
    yaml.safeLoadAll(fs.readFileSync(path.resolve(__dirname, '../data/assignments.yml')), doc => {
        switch (i) {
            case 0:
                assignmentsFrontmatter = doc;
                break;
            case 1:
                assignments = doc;
                break;
            default:
                throw new Error('Cannot have more than two documents in assignments.yaml');
        }
        ++i;
    });

    return { topics, assignmentsFrontmatter, assignments };
}

function dateHandlebarsHelper(date) {
    return moment.utc(date).format('MMMM Do');
}
