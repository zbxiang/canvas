var gulp                =       require('gulp');
var less                =       require('gulp-less');
var concat              =       require('gulp-concat');
var cleanCss            =       require('gulp-clean-css');
var spriter             =       require('gulp-css-spriter');
var base64              =       require('gulp-base64');
var rename              =       require('gulp-rename');
var imagemin            =       require('gulp-imagemin');
var babel               =       require('gulp-babel');
var uglify              =       require('gulp-uglify');
var browserSync         =       require('browser-sync').create();
var reload              =       browserSync.reload;
var runSequence         =       require('run-sequence');
var rev                 =       require('gulp-rev');
var revCollector        =       require('gulp-rev-collector');

var src = {
    basePath : './src/',
    css : './src/styles/',
    images : './src/images/',
    js : './src/scripts/',
    less : './src/less/'
}

var build = {
    basePath : './build/',
    css : './build/styles/',
    images : './build/images/',
    js : './build/scripts/'
}


/***************************开发模式****************************/

//开发模式下静态服务器
gulp.task('server:dev',function(){
    browserSync.init({
        server: {
            baseDir : src.basePath,
            index : 'index.html'
        },
        port : 3000
    });

    gulp.watch(src.less+'*.less',['less']);
    gulp.watch(src.css+'*.css',['css:dev']);
    gulp.watch(src.js+'*.js',['js:dev']);
    gulp.watch(src.basePath+'*.html',['html:dev']);

    runSequence(['less'],['css:dev','js:dev','html:dev']);
});

gulp.task('html:dev',function(){
    gulp.src(['./src/*.html'])
        .pipe(gulp.dest('./src/'))
        .pipe(reload({stream:true}))
});

gulp.task('less', function(){
    gulp.src(src.less + '*.less')
        .pipe(less())
        .pipe(gulp.dest(src.css))
        .pipe(reload({ stream: true}))
});

gulp.task('css:dev',function(){
   gulp.src([src.css+'*.css','!'+src.css+'all.min.css','!'+src.css+'all.css'])
        .pipe(concat('all.css'))
        .pipe(spriter({
            'spriteSheet' : src.images+'spritesheet.png',
            'pathToSpriteSheetFromCSS' : '../images/spritesheet.png'
        }))
        .pipe(gulp.dest(src.css))
        .pipe(cleanCss())
        .pipe(rename('./all.min.css'))
        .pipe(gulp.dest(src.css))
        .pipe(reload({ stream: true}))
});

gulp.task('js:dev',function(){
    gulp.src([src.js+'*.js','!'+src.js+'all.js','!'+src.js+'all.min.js'])
        .pipe(babel({presets:['es2015']}))
        .pipe(concat('all.js'))
        .pipe(gulp.dest(src.js))
        .pipe(uglify())
        .pipe(rename('./all.min.js'))
        .pipe(gulp.dest(src.js))
        .pipe(reload({ stream: true}))
});


/***************************生产模式****************************/

//生产模式下的服务器
gulp.task('server:build',function(){
    browserSync.init({
        server: {
            baseDir : build.basePath,
            index: 'index.html'
        },
        port: 3001
    });
    runSequence(['css:build','html:build','js:build','imagesmin'],'rev:build');
});

gulp.task('css:build',function(){
    gulp.src([src.css+'all.min.css'])
        .pipe(rev())
        .pipe(base64({maxImageSize: 8*1024}))
        .pipe(gulp.dest(build.css))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/css/'))
});

gulp.task('html:build',function(){
    gulp.src(src.basePath+'*.html')
        .pipe(gulp.dest(build.basePath))
});

gulp.task('js:build',function(){
    gulp.src(src.js + 'all.min.js')
        .pipe(rev())
        .pipe(gulp.dest(build.js))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js/'))
});

gulp.task('imagesmin',function(){
    gulp.src(src.images+'*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(build.images))
});

gulp.task('rev:build', function(){
    return gulp.src(['./rev/**/*.json',build.basePath+'*.html'])
                .pipe( revCollector({}) )
                .pipe( gulp.dest(build.basePath) )
});

