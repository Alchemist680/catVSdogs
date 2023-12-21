export const video = () => {
    return app.gulp.src(app.path.src.video)
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: 'VIDEOS',
                message: 'Error: <%= error.message %>'
            }))
        )
        .pipe(app.gulp.dest(app.path.build.video))
        .pipe(app.plugins.browsersync.stream());
} 