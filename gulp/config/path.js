import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildForder = './' + rootFolder;
const srcForder = './src';

export const path =  {
    build: {
        html: `${buildForder}/`,
        files: `${buildForder}/files/`,
        css: `${buildForder}/css/`,
        js: `${buildForder}/js/`,
        images: `${buildForder}/img/`,
        video: `${buildForder}/video/`,
        fonts: `${buildForder}/fonts/`,
    },
    src: {
        html: `${srcForder}/*.html`,
        files: `${srcForder}/files/**/*.*`,
        scss: `${srcForder}/scss/style.scss`,
        js: `${srcForder}/js/app.js`,
        images: `${srcForder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        video: `${srcForder}/video/**/*.*`,
        svg: `${srcForder}/img/**/*.svg`,
        svgicons: `${srcForder}/img/svgicons/**/*.svg`
    },
    watch: {
        html: `${srcForder}/**/*.html`,
        files: `${srcForder}/files/**/*.*`,
        scss: `${srcForder}/scss/**/*.scss`,
        js: `${srcForder}/js/**/*.js`,
        images: `${srcForder}/img/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`,
        svgicons: `${srcForder}/img/svgicons/**/*.svg`,
        video: `${srcForder}/video/**/*.*`
    },
    clean: {
        buildForder: buildForder,
        html: './*.html',
        js: './js',
        css: './css',
        fonts: './fonts',
        img: './img'
    },
    buildForder: buildForder,
    srcForder: srcForder,
    rootFolder: rootFolder,
    ftp: 'test'
}