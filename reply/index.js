/*
  中间件函数模块
 */
const sha1 = require('sha1');
const { getUserDataAsync, parseXMLData, formatJsData } = require('../utils/tools');
const template = require('./template');

module.exports = () => {
  
  return async (req, res) => {
    //微信服务器发送过来的请求参数
    const { signature, echostr, timestamp, nonce } = req.query;
    const token = 'atguiguHTML1128';
    //通过微信签名算法加密出来微信签名
    const sha1Str = sha1([token, timestamp, nonce].sort().join(''));
  
    if (req.method === 'GET') {
      // 处理验证服务器消息有效性
      if (sha1Str === signature) {
        // 说明消息来自于微信服务器
        res.end(echostr);
      } else {
        // 说明消息不是微信服务器
        res.end('error');
      }
    } else if (req.method === 'POST') {
      // 处理用户发送过来的消息
      // 过滤掉不是微信服务器发送过来的消息
      if (sha1Str !== signature) {
        res.end('error');
        return;
      }
      // 获取到了用户发送过来的消息
      const xmlData = await getUserDataAsync(req);
      // 将xml数据转换成js对象
      const jsData = parseXMLData(xmlData);
      // 格式化jsData
      const userData = formatJsData(jsData);
    
      // 实现自动回复
      let options = {
        toUserName: userData.FromUserName,
        fromUserName: userData.ToUserName,
        createTime: Date.now(),
        type: 'text',
        content: '天啊，女神！！！'
      }
    
      if (userData.Content === '1') {
        options.content = '大吉大利，今晚带你吃鸡';
      } else if (userData.Content && userData.Content.indexOf('2') !== -1) {
        options.content = '美少女杀手，撩妹狂魔';
      }
      
      if (userData.MsgType === 'image') {
        //将用户发送的图片，返回回去
        options.mediaId = userData.MediaId;
        options.type = 'image';
      }
      
    
      const replyMessage = template(options);
      console.log(replyMessage);
    
      // 返回响应
      res.send(replyMessage);
    
    } else {
      res.end('error');
    }
  
  }
}