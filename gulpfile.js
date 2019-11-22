const gulp = require('gulp');
const server = require('browser-sync').create();
const del = require("del");
const run = require("run-sequence");

gulp.task('clean', () =>
    del('build')
);

gulp.task("copy", () =>
    gulp.src([
        "src/index.html",
        "src/img/**",
        "src/js/**",
    ], {
        base: 'src'
    })
        .pipe(gulp.dest('build'))
);

gulp.task("serve", ["copy"], () => {
    server.init({
        server: 'build/'
    });

    gulp.watch("src/*.html", ["copy"]).on('change', server.reload);
    gulp.watch("src/js/**/*.*", ["copy"]).on('change', server.reload);
    gulp.watch("src/img/**/*.*", ["copy"]).on('change', server.reload);
});

gulp.task("build", done => {
    run(
        "clean",
        "copy",
        done
    )
});