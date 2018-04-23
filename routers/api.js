var express=require('express')
var router=express.Router();
var User=require('../models/User')

//统一返回格式
var responseData;
router.use(function(req,res,next){
    responseData={
        code:0,
        message:''
    }
    next();
})
/*
* 用户注册
*   注册逻辑
*   1.用户名不能为空
*   2.密码不能为空
*   3.两次密码不能一样
*
*   1.用户名已经被注册了
*       数据库查询
* */
router.post('/user/register',function(req,res,next){
    var username=req.body.username;
    var passwpord=req.body.password;
    var repassword=req.body.repassword;
    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空';
        res.json(responseData);
        return;
    }
    if(passwpord==''){
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData);
        return;
    }
    if(passwpord!=repassword){
        responseData.code=3;
        responseData.message='两次密码不一致';
        res.json(responseData);
        return;
    }

    User.findOne({
        username:username
    }).then(function(userInfo){
        console.log(userInfo);
        if(userInfo){
            responseData.code=4;
            responseData.message='该用户名已经被注册';
            res.json(responseData);
            return;
        }
        //保存到数据库中
        var user=new User({
            username:username,
            password:passwpord
        });
        return user.save();
    }).then(function(newUserInfo){
        responseData.message='注册成功';
        res.json(responseData);
    })
    responseData.message='注册成功';
    res.json(responseData);
})

/*
* 登录逻辑
* */
router.post('/user/login',function(req,res,next){
    var username=req.body.username;
    var password=req.body.password;

    if(username==""||password==''){
        responseData.code=1;
        responseData.message='用户名和密码不能为空！';
        res.json(responseData);
        return;
    }

    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code=2;
            responseData.message='用户名或者密码错误！';
            res.json(responseData);
            return;
        }

        responseData.message='登录成功';
        responseData.info={
            _id:userInfo._id,
            username:userInfo.username
        }
        req.cookies.set("userInfo",JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
        return;
    })
})

router.get('/user/logout',function(req,res,next){
    req.cookies.set("userInfo",null);
    res.json(responseData);
    return;
})

module.exports=router;