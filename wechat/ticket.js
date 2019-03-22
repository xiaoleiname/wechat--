
const rp = require('request-promise-native');
const  fetchAccessToken = require('./access-token');
const { writeFileAsync, readFileAsync } = require('../utils/tools');


async function getTicket() {
    const { access_token } = await fetchAccessToken();
    // 定义请求地址
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
    // 发送请求
    // 下载了 request request-promise-native
    const result = await rp({method: 'GET', url, json: true});
    // 设置过期时间 2小时更新，提前5分钟刷新
    result.expires_in = Date.now() + 7200000 - 300000;
    const ticket = {
        ticket: result.ticket,
        expires_in: result.expires_in
    }
    // 保存为一个文件 ---> 只能保存字符串数据，将js对象转换为json字符串
    await writeFileAsync('./ticket.txt', ticket);
    return ticket;
}

function fetchTicket() {
    return readFileAsync('./ticket.txt')
    // 内部箭头函数的返回值 就是 then / catch函数的返回值
    // 返回值如果是promise， 就不处理， 如果不是， 就会包一层promise返回
        .then(res => {
            // 判断有没有过期
            if (res.expires_in < Date.now()) {
                // 过期了
                return getTicket();
            } else {
                // 没有过期
                return res;
            }
        })
        .catch(err => {
            // 正常错误
            return getTicket();
        })
}





(async () =>{
    const result = await fetchTicket();
    console.log(result);
})()

module.exports =fetchTicket();