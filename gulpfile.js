'use strict';

// Определим необходимые инструменты
const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const del = require('del');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-cleancss');
const gulpSequence = require('gulp-sequence');
const wait = require('gulp-wait');

// ЗАДАЧА: Компиляция препроцессора
gulp.task('sass', function(){
  return gulp.src('./scss/style.scss')         // какой файл компилировать (путь из константы)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(wait(500))                                // инициируем карту кода
    .pipe(sass())                                           // компилируем SASS
    .pipe(postcss([                                         // делаем постпроцессинг
        autoprefixer({ browsers: ['last 2 version'] }),     // автопрефиксирование
        mqpacker({ sort: true }),                           // объединение медиавыражений
    ]))
    .pipe(sourcemaps.write('/'))                            // записываем карту кода как отдельный файл (путь из константы)
    .pipe(gulp.dest('./css'))                  // записываем CSS-файл (путь из константы)
    .pipe(reload({ stream: true }));
});

// ЗАДАЧА: Очистка папки сборки
gulp.task('clean', function () {
  return del([                                              // стираем
    'css/style.css',                                   // все файлы из папки сборки (путь из константы)
  ]);
});

// ЗАДАЧА: Сборка SASS, img, JS, HTML, sprite
gulp.task('build', function (callback) {
  gulpSequence(
    'clean',
    'sass',
    callback
  );
});

// ЗАДАЧА: Задача по умолчанию
gulp.task('default', ['serve']);

// ЗАДАЧА: Локальный сервер, слежение
gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: './',
    startPath: 'index.html',
    // open: false,
    port: 8080,
  });

  gulp.watch('./scss/**/*.scss', ['sass']);

});

// Уведомления об ошибках
var onError = function(err) {
    notify.onError({
      title: "Error in " + err.plugin,
    })(err);
    this.emit('end');
};