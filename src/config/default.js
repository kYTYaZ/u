module.exports = {
    name: 'uron',
    keys: ['xxxxxxx','aaaaaaaa','bbbbbbbbbb'], // 会赋值给 app.keys,作为加密 cookie 的 key。
    private: {
        name: process.env.private_name,
        pass: process.env.private_pass,
    },
    proxyParams: {
        name: undefined,
        target: undefined,
        Referer: undefined,
    },
    client: {},
    vueAutoEditor: 'code',
    sessionKey: 'uron',
    sessionSecret: 'session',
};
