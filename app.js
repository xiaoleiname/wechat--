const express = require('express');
const sha1 = require('sha1');

const app = express();


app.use( (req, res) =>{
    //微信服务器发送过来的请求参数
    console.log(req.query);
    /*
     { signature: 'efd377ff6ad1a1d57accc6d1848f1c7b9b9077f2',   微信加密签名
     echostr: '4809389192886745081', 微信后台生成的随机字符串
     timestamp: '1552966105',  微信后台发送请求的时间戳
     nonce: '1780047115' }     微信后台生成的随机数字
     */
    const { signature, echostr, timestamp, nonce } = req.query;
    const token = 'atguiguHTML1128';
    // 1）将token、timestamp、nonce三个参数进行字典序排序
    const sortedArr = [token, timestamp, nonce].sort();
     console.log(sortedArr);
    // 2）将三个参数字符串拼接成一个字符串进行sha1加密
    const sha1Str = sha1(sortedArr.join(''));
     console.log(sha1Str);


        // if (req.method === 'GET') {
            // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
            if (sha1Str === signature) {
                // 说明消息来自于微信服务器
                res.end(echostr);
            } else {
                // 说明消息不是微信服务器
                res.end('error');
            }
    //     }  else if(req.method === 'GET'){
    //         //用户发送过来的消息
    //        // console.log(req.body);
    //
    // req.on('data',data =>{
    //     console.log(data.toString())
    // })
    //
    //     }else {
    //         res.end('error')
    //     }

    })



app.listen(3000,err =>{
    if(!err) console.log('服务器启动成功了~');
    else console.log(err);
})
