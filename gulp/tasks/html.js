import fileInclude from "gulp-file-include";
import wh from "gulp-webp-html-nosvg"; //не робит, но ошибок нет
import versionsNumber from "gulp-version-number";

export const html = () => {
    return app.gulp.src(app.path.src.html)
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: 'HTML',
                message: "Error: <%= error.message %>"
            }))
        )
        .pipe(fileInclude())
        .pipe(app.plugins.replace(/@img\//g, 'img/'))
        .pipe(wh())  
        .pipe(app.plugins.if
            (app.isBuild,
            versionsNumber({
            'value': '%DT%',
            'append': {
                'key': '_v',
                'cover': 0,
                'to': [
                    'css',
                    'js'
                ]
            },
            'output': {
                'file': 'gulp/version/json'
            }
        })))
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browsersync.stream())
}