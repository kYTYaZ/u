const fs = require('fs-extra');
const path = require('path');
const rp = require('request-promise');
const inFileUrl = path.join(__dirname, './urls.txt');
const outFileUrl = path.join(__dirname, './result.txt');
const cookie = `cna=iwRzFKDVFzACASp4Sm8rC4zx; JSESSIONID=F073418D02DD93DF01B4E9AA2410F07C; WDKSESSID=XijmATfoS710ERVTpA7heJzOAqc; WDKSESSID=XijmATfoS710ERVTpA7heJzOAqc; WDK_SECRET=d5beca2ec9777bb2705f05ab4e40d058; WDK_UA=09368A7B22FB5BBFE9B932117BB6936B; WDK_WAREHOUSE_CODE=33571004; isg=BNDQjKlEv7-cdGOBABDjNSfjoRg8n5cHmseatsqhnCv-BXCvcqmEcyYz2I1A8my7`;

async function main() {
    const urls = await fs.readFile(inFileUrl);
    // console.log('urls', urls.toString());
    return parseUrls(urls.toString());
}

function unique(array) {
    // res用来存储结果
    const res = [];
    for (let i = 0, arrayLen = array.length; i < arrayLen; i++) {
        let j;
        let resLen;
        for (j = 0, resLen = res.length; j < resLen; j++) {
            if (array[i] === res[j]) {
                break;
            }
        }
        // 如果array[i]是唯一的，那么执行完循环，j等于resLen
        if (j === resLen) {
            res.push(array[i]);
        }
    }
    return res;
}

async function parseUrls(urls) {
    urls = urls.split(/\n/);
    urls = unique(urls);
    const value = {};
    const otherUrls = [];
    const proms = [];
    const promsV = [];
    urls.forEach((v) => {
        if (!v)
            return;
        if (v.includes('portal.hemaos.com') || v.includes('portalpro')) {
            proms.push(htmlType(v));
            promsV.push(v);
        } else {
            otherUrls.push(v);
        }
    });
    const result = await Promise.all(proms);
    result.forEach((type, index) => {
        if (value[type])
            value[type].push(promsV[index]);
        else
            value[type] = [promsV[index]];
        // console.log(type, value[type].length);
    });
    await fs.writeFile(outFileUrl, ` \n \n >>>>> ${new Date().toLocaleDateString()} <<< \n \n`);
    console.log('总数', urls.length);
    for (const key in value) {
        console.log(key, value[key].length);
        await fs.appendFile(outFileUrl, ` \n \n >>>>> ${key} <<< \n \n`);
        await fs.appendFile(outFileUrl, `${value[key].length} 个\n`);
        await fs.appendFile(outFileUrl, value[key].sort().join('\n'));
    }
    console.log('otherUrls', otherUrls.length);
    await fs.appendFile(outFileUrl, `\n \n >>>>> otherUrls <<< \n `);
    await fs.appendFile(outFileUrl, `${otherUrls.length} 个\n`);
    await fs.appendFile(outFileUrl, otherUrls.sort().join('\n'));

    // console.log(value);
}

function htmlType(uri) {
    const options = {
        uri,
        headers: {
            cookie,
        },
    };
    return rp(options)
        .then((html) => {
            if (html.includes('/delivery/')) {
                return 'delivery';
            } else if (html.includes('/data-visualization/')) {
                return 'data-visualization';
            } else if (html.includes('/web-pages/')) {
                return 'web-pages';
            } else if (html.includes('/wdk-h5-react-mext/')) {
                return '/wdk-h5-react-mext';
            } else if (html.includes('/wdk-f2e-open/')) {
                return '/wdk-f2e-open/';
            } else if (/\/wdk-frontend-release\/([0-9a-zA-Z-]*)\/'/.test(html)) {
                const reg = /\/wdk-frontend-release\/([0-9a-zA-Z-]*)\/'/;
                const arr = reg.exec(html);
                return arr[1];
            } else {
                return 'other-no-wdk-frontend';
            }
        }).catch((e) => {
            console.error('请求出错 %o %o', options.uri, e.message);
            return 'error';
        });
}

main();
