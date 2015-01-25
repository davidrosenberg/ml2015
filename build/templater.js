const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const handlebarsFactory = require('handlebars');
const moment = require('moment');
const assert = require('assert');

const SLIDES_AND_NOTES = 'Slides and Notes';
const READING_PRE = 'Reading (Pre)';
const READING_SUPPLEMENTAL = 'Reading (Supplemental)';

export default function (input, output) {
    const handlebars = handlebarsFactory.create();
    registerHelpers(handlebars);
    registerPartials(handlebars);

    const template = compileTemplate(handlebars, input);
    const documents = parseDocuments();
    fs.writeFileSync(output, template(documents));
}

// Uncomment to see documents; useful while tweaking the templates
// console.log(require("util").inspect(documents, { depth: Infinity }));

function compileTemplate(handlebars, input) {
    return handlebars.compile(fs.readFileSync(input, { encoding: 'utf-8' }));
}

function parseDocuments() {
    const lectures = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../data/lectures.yml')));

    // Pull Slides and Notes, Reading (Pre), and Reading (Supplemental) from the topics up to the top level:
    for (const lecture of lectures) {
        Object.keys(lecture.Events).forEach(eventDate => {
            const event = lecture.Events[eventDate];

            ensureArrayExists(event, SLIDES_AND_NOTES);
            ensureArrayExists(event, READING_PRE);
            ensureArrayExists(event, READING_SUPPLEMENTAL);

            Object.keys(event.Topics).forEach(topic => {
                copyArrayInto(event.Topics[topic], event, SLIDES_AND_NOTES);
                copyArrayInto(event.Topics[topic], event, READING_PRE);
                copyArrayInto(event.Topics[topic], event, READING_SUPPLEMENTAL);
            });
        });
    }

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

    return { lectures, assignmentsFrontmatter, assignments };
}

function registerPartials(handlebars) {
    const assignmentsFilename = path.resolve(__dirname, '../templates/assignments.hbs');
    handlebars.registerPartial('assignments', fs.readFileSync(assignmentsFilename, { encoding: 'utf-8' }));

    const lecturesFilename = path.resolve(__dirname, '../templates/lectures.hbs');
    handlebars.registerPartial('lectures', fs.readFileSync(lecturesFilename, { encoding: 'utf-8' }));
}

function registerHelpers(handlebars) {
    handlebars.registerHelper('date', d => moment.utc(d).format('MMMM Do'));
    handlebars.registerHelper('shortDate', d => moment.utc(d).format('MMM D'));
    handlebars.registerHelper('maybeLink', v => {
        if (typeof v === 'string') {
            return v;
        }

        assert (typeof v === 'object' && v !== null, 'Links must be either strings or objects');

        const keys = Object.keys(v);
        assert(keys.length === 1, 'Link objects must have a single key');
        const key = keys[0];

        return new handlebars.SafeString('<a href="' + v[key] + '">' + key + '</a>');
    });
}

function ensureArrayExists(obj, prop) {
    if (!(prop in obj)) {
        obj[prop] = [];
    }
}

function copyArrayInto(source, dest, keyName) {
    if (source && source[keyName]) {
        dest[keyName].push(...source[keyName]);
    }
}
