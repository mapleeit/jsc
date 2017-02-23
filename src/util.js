var	fs	= require("fs"),
	config	= require('./config.js');

/**
 * 
 * 递归读取一个目录下所有文件
 * @param {String} root 开始目录
 * @param filter Regex过滤器
 * @param {String} base
 * @param {Array} res
 */
this.getFileList = function(root, filter, base, res){
	res		= res || [];
	base	= base || '';
	filter	= filter || /.*/;

	var that	= this,
		tmp,
		stat;
	
	tmp = fs.readdirSync(root);
	
	tmp.forEach(function(n){
		try{
			stat = fs.statSync(root + '/' + n);
			if(stat.isFile()){
				if(filter.test(n) && n !== '_config.js' && !config.excludeFile.test(n)){
					res.push(base + n);
				}
			}else if(stat.isDirectory()){
				if (!config.excludeFolder.test(n)) {
					that.getFileList(root + '/' + n, filter, base + n + '/', res);
				}
			}
		}catch(e){
			
		}
	});
	
	return res;
};


/**
 * 
 * 递归读取一个目录下所有目录
 * @param {String} root 开始目录
 * @param exclude Regex过滤器
 * @param {String} base
 * @param {Array} res
 */
this.getFolderList = function(root, exclude, base, res){
	res		= res || [root];
	base	= base || '';
	exclude	= exclude || /.*/;

	var that	= this,
		tmp,
		stat;
	
	tmp = fs.readdirSync(root);

	tmp.forEach(function(n){
		try{
			stat = fs.statSync(root + '/' + n);
			
			if(stat.isDirectory()){
				if(!exclude.test(n)){
					res.push(root + '/' + n);
					that.getFolderList(root + '/' + n, exclude, base + n + '/', res);
				}
			}
		}catch(e){
			
		}
		
	});
	
	return res;
};


