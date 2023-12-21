import { configFTP } from '../config/ftp.js';
import vinylFTP from 'vinyl-ftp';
import until from 'gulp-until';

export const ftp = () => {
    configFTP.log = until.log;
    const ftpContent = vinylFTP.create(configFTP);
    return app.gulp.src(`${app.path.buildForder}/**/*.*`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: 'FTP',
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(ftpContent.dest(`/${app.path.ftp}/${app.path.rootFolder}`));
}