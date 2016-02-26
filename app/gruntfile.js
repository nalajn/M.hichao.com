var grunt = require('grunt');
var webpack = require('webpack');
var fs = require('fs');
var path = require('path');
var arguvs = JSON.parse(process.env.npm_config_argv).cooked;
var filePath = arguvs.length >= 4 ? arguvs[arguvs.length - 1] : '';

var WATCH = false;
var ENV = arguvs[1];
if(ENV == 'watch'){
    WATCH = true;
    ENV = 'dev';
}
console.log(ENV);
console.log(filePath);

var lintFile = '';
if(filePath.indexOf('.js') != -1 || filePath.indexOf('.less') != -1){
    lintFile = filePath;
}
else{
    if(filePath.indexOf('js') != -1) {
        lintFile = filePath.substr(-1, 1) == '/' ? filePath + '**/*.js' : filePath + '/**/*.js';
    }
    else{
        lintFile = filePath.substr(-1, 1) == '/' ? filePath + '**/*.less' : filePath + '/**/*.less';
    }
}
var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    mangle: {
        except: ['$', 'exports', 'require']
    },
    compress: {
        warnings: false
    },
    output: {
        comments: false
    }
});
var LessPluginCleanCSS = require("less-plugin-clean-css");
var cleancss = new LessPluginCleanCSS({advanced: true});
var LessPluginAutoPrefix = require("less-plugin-autoprefix");
var autoprefix = new LessPluginAutoPrefix({
    browsers:[
        '> 0.01%','ie 9'
    ]
});
grunt.loadNpmTasks('grunt-webpack');
grunt.loadNpmTasks('grunt-file-hash');
grunt.loadNpmTasks("grunt-contrib-less");
grunt.loadNpmTasks('grunt-contrib-watch');


function eachFile(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            eachFile(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}
function getWebpackFilePath (path) {
    path = path.substr(path.indexOf('/') + 1);
    path = path.substr(0, path.indexOf('.'));
    return path;
}
function getLessFilePath (path) {
    path = path.replace(/\.less/g,'.css');
    return path;
}

module.exports = function(grunt) {
    grunt.initConfig({
        //webpack
        webpack: {
            build: {
                devtool : 'source-map' ,
                entry: (function () {
                    var modules = {};
                    if(filePath.indexOf('js') != -1) {
                        if (filePath.indexOf('.js') != -1) {
                            var name = getWebpackFilePath(filePath);
                            modules[name] = './' + filePath;
                        }
                        else {
                            eachFile(filePath).forEach(function (item) {
                                if (item.indexOf('.js') != -1) {
                                    var m_path = item.replace(/\\\\/g, '\/');
                                    m_path = m_path.replace(/\\/g, '\/');
                                    m_path = m_path.replace(/\/\//g, '\/');
                                    var name = getWebpackFilePath(m_path);
                                    modules[name] = './' + m_path;
                                }
                            })

                        }
                    }
                    return modules;
                })(),
                output: {
                    path: path.join(__dirname, ENV == 'dev' ? '/dev' : '/dist'),
                    filename: 'js/[name].js'
                },
                module: {
                    //preLoaders : [
                    //    {test: /\.js$/, loader: "jshint-loader", exclude: /node_modules/}
                    //],
                    loaders: [
                        {test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader?loose=all'}
                    ]
                },
                //jshint:{
                //    failOnHint: true,
                //    passfail: true,
                //    maxerr: 5,
                //    asi: true,
                //    curly: true,
                //    indent: 4,
                //    //eqeqeq: true,
                //    //passfail: true,
                //    //immed: true,
                //    //latedef: true,
                //    noempty: true,
                //    unused: true,
                //    //strict:true,
                //    //newcap: true,
                //    //noarg: true,
                //    sub: true,
                //    undef: true,
                //    expr: true,
                //    eqnull: true,
                //    //browser: true,
                //    //nomen: true,
                //    emitErrors: true,
                //    esnext: true,
                //    globals: {
                //        define: true,
                //        requirejs: true,
                //        require: true,
                //        jQuery: false,
                //        $: false,
                //        document: false,
                //        window: false,
                //        ANDROID_WODFAN_INSTANCE: false,
                //        setInterval: false,
                //        setTimeout: false,
                //        clearInterval: false,
                //        clearTimeout: false,
                //        alert: false,
                //        confirm: false,
                //        unescape: false,
                //        FormData: false,
                //        Image: false
                //    }
                //},
                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                },
                plugins: ENV == 'dev' ? [] : [
                    uglifyJsPlugin,
                ],
                resolve: {
                    alias: (function () {
                        var alias = JSON.parse(fs.readFileSync('build.json', 'utf-8'));
                        for (var key in alias) {
                            alias[key] = path.join(__dirname, alias[key]);
                        }
                        return alias;
                    })()
                }
            }
        },
        //file rev
        filehash: {
            /*options: {
                output: 'build/hash.json',
                merge: true,
                hashlen: 8
            },*/
                // Target-specific file lists and/or options go here.
            options: {
                mapping: 'build/hash.json',                      // the mapping file path
                mappingKey: '{{= dirname}}/{{= basename}}{{= extname}}', // mapping key options
                mappingValue: '{{= dirname}}/{{= basename}}.{{= hash}}{{= extname}}', // mapping value options
                etag: null,
                algorithm: 'md5', // the algorithm to create the hash
                //rename: '#{= dirname}/#{= basename}_#{= hash}#{= extname}', // save the original file as what
                keep: true,      // should we keep the original file or not
                merge: false,    // merge hash results into existing `hash.json` file or override it.
                hashlen: 8,
            },
            files: {
                cwd: 'dist',
                src: ['js/**/*.js','css/**/*.css'],
                dest: 'build'
            }
        },
        //less
        less: {
            complie: {
                options: {
                    paths: ['./'],
                    compress: true,
                    //sourceMapFileInline: ENV == 'dev' ? true : false,
                    sourceMap: ENV == 'dev' ? true : false,
                    optimization: true,
                    plugins: [cleancss, autoprefix]
                },
                files: (function () {
                    var files = [], obj = {};
                    if(filePath.indexOf('css') != -1) {
                        if (filePath.indexOf('.less') != -1) {
                            files.push({
                                file: filePath,
                                dev: 'dev/' + getLessFilePath(filePath),
                                dist: 'dist/' + getLessFilePath(filePath)
                            })
                        }
                        else {
                            eachFile(filePath).forEach(function (item) {
                                if (item.indexOf('.less') != -1) {
                                    var m_path = item.replace(/\\\\/g, '\/');
                                    m_path = m_path.replace(/\\/g, '\/');
                                    m_path = m_path.replace(/\/\//g, '\/');
                                    files.push({
                                        file: m_path,
                                        dev: 'dev/' + getLessFilePath(m_path),
                                        dist: 'dist/' + getLessFilePath(m_path)
                                    })
                                }
                            })
                        }
                        files.forEach(function (o) {
                            if (ENV == 'dev') {
                                obj[o.dev] = o.file;
                            }
                            else if (ENV == 'dist') {
                                obj[o.dist] = o.file;
                            }
                        })
                    }
                    return obj;
                })(),
            }
        },
        //watch
        watch: {
            file: {
                files: [lintFile],
                tasks: lintFile.indexOf('.js') != -1 ? ['webpack'] : ['less']
            }
        }
    });
    if(ENV != 'build') {
        if(WATCH){
            console.log('watch');
            grunt.registerTask('default', ['watch']);
        }
        else {
            if (filePath.indexOf('js') != -1) {
                console.log('grunt-js');
                grunt.registerTask('default', ['webpack']);
            }
            if (filePath.indexOf('css') != -1) {
                console.log('grunt-less');
                grunt.registerTask('default', ['less']);
            }
        }
    }
    else {
        console.log('grunt-build');
        grunt.registerTask('default', ['filehash']);
    }
}

