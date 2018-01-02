const express = require('express');
var session = require('express-session');
const app = express();
const multer = require('multer');
var qs = require("./mysql.js");
// 规定目录
var upload = multer({
    dest: './img'
});
// 托管静态资源
app.use('/static', express.static('public'));
// 创建session
app.use(session({
////这里的name值得是cookie的name，默认cookie的name是：connect.sid
  //name: 'hhw',
  secret: 'keyboard cat',
  cookie: ('name', 'value', { path: '/', httpOnly: true,secure: false, maxAge:  600000 }),
  //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
  resave: true,
  //强制“未初始化”的会话保存到存储。
  saveUninitialized: true,

}))

// 只需要用express app的use方法将session挂载在‘/’路径即可，这样所有的路由都可以访问到session。
//可以给要挂载的session传递不同的option参数，来控制session的不同特性
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // if(/in/.test(req.originalUrl) || /login/.test(req.originalUrl)){
    next();
  // }

});

// 登录接口
app.all("/api/login", function (req,res,next) {
  if(req.query.user != undefined && req.query.password != undefined ){
    qs.query({name:'account',ser:req.query.user},function(err,vals,fields){
      if(vals.length == 0){
        res.json({info:'没有该用户',status:0})
      }else{
          if(vals[0].password == req.query.password) {
            var sess = req.session//用这个属性获取session中保存的数据，而且返回的JSON数据
            sess.views = vals[0].account;
            res.json({info:{name:vals[0].name},status:2,msg:"校验成功"})
          }else{
            res.json({info:'查询错误',status:0})
          }
      }
    });
    }
  })

// 增加日志
app.all("/api/journal", function (req,res,next) {
  qs.query({name:'account',ser:req.session.views},function(err,vals,fields){
      if(vals.length == 1){
         qs.addMsg({uid:vals[0].id,time:req.query.time,msg:req.query.msg},function(err,vals,fields){
           res.json({info:"增加成功",status:2});
          console.log(vals)
        })
      }else{
        res.json({info:"查无此用户",status:0})
      }
    });
})
// 查询日志
app.all("/api/look", function (req,res,next) {
  console.log(req.query.time)
  qs.query({name:'account',ser:req.session.views},function(err,vals,fields){
      if(vals.length == 1){
         qs.queryTime({uid:vals[0].id,time:req.query.time},function(err,vals,fields){
          if(vals.length > 0){
            res.json({info:vals,status:2})
          }else{
            res.json({info:"暂无信息",status:0})
          }
        })
      }else{
        res.json({info:"查无此用户",status:0})
      }
    });
})

// 注册
app.all("/api/brs", function (req,res,next) {
  // next();
  if(req.query.name != undefined && req.query.password != undefined ){
    qs.query({name:'account',ser:req.query.user},function(err,vals,fields){
      console.log(vals)
      if(vals.length == 0){
        qs.add({name:'name',account:'account',password:'password',vala:req.query.name,valb:req.query.user,valc:req.query.password},function(err,vals,fields){
          console.log(vals)
          console.log(err)
          res.json({info:'注册成功',status:2})
        })
      }else{
          res.json({info:'已有该用户',status:0})
      }
    });
    }
})
// 记录
app.all("/api/msg", function (req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // next();
  if(req.query.msg != undefined){
    qs.query({name:'msg',ser:req.query.msg},function(err,vals,fields){
    });
    }
})
// -----------------------------------   访问页面
app.all("/api/user", function (req,res,next) {
  res.sendfile('./inde.html');
})
// 登录页
app.all("/api/in", function (req,res,next) {
  res.sendfile('in.html');
})

app.all("/api/los", function (req,res,next) {
  res.sendfile('los.html');
})

app.all("/api/join", function (req,res,next) {
  if(req.session.views == undefined){
    res.sendfile('in.html');
  }else{
    res.sendfile('join.html');
  }
})

const server = app.listen(3000,function(){
  var host = server.address().address;
  var port = server.address().port
})
