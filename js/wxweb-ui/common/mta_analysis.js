//application id got from MTAMTA analysis
var MTA_APP_ID = '500384140'; //常规统计id
var MTA_EVENT_ID = '500384150'; //自定义事件id
//data report remote address
var MTA_API_BASE = 'https://pingtas.qq.com/pingd';
//MTA wechat apps analysis storage key prefix
var MTA_VAR_PREFIX = '_mta_';

function getNetworkType(a){wx.getNetworkType({success:function(b){a(b.networkType)}})}function getSystemInfo(){var a=wx.getSystemInfoSync();return{adt:a.model,scl:a.pixelRatio,scr:a.windowWidth+"x"+a.windowHeight,lg:a.language,fl:a.version}}function getUID(){try{return wx.getStorageSync(MTA_VAR_PREFIX+"auid")}catch(a){}}function setUID(){try{var a=getRandom();wx.setStorageSync(MTA_VAR_PREFIX+"auid",a);return a}catch(b){}}
function getSID(){try{return wx.getStorageSync(MTA_VAR_PREFIX+"ssid")}catch(a){}}function setSID(){try{var a="s"+getRandom();wx.setStorageSync(MTA_VAR_PREFIX+"ssid",a);return a}catch(b){}}function getRandom(a){return(a||"")+Math.round(2147483647*(Math.random()||.5))*+new Date%1E10}function getPagePath(){try{var a=getCurrentPages(),b="/";0<a.length&&(b=a.pop().__route__);return b}catch(e){console.log("get current page path error:"+e)}}
function getMainInfo(){var a={dm:"wechat.apps.xx",url:getPagePath(),pvi:"",si:"",ty:2};a.pvi=function(){var b=getUID();b||(a.ty=1,b=setUID());return b}();a.si=function(){var a=getSID();a||(a=setSID());return a}();return a}function getBasicInfo(){var a=getSystemInfo();getNetworkType(function(a){wx.setStorageSync(MTA_VAR_PREFIX+"ntdata",a)});a.ct=wx.getStorageSync(MTA_VAR_PREFIX+"ntdata")||"4g";return a}function getExtentInfo(){return{r2:MTA_APP_ID,r4:"wx"}}
module.exports={initLaunch:function(){setSID()},rptMain:function(){if(""!=MTA_APP_ID){for(var a=[],b=0,e=[getMainInfo(),getBasicInfo(),getExtentInfo(),{random:+new Date}],d=e.length;b<d;b++)for(var f in e[b])e[b].hasOwnProperty(f)&&a.push(f+"="+(e[b][f]||""));wx.request({url:MTA_API_BASE+"?"+a.join("&").toLowerCase()})}},eventStat:function(a,b){if(""!=MTA_EVENT_ID){var e=[],d=getMainInfo(),f=getExtentInfo();d.dm="wxapps.click";d.url=a;f.r2=MTA_EVENT_ID;var c;c="undefined"===typeof b?{}:b;var k=[],
g;for(g in c)c.hasOwnProperty(g)&&k.push(g+"="+c[g]);c=k.join(";");f.r5=c;c=0;d=[d,getBasicInfo(),f,{random:+new Date}];for(f=d.length;c<f;c++)for(var h in d[c])d[c].hasOwnProperty(h)&&e.push(h+"="+(d[c][h]||""));wx.request({url:MTA_API_BASE+"?"+e.join("&").toLowerCase()})}}};