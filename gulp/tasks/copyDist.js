export const copyDist = () => {
    return app.gulp.src(`./${app.path.buildForder}/**/*.*`)
    .pipe(app.gulp.dest('./'))
}