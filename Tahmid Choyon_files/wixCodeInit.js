define("wixCodeInit/utils/urlBuilder",[],function(){"use strict";function a(){for(var a=arguments[0],b=1;b<arguments.length;++b)a=a.replace(/\/$/,"")+"/"+arguments[b].replace(/^\//,"");return a}function b(a){return/^https?:\/\/localhost\/?$/.test(a)}function c(a){return/^\d+\.\d+\.\d+$/.test(a)}function d(a,b){var d=a.lastIndexOf("/");return c(b)?a.substring(0,d+1)+b:a}function e(a,c){var e=a.serviceTopology,f=b(a.santaBase)?e.scriptsLocationMap.santa:a.santaBase;return f=d(f,c),f.replace(e.scriptsDomainUrl,"")}function f(b,c,d,f){var g=c.extensionId,h="//"+g+".",i=b.serviceTopology.wixCloudBaseDomain,j=d?"index.debug.html":"index.html",k="static/wixcode/target/"+j,l=e(b,f);return h+a(i,"_static",l,k)}function g(a){return Object.keys(a).map(function(b){return encodeURIComponent(b)+"="+encodeURIComponent(a[b])}).join("&")}function h(a,b,c){c=c||{};var d=f(a,b,c.debug,c.runtimeSource),e=!!a.publicModel,h={compId:"wixCode_"+b.appDefinitionId,deviceType:c.isMobileView?"mobile":"desktop",viewMode:e?"site":a.renderFlags.componentViewMode||"preview",instance:b.instance,locale:a.rendererModel.languageCode,cacheKiller:(new Date).getTime().toString(),codeVersion:e?a.publicModel.siteRevision:"dev"};c.sdkSource&&(h.sdkSource=c.sdkSource);var i=g(h);return d+"?"+i}return{buildUrl:h}}),define("wixCodeInit/utils/messageHolder",[],function(){"use strict";function a(){var a=[],b=null;return{sendOrHoldMessage:function(c){b?b(c):a.push(c)},setMessageTarget:function(c){for(b=c;a.length>0;)b(a.shift())}}}return{get:a}}),define("wixCodeInit/utils/iFrameUtils",[],function(){"use strict";function a(a,b){var c=document.createElement("iframe");return c.style.display="none",c.src=a,c.className="wix-code-app",c.setAttribute("data-app-id",b.applicationId),c.setAttribute("data-app-definition-id",b.appDefinitionId),c}function b(a,b){return b.source===a.contentWindow}return{getIFrameForApp:a,isIFrameEvent:b}}),define("wixCodeInit/utils/specMapUtils",[],function(){"use strict";function b(b){for(var c in b)if(b.hasOwnProperty(c)&&b[c].type===a)return b[c]}function c(b){return b&&b.type===a?"wixCodeDataProvider_"+b.applicationId:void 0}var a="siteextension";return{getAppSpec:b,getHandlerId:c}}),define("wixCodeInit/utils/widgetsPreLoader",["wixCodeInit/utils/specMapUtils"],function(a){"use strict";function b(a){if(null===a||"object"!=typeof a)return a;var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b}function c(b,c,d){requirejs(["utils","widgets"],function(e,f){var g=new e.SiteData(b,function(){}),h=e.wixUrlParser.parseUrl(g,c),i=h&&h.pageId;if(i){var j=a.getAppSpec(b.rendererModel.clientSpecMap),k=a.getHandlerId(j),l=f.messageBuilder.loadWidgetsMessage(k,[{type:"Page",id:i}]);d(l)}})}function d(a,c){if("load_widgets"===c.type){var d=a.widgets.map(function(a){return a.id});if(d.length>0&&(c=b(c),c.widgets=c.widgets.filter(function(a){return-1===d.indexOf(a.id)}),0===c.widgets.length))return null}return c}return{asyncGetPreLoadMessage:c,filterPreLoadedWidgets:d}}),define("wixCodeInit/api/wixCodeAppApi",["wixCodeInit/utils/urlBuilder","wixCodeInit/utils/messageHolder","wixCodeInit/utils/iFrameUtils","wixCodeInit/utils/widgetsPreLoader","wixCodeInit/utils/specMapUtils","experiment"],function(a,b,c,d,e,f){"use strict";function g(a){return"WIX_CODE"===a.intent&&"wix_code_iframe_loaded"===a.type}function h(a){"loading"!==document.readyState?document.body.appendChild(a):document.addEventListener("DOMContentLoaded",function(){document.body.appendChild(a)})}function i(){function o(a,b){c.isIFrameEvent(a,b)&&(g(b.data)&&k.setMessageTarget(function(b){a.contentWindow.postMessage(b,"*")}),j.forEach(function(a){a(b.data)}))}function p(b,d,f){if(l)return void console.warn("Wix code is already initiated");var g=e.getAppSpec(d);if(g){var i=a.buildUrl(b,g,f),j=c.getIFrameForApp(i,g),k=o.bind(null,j);window.addEventListener("message",k,!1),h(j),l=!0}}function q(a){j.push(a)}function r(a){m&&(a=n?d.filterPreLoadedWidgets(n,a):a),a&&k.sendOrHoldMessage(a),m=!1}function s(a,b){m&&!n&&d.asyncGetPreLoadMessage(a,b,function(a){m&&!n&&(n=a,k.sendOrHoldMessage(n))})}if(!f.isOpen("wixCodeBinding")){var i=function(){};return{init:i,sendMessage:i,registerMessageHandler:i,preLoadWidgets:i}}var j=[],k=b.get(),l=!1,m=!0,n=null;return{init:p,sendMessage:r,registerMessageHandler:q,preLoadWidgets:s}}return{getApi:i}}),define("wixCodeInit/api/initMainR",["experiment"],function(a){"use strict";function b(b,c,d,e,f){function j(a){b.init(c,a,g),h&&b.preLoadWidgets(c,document.location.href)}if(a.isOpen("wixCodeBinding")){var g={isMobileView:e,debug:f.getParameterByName("debug"),sdkSource:f.getParameterByName("sdkSource"),runtimeSource:f.getParameterByName("WixCodeRuntimeSource")},h=!!c.publicModel,i=h&&"success"!==c.dynamicModelState;i?d(function(a){j(a.clientSpecMap)},function(){console.error("Error fetching dynamic client spec map model")}):j(c.rendererModel.clientSpecMap)}}return b}),define("wixCodeInit",["wixCodeInit/api/wixCodeAppApi","wixCodeInit/api/initMainR","wixCodeInit/utils/specMapUtils"],function(a,b,c){"use strict";return{getAppApi:a.getApi,initMainR:b,specMapUtils:c}});