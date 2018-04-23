var express = require('express');
var swig = require('swig');
var mongoose=require('mongoose');
// 加载bodyparse，获取前端的post提交的数据
var bodyParser=require('body-parser');
//加载cookies模板
var cookies=require("cookies");
// 加载出user模块内容
var User=require('./models/User')
var app=express();

app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
app.use('/public',express.static(__dirname+'/public'));
//bodyparse设置
app.use(bodyParser.urlencoded({extended:true}));
// cookies设置
app.use(function(req,res,next){
    req.cookies=new cookies(req,res);

    req.userInfo={};
    if(req.cookies.get("userInfo")){
        try{
            req.userInfo=JSON.parse(req.cookies.get("userInfo"));

            //获取当前用户信息，是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                next();
            })
        }catch (e){
            next();
        }
    }
    else {
        next();
    }
});
//分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
//开发过程中
swig.setDefaults({cache:false});
mongoose.connect('mongodb://localhost:27017/blog',function(err){
    if(err){
        console.log(err);
    }else{
        console.log("数据库连接成功");
        app.listen(8080);
    }
});
/*
* 通过app.get（）或者post吧url路径和多个函数进行绑定
* pa1:路径
* pa2：function(req,res,next)
* */
/*
app.get('/',function(req,res,next){
    // res.send('<h1>实现</h1>');
    /!*
    * 读取目录下指定文件，解析并且返回给客户端
    * 传递给模板的数据
    * *!/
    res.render('index');
})*/

