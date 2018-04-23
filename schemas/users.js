var mongoose=require('mongoose');

module.exports=new mongoose.Schema({
    username:String,
    password:String ,
    // 管理员属性
    isAdmin:{
        type: Boolean,
        default:false
    }
})