var express=require('express')
var router=express.Router();
//User
var User=require('../models/User');
var Category=require('../models/Category')

router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        //如果当前用户是非管理员，处理
        res.send('对不起，你不是管理员，没有权限')
        return;
    }
    next();
});

router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});

//增加用户管理路由
router.get('/user',function(req,res){
    // * 从数据库里读取信息
    var page=Number(req.query.page||1);
    var limit =10;
    var pages=0;

    User.count().then(function(count){
        pages=Math.ceil(count/limit);
        page=Math.min(page,pages);
        page=Math.max(page,1);
        var skip=(page-1)*limit;

        User.find().limit(limit).skip(skip).then(function(user){
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                user:user,

                pages:pages,
                count:count,
                limit:limit,
                page:page
            });
        })
    })

})

/*
* 分类添加路由
* */
router.get('/category/add',function(req,res){
    res.render('admin/categoriese_add',{
        userInfo:req.userInfo
    });
});
router.post('/category/add',function(req,res){
    var name=req.body.name||"";

    if(name==""){
        res.render('admin/err',{
            userInfo:req.userInfo,
            messege:'分类名称不能为空',
            url:"",
            type:"alert-warning"
        })
        return;
    }

    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            res.render('admin/err',{
                userInfo:req.userInfo,
                messege:'分类已经存在',
                url:"",
                type:"alert-danger"
            })
        }else{
            var newC= new Category({
                name:name
            });
            newC.save().then(function(newCategory){
                res.render('admin/err',{
                    userInfo:req.userInfo,
                    messege:'保存成功',
                    url:"",
                    type:"alert-success"
                })
            });
        }
    })
})

/*
* 页面展示路由
* */
router.get('/category/show',function(req,res){
    // 从数据库里读取信息
    var page=Number(req.query.page||1);
    var limit =3;
    var pages=0;

    Category.count().then(function(count){
        pages=Math.ceil(count/limit);
        page=Math.min(page,pages);
        page=Math.max(page,1);
        var skip=(page-1)*limit;

        User.find().limit(limit).skip(skip).then(function(category){
            res.render('admin/categoriese_show',{
                userInfo:req.userInfo,
                category:category,

                pages:pages,
                count:count,
                limit:limit,
                page:page
            });
        })
    })
});
module.exports=router;