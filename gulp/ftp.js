import gulp from 'gulp'
import { project_folder, template, isDeploy } from './settings.js'
import gutil from 'gulp-util'
import ftp from 'vinyl-ftp'

let domen;

export function getLink() {
	if (template == 'wsp') {
		return '/' + project_folder + '/'
	} else {
		return '/www/' + project_folder + domen;
	}
	// return '/www/eurolesa.ru/wp-content/themes/main/';
	// return '/optiform/';
}

if (template == 'siteup') {

	domen = '.siteup.ru/';

	var conn = ftp.create({
		host: 'host.siteup.ru',
		user: 'osmanov',
		password: '2Z0a5T8i',
		parallel: 10,
		log: gutil.log
	});

} else if (template == 'wsp') {
	domen = 'verstka.demo-wsp.ru/';

	var conn = ftp.create({
		host: '194.58.96.203',
		user: 'verstka_remzi',
		password: 'vE7bK0mF2h',
		parallel: 10,
		log: gutil.log
	});
} else {

	domen = '.osmanovremzi.ru/';

	var conn = ftp.create({
		host: '5.39.218.122',
		user: 'remzi144',
		password: 'qU1uN0vK4ytO3g',
		parallel: 10,
		log: gutil.log
	});
}

const deploy = () => {
	let globs = [
		project_folder + '/assets/css/style.css',
		project_folder + '/assets/js/script.js',
		project_folder + '/*.html'
	];

	return gulp.src(globs, {
		base: project_folder,
		buffer: false
	})
		.pipe(conn.dest(getLink()))
}

const deployAll = () => {
	let globs = [
		project_folder + '/**/*.*',
		project_folder + '/*.*',
	];

	return gulp.src(globs, {
		base: project_folder,
		buffer: false
	})
		.pipe(conn.dest(getLink()))
}

const deploySprite = () => {
	let globs = [
		project_folder + '/assets/img/sprite.svg',
	];

	return gulp.src(globs, {
		base: project_folder,
		buffer: false
	})
		.pipe(conn.newer(getLink()))
		.pipe(conn.dest(getLink()))
}

const deployLibs = () => {
	let globs = [
		project_folder + '/assets/css/vendor.css',
		project_folder + '/assets/js/vendor.js',
	];

	return gulp.src(globs, {
		base: project_folder,
		buffer: false
	})
		.pipe(conn.newer(getLink()))
		.pipe(conn.dest(getLink()))
}

const deployImages = () => {
	let globs = [
		project_folder + '/assets/img/**/*',
	];

	return gulp.src(globs, {
		base: project_folder,
		buffer: false
	})
		.pipe(conn.newer(getLink()))
		.pipe(conn.dest(getLink()))
}

const deployHtml = () => {
	if (!isDeploy) return Promise.resolve()

	let globs = [
		project_folder + '/*.html'
	];

	return gulp.src(globs, {
		base: project_folder,
		buffer: false
	})
		.pipe(conn.newer(getLink()))
		.pipe(conn.dest(getLink()))
}

const deployCss = () => {
	if (!isDeploy) return Promise.resolve()
	let globs = [
		project_folder + "/assets/css/*.css",
		"!" + project_folder + "/assets/css/vendor.css",
		"!" + project_folder + "/assets/css/fonts.css"
	];

	return gulp.src(globs, {
		base: project_folder,
		buffer: false
	})
		.pipe(conn.newer(getLink()))
		.pipe(conn.dest(getLink()))
}

const deployJs = () => {
	if (!isDeploy) return Promise.resolve()
	let globs = [
		project_folder + "/assets/js/*.js", "!" + project_folder + "/assets/js/vendor.js",
	];
	return gulp.src(globs, {
		base: project_folder,
		buffer: false
	})
		.pipe(conn.newer(getLink()))
		.pipe(conn.dest(getLink()))
}

gulp.task('deploy', deploy)
gulp.task('deploy-all', deployAll)
gulp.task('deploy-sprite', deploySprite)
gulp.task('deploy-libs', deployLibs)
gulp.task('deploy-images', deployImages)

export { deploy, deployAll, deploySprite, deployLibs, deployImages, deployHtml, deployCss, deployJs }
