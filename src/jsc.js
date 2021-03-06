/**
 * jsc：把模板转换成js，合并js
 * @author youkunhuang
 */


var logger = require('./logger')(__filename),
    config = require('./config.js'),
    watcher = require('./watcher.js'),
    parse = require('./parse.js'),
    Queue = require('./queue.js'),
    removeComments = require('./removeComments.js'),
    util = require('./util.js'),
    crypto = require('crypto'),
    q = new Queue(),
    fs = require("fs"),
    path = require('path'),
    cdnPath = require('./cdn.path.js'),
    UglifyJS = require("uglify-js"),
    jscTimes = 0,
    beforeCode,//_config.js内设置对象属性:before{name:xxx.js}必须放在合并js文件最前的js代码，例如seajs，不设置则没有
    undefined;

// https://github.com/seajs/seajs
// 在node环境中也可以使用define函数
// 这里的作用主要是能让`_config.js`配置文件写成define(factory)形式
// 如果`_config.js`写成module.exports形式，就不用引这个东西了
require('./seajs');

module.exports = jsc;

/**
 * 合并文件
 * @param {Object} opt
 *  {String} seajsRoot seajs根目录
 *  {String} modulePath 要合并的模块目录
 *  {String} cfgkey 要合并的配置key
 *  {Function} callback
 */
function jsc(opt) {

    var seajsRoot = opt.seajsRoot,
        modulePath = opt.modulePath,
        callback = opt.callback,
        listen = opt.listen,
        cfgkey = opt.cfgkey,
        undefined;

    if (!(fs.existsSync || path.existsSync)(modulePath)) {
        callback && callback();
        return;
    }

    if ((fs.existsSync || path.existsSync)(modulePath + '/src')) {
        q.queue(function () {
            this.clear();
            createALL(seajsRoot, modulePath, cfgkey);
            logger.info('finish! ${times} : ${module}', {
                times: +(++jscTimes),
                module: modulePath
            });
            callback && callback();
            this.dequeue();
        });
    } else {
        callback && callback();
    }

    listen &&
    watcher.watch(modulePath, function (event, file) {

        var module = '';

        if (!/\/src\/.+/gmi.test(file)) {
            //发现有文件改变
            cdnPath.modify(file);
            return;
        }

        logger.info('${e} : ${f}', {
            e: event,
            f: file
        });

        module = file.replace(/\/src\/.+/gmi, '');

        q.queue(function () {

            createALL(seajsRoot, module, cfgkey);
            logger.info('finish! ${times} : ${module}', {
                times: +(++jscTimes),
                module: module
            });
            this.dequeue();
        });

    });

}

/**
 *
 * 合并所有文件
 * @param {String} seajsRoot seajs根目录
 * @param {String} modulePath 要合并的模块目录
 * @param {String} cfgkey 要合并的配置key
 */
function createALL(seajsRoot, modulePath, cfgkey) {

    var packConfigs = [];


    //分析配置文件
    if ((fs.existsSync || path.existsSync)(modulePath + '/src/_config.js')) {

        //清除配置文件缓存
        delete require.cache[(modulePath + '/src/_config.js').replace(/\\/gmi, '/')];
        delete require.cache[(modulePath + '/src/_config.js').replace(/\//gmi, '\\')];

        packConfigs = require(modulePath + '/src/_config.js');
    }

    if (packConfigs && !(packConfigs instanceof Array)) {
        packConfigs = [packConfigs];
    }

    packConfigs.forEach(function (packConfig) {

        if (cfgkey && cfgkey !== packConfig.key) {
            return;
        }

        var js = [],
            res = [],
            resJS = [],
            resHTML = [],
            moduleStr = config.defaultModule,
            outputALL = config.outputALL,
            createOut = true,
            uglify = false,
            outputHTML = config.outputHTML,
            packDependent,
            outputDir,
            out,
            tmp, i, str, mname;

        uglify = !!packConfig.uglify;

        if (packConfig.tmpl) {
            outputHTML = packConfig.tmpl.name || config.outputHTML;
            createOut = !!packConfig.tmpl.create;
        }

        if (packConfig.all) {
            outputALL = packConfig.all.name || config.outputALL;
            createOut = packConfig.all.create === false ? false : true;
        }

        outputDir = packConfig.dir || config.outputDir,
            out = modulePath + '/' + outputDir + outputALL;

        out = path.normalize(out).replace(/\\/gi, '/');

        if (packConfig.all) {
            resJS = createJS(seajsRoot, modulePath, packConfig);
        }
        if (packConfig.all || packConfig.tmpl) {
            resHTML = createTMPL(seajsRoot, modulePath, packConfig);
        }

        logger.info('${o}:', {
            o: out
        });

        if (outputALL && (fs.existsSync || path.existsSync)(modulePath + '/src/' + outputALL)) {
            //moduleStr = '';

            logger.warn('module redefine: ${file}', {
                file: modulePath + '/src/' + outputALL
            });

        }
        if (packConfig.all) {
            [].push.apply(js, resJS.fileList);
            [].push.apply(js, resHTML.fileList);
        }

        res.push('\r\n//all file list:\r\n')
        js.forEach(function (n, i) {

            var str = modulePath + '/src/' + n;

            str = path.normalize(str).replace(/\\/gi, '/');
            str = str.replace(/.*\/+([^\/]+\/src\/.+)$/, '$1');

            res.push('//' + str + '\r\n');
        });

        //打印all file文件列表之后的空行，先注释掉
        //res.push('\r\n\r\n');

        if (packConfig.all) {
            [].push.apply(res, resJS.res);
            [].push.apply(res, resHTML.res);
        }

        packDependent = resJS.packDependent || [];
        tmp = [];

        packDependent.forEach(function (v, i) {

            var id = v.split('?')[0].replace(/^\.\//, '').replace(/(?:\.js)?$/, '.js');

            if (id !== outputHTML) {
                tmp.push(v);
            }
        });

        moduleStr = moduleStr.replace('define\x28function', 'define\x28' + JSON.stringify(tmp) + ',function');
        var finalCode = moduleStr + res.join('');

        if (beforeCode) {//前置代码加到最前面
            finalCode = beforeCode + finalCode;
        }

        if (res.length && packConfig.all) {
            if (createOut) {
                finalCode = finalCode.replace(/\r\n|\r|\n/gmi, "\r\n");
                // UglifyJS
                if (uglify) {
                    finalCode = uglifyJS(finalCode);
                }

                out = writeFile(out, finalCode, packConfig.all, modulePath, js);

                //补id补依赖
                cdnPath.modify(out);
            }
        } else {
            logger.info('${o} is empty!!!', {o: out});
        }
    });
}

/**
 *
 * 合并模板文件
 * @param {String} seajsRoot seajs根目录
 * @param {String} modulePath 要合并的模块目录
 * @param {Object} packConfig 打包配置
 */
function createTMPL(seajsRoot, modulePath, packConfig) {
    packConfig = packConfig || {};

    var res = [],
        idmap = {},
        outputHTML = config.outputHTML,
        outputDir = packConfig.dir || config.outputDir,
        createOut = false,
        uglify = packConfig.uglify,
        out, js, tmp, i, str, mname;

    if (packConfig.tmpl) {
        outputHTML = packConfig.tmpl.name || config.outputHTML;
        createOut = !!packConfig.tmpl.create;
    }

    out = modulePath + '/' + outputDir + outputHTML;
    out = path.normalize(out).replace(/\\/gi, '/');

    js = util.getFileList(modulePath + '/src', /\.(?:tmpl|page)\.html?$/i);

    //按文件名排序
    js.sort(function (a, b) {
        return a >= b ? 1 : -1;
    });

    logger.info('${o}:', {
        o: out
    });

    mname = './' + outputHTML.replace(/\.js$/i, '');
    //兼容windows版本路径
    mname = mname.replace(/\\/g, '/');

    res.push('\r\n//tmpl file list:\r\n');
    js.forEach(function (n, i) {

        var str = modulePath + '/src/' + n;

        str = path.normalize(str).replace(/\\/gi, '/');
        str = str.replace(/.*\/([^\/]+\/src\/.+)$/, '$1');

        res.push('//' + str + '\r\n');
    });
    //模板后面的2个空行，先去掉
    //res.push('\r\n\r\n');

    res.push('define.pack("', mname, '",[],function(require, exports, module){\nvar tmpl = { ', '\n');

    js.forEach(function (n, i) {

        var reg = /<script([^<>]+?)type=["']text\/html["']([\w\W\r\n]*?)>(?:\r\n|\r|\n)?([\w\W\r\n]*?)(?:\r\n|\r|\n)?<\/script>/gmi,
            regCode = /(?:(?:\r\n|\r|\n)\s*?)?<%(=?)([\w\W\r\n]*?)%>(?:\r\n|\r|\n)?/gmi,
            isID = /id=["'](.+?)["']/i,
            noWith = /nowith=["']yes["']/i,
            exec, jscode, eq, id, tmp, code, index, len;

        logger.info('    ${m}  <--  ${n}', {n: n, m: mname});

        str = fs.readFileSync(modulePath + '/src/' + n, 'UTF-8');

        //去除utf-8文件头的BOM标记
        str = str.replace(/^[\ufeff\ufffe]/, '');
        str = str.replace(/\r\n|\r|\n/gmi, "\r\n");

        // 处理script嵌套问题
        // 核心思路就是内部的script标签都改为scr<%%>ipt这种，在执行时无区别，但是能分辨出是内部嵌套的标签
        (function () {

            var arr = [];

            str = str.replace(/(<script\b)|(\/script>)/gmi, function (curr, start, end) {

                if (start) {
                    if (arr.length) {
                        arr.push(start);
                        return '<scr<%%>ipt';
                    } else {
                        arr.push(start);
                        return curr;
                    }
                } else if (end) {

                    if (arr.length === 1) {
                        arr.length = arr.length - 1;
                        return curr;
                    } else if (arr.length > 1) {
                        arr.length = arr.length - 1;
                        return '\/scr<%%>ipt>';
                    } else {
                        return curr;
                    }
                }

                return curr;
            });

        })();

        while (exec = reg.exec(str)) {
            tmp = exec[1] + exec[2];

            if (!isID.test(tmp)) {
                continue;
            }

            id = isID.exec(tmp)[1];

            code = exec[3];

            res.push('\'', id, '\': function(data){\n\nvar __p=[],_p=function(s){__p.push(s)};\r\n');

            if (!noWith.test(tmp)) {
                res.push('with(data||{}){\r\n');
            } else {
                logger.warn('`nowith` is deprecated! path : ${path}', {
                    path: modulePath + '/src/' + n
                });
            }

            //解析模板
            index = 0;

            while (exec = regCode.exec(code)) {

                len = exec[0].length;

                if (index !== exec.index) {
                    res.push("__p.push('");
                    res.push(
                        code
                            .slice(index, exec.index)
                            .replace(/\\/gmi, "\\\\")
                            .replace(/'/gmi, "\\'")
                            .replace(/\r\n|\r|\n/gmi, "\\r\\n\\\r\n")
                    );
                    res.push("');\r\n");
                }

                index = exec.index + len;

                eq = exec[1];
                jscode = exec[2];


                if (eq) {
                    res.push('_p(');
                    res.push(jscode);
                    res.push(');\r\n');
                } else {
                    res.push(jscode);
                }

            }

            res.push("__p.push('");
            res.push(
                code
                    .slice(index)
                    .replace(/\\/gmi, "\\\\")
                    .replace(/'/gmi, "\\'")
                    .replace(/\r\n|\r|\n/gmi, "\\r\\n\\\r\n")
            );
            res.push("');\r\n");

            if (!noWith.test(tmp)) {
                res.push('\r\n}');
            }

            res.push('\r\nreturn __p.join("");\r\n}', ',\r\n\r\n');

            if (idmap[id]) {
                logger.warn('        same id: ${id}', {id: id});
            }

            idmap[id] = id;
        }

    });

    res.length--;

    res.push('\r\n};\nreturn tmpl;\r\n});\r\n');

    if (js.length) {
        if (createOut) {
            var code = res.join('').replace('.pack("./tmpl",[],', '(').replace(/\r\n|\r|\n/gmi, "\r\n");
            // UglifyJS
            if (uglify) {
                code = uglifyJS(code);
            }

            out = writeFile(out, code, packConfig.tmpl, modulePath, js);

            //补id补依赖
            cdnPath.modify(out);
        }
    } else {
        res = [];
        logger.info('${o} is empty!!!', {o: out});
    }

    return {
        res: res,
        fileList: js
    };
}


/**
 * 合并js文件
 * @param {String} seajsRoot seajs根目录
 * @param {String} modulePath 要合并的模块目录
 * @param {Object} packConfig config
 */
function createJS (seajsRoot, modulePath, packConfig) {
    packConfig = packConfig || {};

    var js = [],
        res = [],
        moduleStr = config.defaultModule,
        outputJS = config.outputJS,
        outputDir = packConfig.dir || config.outputDir,
        createOut = false,
        uglify = packConfig.uglify,
        packDependent = [],
        packDependentMap = {},
        sortRes,
        out, tmp, i, str;

    if (packConfig.js) {
        outputJS = packConfig.js.name || config.outputJS;
        createOut = packConfig.js.create;
    }

    out = modulePath + '/' + outputDir + outputJS;
    out = path.normalize(out).replace(/\\/gi, '/');

    if (outputJS && (fs.existsSync || path.existsSync)(modulePath + '/src/' + outputJS)) {
        logger.warn('.......module redefine: ${file}', {
            file: modulePath + '/src/' + outputJS
        });
    }

    js = util.getFileList(modulePath + '/src', /\.js$/i);


    if (packConfig.js && packConfig.js.sort && typeof packConfig.js.sort === 'function') {
        //自定义排序
        sortRes = packConfig.js.sort(js);
        if (sortRes) {
            js = sortRes;
        }
    } else {
        //按文件名排序
        js.sort(function (a, b) {
            return a >= b ? 1 : -1;
        });
    }

    logger.info('${o}:', {
        o: out
    });

    res.push('\r\n//js file list:\r\n');
    js.forEach(function (n, i) {

        if (packConfig.before) {//找到需要前置的js如seajs，移除
            var name = packConfig.before.name;
            if (n && name && n.indexOf(name) > -1) {
                beforeCode = fs.readFileSync(modulePath + '/src/' + n, 'UTF-8').replace(/^[\ufeff\ufffe]/, '').replace(/\r\n|\r|\n/gmi, "\r\n");
                js.splice(i, 1);
            }
        } else {
            var str = modulePath + '/src/' + n;

            str = path.normalize(str).replace(/\\/gi, '/');
            str = str.replace(/.*\/([^\/]+\/src\/.+)$/, '$1');

            res.push('//' + str + '\r\n');
        }

    });

    var beforeJS = config.beforeJS.replace(/^[\ufeff\ufffe]/, '').replace(/\r\n|\r|\n/gmi, "\r\n");
    if (!!beforeJS) {
        res.push(config.beforeJS);
    }

    //exclude packing module
    js.forEach(function (n, i) {

        var mname = './' + n.replace(/\.js$/i, '').replace(/[\/\\]/gmi, '.'),
            dependent = [],
            dependentMap = {};

        //兼容windows版本
        mname = mname.replace(/\\/g, '/');

        packDependentMap[mname] = true;
        packDependentMap[mname + '.js'] = true;
    });

    js.forEach(function (n, i) {

        var mname = './' + n.replace(/\.js$/i, '').replace(/[\/\\]/gmi, '.'),
            dependent = [],
            dependentMap = {};

        //兼容windows版本
        mname = mname.replace(/\\/g, '/');
        logger.info('    ${m}  <--  ${n}', {n: n, m: mname});

        str = fs.readFileSync(modulePath + '/src/' + n, 'UTF-8');

        //去除utf-8文件头的BOM标记
        str = str.replace(/^[\ufeff\ufffe]/, '');
        str = str.replace(/\r\n|\r|\n/gmi, "\r\n");

        //扫描依赖关系
        removeComments(str).replace(/[^.]\brequire\s*\(\s*['"]?([^'")]*)/g, function ($0, id) {
            var key = id.split('?')[0];

            if (!dependentMap[key]) {
                dependent.push(id);
                dependentMap[key] = true;
            }
            if (!packDependentMap[key]) {
                packDependent.push(id);
                packDependentMap[key] = true;
            }
        });

        str = str.replace(/(define\()[\W]*?(function)/gm, 'define.pack("' + mname + '",' + JSON.stringify(dependent) + ',$2');

        res.push(str);
    });

    var afterJS = config.afterJS.replace(/^[\ufeff\ufffe]/, '').replace(/\r\n|\r|\n/gmi, "\r\n");
    if (!!afterJS) {
        res.push(config.afterJS);
    }

    moduleStr = moduleStr.replace('define\x28function', 'define\x28' + JSON.stringify(packDependent) + ',function');

    var finalCode = moduleStr + res.join('');

    if (js.length) {
        if (createOut) {
            finalCode = finalCode.replace(/\r\n|\r|\n/gmi, "\r\n");
            // UglifyJS
            if (uglify) {
                finalCode = uglifyJS(finalCode);
            }

            out = writeFile(out, finalCode, packConfig.js, modulePath, js);

            //补id补依赖
            cdnPath.modify(out);
        }
    } else {
        logger.info('${o} is empty!!!', {o: out});
    }

    return {
        res: res,
        fileList: js,
        packDependent: packDependent
    };
}


/**
 * 写入文件
 * @param {String} out 文件写入的路径
 * @param {String} code 代码
 * @param {Object} config packConfig.all | packConfig.js | packConfig.tmpl
 * @param {String} modulePath
 * @param {String[]} files 文件列表
 */
function writeFile(out, code, config, modulePath, files) {

    // 使用打包时间作为版本号
    if (config && config.versionControll && config.versionControllKey) {

        var baseName = path.basename(out),
            outDir = path.dirname(out),
            verReg = /(\.r\w+)?(\.js)$/,
            isCustomVer = !!config.ver,
            // 文件md5
            hash = crypto.createHash('md5').update(code).digest('hex'),
            // 新文件名
            newName = [  // index.r20130912000000.js
                baseName.replace(verReg, ''),  //  index.js -> index
                '.r',
                isCustomVer ? config.ver : hash,
                '.js'
            ].join('');


        // 清理旧文件 (index.r20130912000000.js or index.js)
        fs.readdirSync(outDir).forEach(function (n, i) {
            if ((n.replace(verReg, '') + '.js') === baseName) {
                logger.info('Replaced: ' + outDir + path.sep + n + ' -> ' + newName);
                fs.unlinkSync(outDir + path.sep + n);
            }
        });

        // 生成新文件
        out = outDir + path.sep + newName;

        // 更新文件引用
        if (config.versionControll.length) {
            config.versionControll.forEach(function (refFile, i) {
                var indexfile, tempfile;
                try {
                    tempfile = path.normalize(outDir + path.sep + refFile);
                    indexfile = fs.readFileSync(tempfile, 'utf-8');
                } catch (e) {
                    tempfile = path.normalize(outDir + path.sep + refFile.replace('\.\.\/', ''));
                    indexfile = fs.readFileSync(tempfile, 'utf-8');
                }
                refFile = tempfile;
                var reg = new RegExp("('" + config.versionControllKey + '\'\\s*:\\s*\')[^\']*(\')');
                indexfile = indexfile.replace(reg, '$1' + newName + '$2');
                fs.writeFileSync(refFile, indexfile);
            });
        }
    }

    // 最终写入文件
    fs.writeFileSync(out, code, 'UTF-8');

    return out;
}

/**
 * UglifyJs 压缩文件
 */
function uglifyJS(code) {
    var rst = UglifyJS.minify(code, {
        fromString: true
    });
    return rst.code;
}



