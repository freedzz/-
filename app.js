/* 引入express模板 */
var  express = require('express');

/* 引入自定义模块 */
var control = require('./control/control')

/* 实例化express对象 */
var app = new express();

/* 把APP对象传回control */
control(app);

/* 设置ejs模板引擎 */
app.set('view engine','ejs');

/* 设置服务器访问静态文件 */
app.use('/public',express.static('public'));

/* 设置 */


/* 监听端口 */

app.listen(8080);


console.log("********服务器运行中********");