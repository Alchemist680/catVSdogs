import del from 'del';
export const reset = () => {
    return del([app.path.clean.buildForder, app.path.clean.html, app.path.clean.js, app.path.clean.css, app.path.clean.fonts, app.path.clean.img]);
}