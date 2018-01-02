const sql = require('mysql');
var pool = sql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'wangweijun',
  database : 'user'
});
module.exports = {
  // 查询
  query:function (sqls,callback){
      pool.getConnection(function(err,conn){
          if(err){
              callback(err,null,null);
          }else{
              conn.query('select * from user where ' + sqls.name + '="'+sqls.ser+'"',function(qerr,vals,fields){
                  //释放连接
                  conn.release();
                  //事件驱动回调
                  callback(qerr,vals,fields);
              });
          }
      });
  },
  // 查询记录
  queryTime: function(sqls,callback){
    pool.getConnection(function(err,conn){
      if(err){
        callback(err,null.null)
      }else{
        conn.query('SELECT * FROM journal WHERE TIME = "'+ sqls.time +'" AND uid = '+ sqls.uid +'',function(qerr,vals,fields){
                  //释放连接
                  conn.release();
                  //事件驱动回调
                  callback(qerr,vals,fields);
        })
      }
    })
  },
  // 添加用户
  add:function (sqls,callback){
      pool.getConnection(function(err,conn){
          if(err){
              callback(err,null,null);
          }else{
              conn.query('insert into user ('+ sqls.name +','+ sqls.account +','+ sqls.password +') VALUES ("' + sqls.vala + '","' + sqls.valb + '","' + sqls.valc + '")',function(qerr,vals,fields){
                  //释放连接
                  conn.release();
                  //事件驱动回调
                  callback(qerr,vals,fields);
              });
          }
      });
  },
  // 添加信息
  addMsg:function (sqls,callback){
      pool.getConnection(function(err,conn){
          if(err){
              callback(err,null,null);
          }else{
              conn.query('insert into journal (uid,time,msg) VALUES ("' + sqls.uid + '","' + sqls.time + '","' + sqls.msg + '")',function(qerr,vals,fields){
                  //释放连接
                  conn.release();
                  //事件驱动回调
                  callback(qerr,vals,fields);
              });
          }
      });
  },
  // 对比
  find:function (sqls,callback){
      pool.getConnection(function(err,conn){
          if(err){
              callback(err,null,null);
          }else{
              conn.query('insert into user ('+ sqls.name +','+ sqls.account +','+ sqls.password +') VALUES ("' + sqls.vala + '","' + sqls.valb + '","' + sqls.valc + '")',function(qerr,vals,fields){
                  //释放连接
                    conn.release();
                  //事件驱动回调
                  callback(qerr,vals,fields);
              });
          }
      });
  }
}
