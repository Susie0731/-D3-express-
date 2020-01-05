const express = require('express'); //express框架模块
const path = require('path'); //系统路径模块
const app = express();

const hostName = '127.0.0.1'; //ip
const port = 8080; //端口

app.use(express.static(path.join(__dirname, 'public'))); //指定静态文件目录

app.listen(port, hostName, function() {
    console.log(`服务器运行在http://${hostName}:${port}`);
});

app.get('/hello', function (req, res) {
    res.send('Hello World');
 })

var mysql  = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'airpollution'
});
 
connection.connect();
 
// 添加用户
app.get('/all_values', function(req, res, next){
    // 从连接池获取连接 
    var  sql = 'SELECT * FROM all_values';
    //查
    connection.query(sql,function (err, all_values) {
            if(err){
              console.log('[SELECT ERROR] - ',err.message);
              return;
            }
            console.log(all_values);
            res.send(all_values);
            return all_values;
    });
    });

    
// connection.end();