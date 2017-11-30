var gulp = require('gulp'),
	 sass = require('gulp-sass'); // sass
	 browserSync = require('browser-sync'); // автообновление измененных элементов
	 prefixer = require('gulp-autoprefixer'), //расставление автопрефиксов

// перобразуем все sass файлы в css
gulp.task('gulp-sass', function() {
	return gulp.src('app/sass/*.sass')
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});
//при сохранении фалйла - перезагружаем страницу
gulp.task('service', ['browser-sync', 'gulp-sass'], function() {
	gulp.watch('app/sass/**/*.sass', ['gulp-sass']);
	gulp.watch('app/**/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	gulp.watch('app/css/**/*.css', browserSync.reload);
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "app",
			index: "form_register.html"
		}
	});

});