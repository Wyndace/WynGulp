"use strict"

const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const fileinclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff2 = require('gulp-ttf2woff2');
const tinypng = require('gulp-tinypng-compress');
const fs = require('fs');
const del = require('del')

let authKeys = JSON.parse(fs.readFileSync('./auth.json', 'utf-8'));

const stylesPreBuilding = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'compressed', }).on('error', notify.onError()))
		.pipe(rename({ suffix: '.min', }))
		.pipe(autoprefixer({ cascade: false, }))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./app/css'))
		.pipe(browserSync.stream());
};
const stylesBuilding = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sass({ outputStyle: 'compressed', }).on('error', notify.onError()))
		.pipe(rename({ suffix: '.min', }))
		.pipe(autoprefixer({ cascade: false, }))
		.pipe(dest('./build/css'))
};

const htmlPreBuilding = () => {
	return src('./src/index.html')
		.pipe(fileinclude({
			prefix: '@',
			basepath: '@file'
		}))
		.pipe(dest('./app'))
		.pipe(browserSync.stream());
};

const htmlBuilding = () => {
	return src('./src/index.html')
		.pipe(fileinclude({
			prefix: '@',
			basepath: '@file'
		}))
		.pipe(dest('./build'))
};


const imgPreBuilding = () => {
	return src(['.src/img/**.png', './src/img/**.jpeg', './src/img/**.jpg'])
		.pipe(dest('./app/img'));
};

const imgBuilding = () => {
	
	return src(['.src/img/**.png', './src/img/**.jpeg', './src/img/**.jpg'])
		.pipe(tinypng({
		key: `${authKeys.tinypng}`,
		}))
	.pipe(dest('./build/img'))
}

const videoPreBuilding = () => {
	return src(['./src/video/**.mp4', './src/video/**.mpeg', './src/video/**.webm', './src/video/**.mpg', './src/video/**.avi', './src/video/**.mov'])
		.pipe(dest('.app/video'));
};

const videoBuilding = () => {
	return src(['./src/video/**.mp4', './src/video/**.mpeg', './src/video/**.webm', './src/video/**.mpg', './src/video/**.avi', './src/video/**.mov'])
		.pipe(dest('.build/video'));
};

const resourcesPreBuilding = () => {
	return src('./src/resources/**')
		.pipe(dest('./app/resources'));
}

const resourcesBuilding = () => {
	return src('./src/resources/**')
		.pipe(dest('./build/resources'));
}


const svgToSpritePreBuilding = () => {
	return src('.src/img/**.svg')
		.pipe((svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"
				}
			}
		})))
		.pipe(dest('/app/img'));
};
const svgToSpriteBuilding = () => {
	return src('.src/img/**.svg')
		.pipe((svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"
				}
			}
		})))
		.pipe(dest('/build/img'));
};

const fontsPreBuilding = () => {
	return src('./src/fonts/**.ttf')
		.pipe(ttf2woff2())
		.pipe(dest('./app/fonts'));
}

const fontsBuilding = () => {
	return src('./src/fonts/**.ttf')
		.pipe(ttf2woff2())
		.pipe(dest('./build/fonts'));
}

let initAttr = () => {
	let srcFonts = './src/scss/_fonts.scss';
	let appFonts = './app/fonts/';
	let buildFonts = './build/fonts/';
	return [srcFonts, appFonts, buildFonts]
}

const weightCheker = (fontname) => {
	let weight = 400;
	switch (true) {
		case /Thin/.test(fontname):
			weight = 100;
			break;
		case /ExtraLight/.test(fontname):
			weight = 200;
			break;
		case /Light/.test(fontname):
			weight = 300;
			break;
		case /Regular/.test(fontname):
			weight = 400;
			break;
		case /Medium/.test(fontname):
			weight = 500;
			break;
		case /SemiBold/.test(fontname):
			weight = 600;
			break;
		case /Bold/.test(fontname):
			weight = 700;
			break;
		case /ExtraBold/.test(fontname):
			weight = 800;
			break;
		case /Black/.test(fontname):
			weight = 900;
			break;
	}
	return weight;
}

const fontsStyle = (done) => {
	let pathArr = initAttr();
	let file_content = fs.readFileSync(pathArr[0]);
	fs.writeFile(pathArr[0], '',() => {});
	fs.readdir(pathArr[1], function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				if (c_fontname != fontname[0]) {
					fs.appendFile(pathArr[0], `@include font-face("${fontname[0].split('-')[0]}", "${fontname[0]}", ${weightCheker(fontname)});\r\n`, () => {});
				}
				c_fontname = fontname[0];
			}
		}
	})

	done();
}

const fontsStyleBuilding = (done) => {
	let pathArr = initAttr();
	let file_content = fs.readFileSync(pathArr[0]);
	fs.writeFile(pathArr[0], '', () => {});
	fs.readdir(pathArr[2], function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				if (c_fontname != fontname) {
						fs.appendFile(pathArr[0], `@include font-face("${fontname[0].split('-')[0]}", "${fontname[0]}", ${weightCheker(fontname)});\r\n`, () => {});
				}
				c_fontname = fontname;
			}
		}
	})

	done();
}

const scriptsPreBuilding = () => {
		return src('./src/js/**')
		.pipe(dest('./app/js'));
}

const scriptsBuilding = () => {
		return src('./src/js/**')
		.pipe(dest('./build/js'));
}

const cleaner = () => {
	return del(['./app/*'])
}

const buildCleaner = () => {
	return del(['./build/*'])
}

const globalWatching = () => {
	browserSync.init({
		server: {
			baseDir: './app'
		}
	});

	watch('./src/scss/**/*.scss', stylesPreBuilding);
	watch('./src/index.html', htmlPreBuilding);
	watch('./src/img/**.jpg', imgPreBuilding);
	watch('./src/img/**.jpeg', imgPreBuilding);
	watch('./src/img/**.png', imgPreBuilding);
	watch('./src/img/**.svg', svgToSpritePreBuilding);
	watch('./src/video/**.mp4', videoPreBuilding);
	watch('./src/video/**.mpeg', videoPreBuilding);
	watch('./src/video/**.webm', videoPreBuilding);
	watch('./src/video/**.mpg', videoPreBuilding);
	watch('./src/video/**.avi', videoPreBuilding);
	watch('./src/video/**.mov', videoPreBuilding);
	watch('./src/resources/**', resourcesPreBuilding);
	watch('./src/fonts/**.ttf', fontsPreBuilding);
	watch('./src/fonts/**.ttf', fontsStyle);
	watch('./src/js/**', scriptsPreBuilding);
};

exports.default = series(cleaner, parallel(htmlPreBuilding, fontsPreBuilding, imgPreBuilding, svgToSpritePreBuilding, videoPreBuilding, resourcesPreBuilding, scriptsPreBuilding),fontsStyle, stylesPreBuilding, globalWatching);

exports.build = series(buildCleaner, parallel(htmlBuilding, fontsBuilding, imgBuilding, svgToSpriteBuilding, videoBuilding, resourcesBuilding, scriptsBuilding), fontsStyleBuilding, stylesBuilding);