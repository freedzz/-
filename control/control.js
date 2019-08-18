//引入解析插件
var bodyParser = require('body-parser');

//对数据进行解析
var urlencodeParser = bodyParser.urlencoded({
	extended: false
});
//引入数据库
var MongoClient = require('mongodb').MongoClient;

//连接数据库
var url = 'mongodb://localhost:27017/';
var dbase;

/* MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("blog");
    var whereStr = {"user":'xiaohan'};  // 查询条件
    var updateStr = {$push: { "reply" : {"username":"xiaohan","time":"2019-08-18","context":"更新成功了吗！"} }};
    dbo.collection("site").updateOne(whereStr, updateStr, function(err, res) {
        if (err) throw err;
        console.log("文档更新成功");
        db.close();
    });
}); */


module.exports = function(app) {

	/* 登录界面 */
	app.get('/login', function(req, res) {
		res.render('login');
	});
	/* 处理登录界面返回的数据 */
	app.post('/login', urlencodeParser, function(req, res) {
		//连接数据库
		MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
			if (err) throw err;
			dbase = db.db("blog");
			var whereStr = {"user": req.body.user}; // 查询条件
			dbase.collection("site").find(whereStr).toArray(function(err, result) {
				if (err) throw err;
				res.send(req.body.user);
				db.close();
			});
		});
	})

	/* 注册界面 */
	app.get('/register', function(req, res) {
		res.render('register');
	});
	/* 对注册见面发送回来的请求进行处理 */
	app.post('/register', urlencodeParser, function(req, res) {
		//设置结构
		var data = {
			user: req.body.username,
			imgurl: '',
			title: '',
			time: '',
			reply: [{
				user: '',
				context: '',
				replyTime: ''
			}, ]
		}
		//添加数据
		//使用数据库
		MongoClient.connect(url, {
			useNewUrlParser: true
		}, function(err, db) {
			if (err) throw err;
			console.log('数据库已连接');
			dbase = db.db("blog");
			dbase.collection("site").insertOne(data, function(err, res) {
				if (err) throw err;
				console.log("插入数据成功");
				db.close();
			});
		});
		//返回数据
		res.json(data);
	})


	/* 主界面 */
	app.get('/blog', function(req, res) {
		//连接数据库
		MongoClient.connect(url, {
			useNewUrlParser: true
		}, function(err, db) {
			if (err) throw err;
			dbase = db.db("blog");
			dbase.collection("site").find({}).toArray(function(err, result) { // 返回集合中所有数据
				if (err) throw err;
				res.render('blog', {
					datas: result
				});
				db.close();
			});
		});
	});

	/* 对从主页返回的数据进行处理 */
	app.post('/blog/reply', urlencodeParser, function(req, res) {
		/* 得到评论然后添加到指定的用户下面 */
		/* 找到要评论的楼主 */
		var replys = {
			"user": req.body.user,
			"context": req.body.context,
			"replyTime": req.body.replyTime
		}
		//连接数据库
		MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
			if (err) throw err;
			var dbo = db.db("blog");
			var whereStr = {"time": req.body.time}; // 查询条件
			var updateStr = {$push: {"reply": replys}};//插入数据
			dbo.collection("site").updateOne(whereStr, updateStr, function(err, res) {
				if (err) throw err;
				console.log("文档更新成功");
				db.close();
			});
			res.send("成功")
		});

	});
	/* 发布blog */
	app.post('/blog/title', urlencodeParser, function(req, res) {
		//设置结构
		var data = {
			user: req.body.username,
			imgurl: '',
			title: req.body.title,
			time: req.body.time,
			reply: [{
				user: '',
				context: '',
				replyTime: ''
			}, ]
		}
		//使用数据库
		MongoClient.connect(url, {
			useNewUrlParser: true
		}, function(err, db) {
			if (err) throw err;
			console.log('数据库已连接');
			dbase = db.db("blog");
			dbase.collection("site").insertOne(data, function(err, res) {
				if (err) throw err;
				console.log("插入数据成功");
				db.close();
			});
		});
		res.send("成功")
	})



}
