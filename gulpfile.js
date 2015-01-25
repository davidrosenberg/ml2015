import templater from './build/templater.js';
const gulp = require('gulp');
const gulpStylus = require('gulp-stylus');

const STYLUS = 'styles/*.styl';
const TEMPLATES = '**/*.hbs';
const MAIN_TEMPLATE = 'index.hbs';
const DATA = 'data/*';

const OUTPUT_HTML = 'index.html';
const OUTPUT_STYLES = 'styles/';

gulp.task('template', () =>
    templater(MAIN_TEMPLATE, OUTPUT_HTML)
);

gulp.task('stylus', () =>
    gulp.src(STYLUS)
        .pipe(gulpStylus())
        .pipe(gulp.dest(OUTPUT_STYLES))
);

gulp.task('build', ['template', 'stylus']);

gulp.task('watch', ['template', 'stylus'], () => {
    gulp.watch([TEMPLATES, DATA], ['template'])
    gulp.watch(STYLUS, ['stylus'])
});

