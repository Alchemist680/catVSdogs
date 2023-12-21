import gulp from 'gulp';
import { path } from './gulp/config/path.js';
import { plugins } from './gulp/config/plugins.js';

global.app = {
    path: path,
    gulp: gulp,
    plugins: plugins,
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
}

//импорт задач
import { copy } from './gulp/tasks/copy.js';
import { copyDist } from './gulp/tasks/copyDist.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { js } from './gulp/tasks/js.js';
import { images } from './gulp/tasks/images.js';
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tasks/fonts.js';
import { svgicons } from './gulp/tasks/svgicons.js';
import { zip } from './gulp/tasks/zip.js';
import { ftp } from './gulp/tasks/ftp.js';
import { video } from './gulp/tasks/video.js';

function watcher () {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
    gulp.watch(path.watch.svgicons, svgicons);
    gulp.watch(path.watch.video, video);
}

/* export { svgSprive } */

const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

const mainTasks = gulp.series(fonts, gulp.parallel(copy, images, html, scss, js, svgicons)); //!если нужно видео добавь video 

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks, copyDist);
const deployZIP = gulp.series(reset, mainTasks, copyDist, zip);
const deployFTP = gulp.series(reset, mainTasks, copyDist, ftp);

export { dev }
export { build }
export { deployZIP }
export { deployFTP }

gulp.task('default', dev);

