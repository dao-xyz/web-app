"use strict";(self.webpackChunkdao_xyz=self.webpackChunkdao_xyz||[]).push([[489],{50489:(e,t,n)=>{n.r(t),n.d(t,{default:()=>m});var r,o=n(97143),i=n.n(o),a=(r=function(e,t){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},r(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function __(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(__.prototype=t.prototype,new __)});const c=function(e){function WalletAdapter(){return null!==e&&e.apply(this,arguments)||this}return a(WalletAdapter,e),WalletAdapter}(i());var s=n(14976),l=n(66315),u=n.n(l);class Wallet extends(i()){constructor(e,t){var n;if(super(),n=this,this._handleMessage=e=>{if(this._injectedProvider&&e.source===window||e.origin===this._providerUrl.origin&&e.source===this._popup)if("connected"===e.data.method){const t=new s.nh(e.data.params.publicKey);this._publicKey&&this._publicKey.equals(t)||(this._publicKey&&!this._publicKey.equals(t)&&this._handleDisconnect(),this._publicKey=t,this._autoApprove=!!e.data.params.autoApprove,this.emit("connect",this._publicKey))}else if("disconnected"===e.data.method)this._handleDisconnect();else if((e.data.result||e.data.error)&&this._responsePromises.has(e.data.id)){const[t,n]=this._responsePromises.get(e.data.id);e.data.result?t(e.data.result):n(new Error(e.data.error))}},this._handleConnect=()=>(this._handlerAdded||(this._handlerAdded=!0,window.addEventListener("message",this._handleMessage),window.addEventListener("beforeunload",this.disconnect)),this._injectedProvider?new Promise((e=>{this._sendRequest("connect",{}),e()})):(window.name="parent",this._popup=window.open(this._providerUrl.toString(),"_blank","location,resizable,width=460,height=675"),new Promise((e=>{this.once("connect",e)})))),this._handleDisconnect=()=>{this._handlerAdded&&(this._handlerAdded=!1,window.removeEventListener("message",this._handleMessage),window.removeEventListener("beforeunload",this.disconnect)),this._publicKey&&(this._publicKey=null,this.emit("disconnect")),this._responsePromises.forEach(((e,t)=>{let[n,r]=e;this._responsePromises.delete(t),r("Wallet disconnected")}))},this._sendRequest=async function(e,t){if("connect"!==e&&!n.connected)throw new Error("Wallet not connected");const r=n._nextRequestId;return++n._nextRequestId,new Promise(((o,i)=>{n._responsePromises.set(r,[o,i]),n._injectedProvider?n._injectedProvider.postMessage({jsonrpc:"2.0",id:r,method:e,params:{network:n._network,...t}}):(n._popup.postMessage({jsonrpc:"2.0",id:r,method:e,params:t},n._providerUrl.origin),n.autoApprove||n._popup.focus())}))},this.connect=()=>(this._popup&&this._popup.close(),this._handleConnect()),this.disconnect=async function(){n._injectedProvider&&await n._sendRequest("disconnect",{}),n._popup&&n._popup.close(),n._handleDisconnect()},this.sign=async function(e,t){if(!(e instanceof Uint8Array))throw new Error("Data must be an instance of Uint8Array");const r=await n._sendRequest("sign",{data:e,display:t});return{signature:u().decode(r.signature),publicKey:new s.nh(r.publicKey)}},this.signTransaction=async function(e){const t=await n._sendRequest("signTransaction",{message:u().encode(e.serializeMessage())}),r=u().decode(t.signature),o=new s.nh(t.publicKey);return e.addSignature(o,r),e},this.signAllTransactions=async function(e){const t=await n._sendRequest("signAllTransactions",{messages:e.map((e=>u().encode(e.serializeMessage())))}),r=t.signatures.map((e=>u().decode(e))),o=new s.nh(t.publicKey);return e=e.map(((e,t)=>(e.addSignature(o,r[t]),e)))},function isInjectedProvider(e){return function isObject(e){return"object"==typeof e&&null!==e}(e)&&function isFunction(e){return"function"==typeof e}(e.postMessage)}(e))this._injectedProvider=e;else{if(!function isString(e){return"string"==typeof e}(e))throw new Error("provider parameter must be an injected provider or a URL string.");this._providerUrl=new URL(e),this._providerUrl.hash=new URLSearchParams({origin:window.location.origin,network:t}).toString()}this._network=t,this._publicKey=null,this._autoApprove=!1,this._popup=null,this._handlerAdded=!1,this._nextRequestId=1,this._responsePromises=new Map}get publicKey(){return this._publicKey}get connected(){return null!==this._publicKey}get autoApprove(){return this._autoApprove}}const d=Wallet;var p=function(){var extendStatics=function(e,t){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},extendStatics(e,t)};return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function __(){this.constructor=e}extendStatics(e,t),e.prototype=null===t?Object.create(t):(__.prototype=t.prototype,new __)}}(),__awaiter=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function fulfilled(e){try{step(r.next(e))}catch(e){i(e)}}function rejected(e){try{step(r.throw(e))}catch(e){i(e)}}function step(e){e.done?o(e.value):function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())}))},__generator=function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:verb(0),throw:verb(1),return:verb(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function verb(i){return function(c){return function step(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};const f=function(e){function WebAdapter(t,n,r){var o=e.call(this)||this;return o._instance=null,o.handleMessage=function(e){},o._handleConnect=function(){o.emit("connect")},o._handleDisconnect=function(){window.clearInterval(o._pollTimer),o.emit("disconnect")},o._network=n,o._provider=r,o}return p(WebAdapter,e),Object.defineProperty(WebAdapter.prototype,"publicKey",{get:function(){return this._instance.publicKey||null},enumerable:!1,configurable:!0}),Object.defineProperty(WebAdapter.prototype,"connected",{get:function(){return this._instance.connected||!1},enumerable:!1,configurable:!0}),WebAdapter.prototype.connect=function(){return __awaiter(this,void 0,void 0,(function(){var e=this;return __generator(this,(function(t){switch(t.label){case 0:return this._instance=new d(this._provider,this._network),this._instance.on("connect",this._handleConnect),this._instance.on("disconnect",this._handleDisconnect),this._pollTimer=window.setInterval((function(){var t,n;!1!==(null===(n=null===(t=e._instance)||void 0===t?void 0:t._popup)||void 0===n?void 0:n.closed)&&e._handleDisconnect()}),200),[4,this._instance.connect()];case 1:return t.sent(),[2]}}))}))},WebAdapter.prototype.disconnect=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(e){switch(e.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return this._instance.removeAllListeners("connect"),this._instance.removeAllListeners("disconnect"),[4,this._instance.disconnect()];case 1:return e.sent(),[2]}}))}))},WebAdapter.prototype.signTransaction=function(e){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(t){switch(t.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._instance.signTransaction(e)];case 1:return[2,t.sent()]}}))}))},WebAdapter.prototype.signAllTransactions=function(e){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(t){switch(t.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._instance.signAllTransactions(e)];case 1:return[2,t.sent()]}}))}))},WebAdapter.prototype.signMessage=function(e,t){return void 0===t&&(t="hex"),__awaiter(this,void 0,void 0,(function(){var n;return __generator(this,(function(r){switch(r.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._instance.sign(e,t)];case 1:return n=r.sent().signature,[2,Uint8Array.from(n)]}}))}))},WebAdapter}(c);var h=n(92810),_=function(){var extendStatics=function(e,t){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},extendStatics(e,t)};return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function __(){this.constructor=e}extendStatics(e,t),e.prototype=null===t?Object.create(t):(__.prototype=t.prototype,new __)}}(),__assign=function(){return __assign=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},__assign.apply(this,arguments)},iframe_awaiter=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function fulfilled(e){try{step(r.next(e))}catch(e){i(e)}}function rejected(e){try{step(r.throw(e))}catch(e){i(e)}}function step(e){e.done?o(e.value):function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())}))},iframe_generator=function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:verb(0),throw:verb(1),return:verb(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function verb(i){return function(c){return function step(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}},v=function(e){function IframeAdapter(t,n){var r,o=this;return(o=e.call(this)||this)._publicKey=null,o._messageHandlers={},o.handleMessage=function(e){if(o._messageHandlers[e.id]){var t=o._messageHandlers[e.id],n=t.resolve,r=t.reject;delete o._messageHandlers[e.id],e.error?r(e.error):n(e.result)}},o._sendMessage=function(e){if(!o.connected)throw new Error("Wallet not connected");return new Promise((function(t,n){var r,i,a=(0,h.Z)();o._messageHandlers[a]={resolve:t,reject:n},null===(i=null===(r=o._iframe)||void 0===r?void 0:r.contentWindow)||void 0===i||i.postMessage({channel:"solflareWalletAdapterToIframe",data:__assign({id:a},e)},"*")}))},o._iframe=t,o._publicKey=new s.nh(null===(r=null==n?void 0:n.toString)||void 0===r?void 0:r.call(n)),o}return _(IframeAdapter,e),Object.defineProperty(IframeAdapter.prototype,"publicKey",{get:function(){return this._publicKey||null},enumerable:!1,configurable:!0}),Object.defineProperty(IframeAdapter.prototype,"connected",{get:function(){return!0},enumerable:!1,configurable:!0}),IframeAdapter.prototype.connect=function(){return iframe_awaiter(this,void 0,void 0,(function(){return iframe_generator(this,(function(e){return[2]}))}))},IframeAdapter.prototype.disconnect=function(){return iframe_awaiter(this,void 0,void 0,(function(){return iframe_generator(this,(function(e){switch(e.label){case 0:return[4,this._sendMessage({method:"disconnect"})];case 1:return e.sent(),[2]}}))}))},IframeAdapter.prototype.signTransaction=function(e){return iframe_awaiter(this,void 0,void 0,(function(){var t,n,r,o;return iframe_generator(this,(function(i){switch(i.label){case 0:if(!this.connected)throw new Error("Wallet not connected");i.label=1;case 1:return i.trys.push([1,3,,4]),[4,this._sendMessage({method:"signTransaction",params:{message:u().encode(e.serializeMessage())}})];case 2:return t=i.sent(),n=t.publicKey,r=t.signature,e.addSignature(new s.nh(n),u().decode(r)),[2,e];case 3:throw o=i.sent(),console.log(o),new Error("Failed to sign transaction");case 4:return[2]}}))}))},IframeAdapter.prototype.signAllTransactions=function(e){return iframe_awaiter(this,void 0,void 0,(function(){var t,n,r,o;return iframe_generator(this,(function(i){switch(i.label){case 0:if(!this.connected)throw new Error("Wallet not connected");i.label=1;case 1:return i.trys.push([1,3,,4]),[4,this._sendMessage({method:"signAllTransactions",params:{messages:e.map((function(e){return u().encode(e.serializeMessage())}))}})];case 2:return t=i.sent(),n=t.publicKey,r=t.signatures,[2,e.map((function(e,t){return e.addSignature(new s.nh(n),u().decode(r[t])),e}))];case 3:throw o=i.sent(),console.log(o),new Error("Failed to sign transactions");case 4:return[2]}}))}))},IframeAdapter.prototype.signMessage=function(e,t){return void 0===t&&(t="hex"),iframe_awaiter(this,void 0,void 0,(function(){var n,r;return iframe_generator(this,(function(o){switch(o.label){case 0:if(!this.connected)throw new Error("Wallet not connected");o.label=1;case 1:return o.trys.push([1,3,,4]),[4,this._sendMessage({method:"signMessage",params:{data:e,display:t}})];case 2:return n=o.sent(),[2,Uint8Array.from(u().decode(n))];case 3:throw r=o.sent(),console.log(r),new Error("Failed to sign message");case 4:return[2]}}))}))},IframeAdapter}(c);const w=v;var y=function(){var extendStatics=function(e,t){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},extendStatics(e,t)};return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function __(){this.constructor=e}extendStatics(e,t),e.prototype=null===t?Object.create(t):(__.prototype=t.prototype,new __)}}(),esm_awaiter=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function fulfilled(e){try{step(r.next(e))}catch(e){i(e)}}function rejected(e){try{step(r.throw(e))}catch(e){i(e)}}function step(e){e.done?o(e.value):function adopt(e){return e instanceof n?e:new n((function(t){t(e)}))}(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())}))},esm_generator=function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:verb(0),throw:verb(1),return:verb(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function verb(i){return function(c){return function step(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}},__values=function(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};const m=function(e){function Solflare(t){var n=e.call(this)||this;return n._network="mainnet-beta",n._provider=null,n._adapterInstance=null,n._element=null,n._iframe=null,n._connectHandler=null,n._flutterHandlerInterval=null,n._handleEvent=function(e){var t,r,o;switch(e.type){case"connect_native_web":return n._collapseIframe(),n._adapterInstance=new f(n._iframe,n._network,(null===(t=e.data)||void 0===t?void 0:t.provider)||n._provider||"https://solflare.com/provider"),n._adapterInstance.on("connect",n._webConnected),n._adapterInstance.on("disconnect",n._webDisconnected),n._adapterInstance.connect(),void n._setPreferredAdapter("native_web");case"connect":return n._collapseIframe(),n._adapterInstance=new w(n._iframe,(null===(r=e.data)||void 0===r?void 0:r.publicKey)||""),n._adapterInstance.connect(),n._setPreferredAdapter(null===(o=e.data)||void 0===o?void 0:o.adapter),n._connectHandler&&(n._connectHandler.resolve(),n._connectHandler=null),void n.emit("connect",n.publicKey);case"disconnect":return n._connectHandler&&(n._connectHandler.reject(),n._connectHandler=null),n._disconnected(),void n.emit("disconnect");case"collapse":return void n._collapseIframe();default:return}},n._handleMessage=function(e){var t;if("solflareIframeToWalletAdapter"===(null===(t=e.data)||void 0===t?void 0:t.channel)){var r=e.data.data||{};"event"===r.type?n._handleEvent(r.event):n._adapterInstance&&n._adapterInstance.handleMessage(r)}},n._removeElement=function(){null!==n._flutterHandlerInterval&&(clearInterval(n._flutterHandlerInterval),n._flutterHandlerInterval=null),n._element&&(n._element.remove(),n._element=null)},n._removeDanglingElements=function(){var e,t,n=document.getElementsByClassName("solflare-wallet-adapter-iframe");try{for(var r=__values(n),o=r.next();!o.done;o=r.next()){var i=o.value;i.parentElement&&i.remove()}}catch(t){e={error:t}}finally{try{o&&!o.done&&(t=r.return)&&t.call(r)}finally{if(e)throw e.error}}},n._injectElement=function(){n._removeElement(),n._removeDanglingElements();var e="".concat(Solflare.IFRAME_URL,"?cluster=").concat(encodeURIComponent(n._network),"&origin=").concat(encodeURIComponent(window.location.origin)),t=n._getPreferredAdapter();t&&(e+="&adapter=".concat(encodeURIComponent(t))),n._element=document.createElement("div"),n._element.className="solflare-wallet-adapter-iframe",n._element.innerHTML="\n      <iframe src='".concat(e,"' style='position: fixed; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%; border: none; border-radius: 0; z-index: 99999; color-scheme: auto;' allowtransparency='true'></iframe>\n    "),document.body.appendChild(n._element),n._iframe=n._element.querySelector("iframe"),window.fromFlutter=n._handleMobileMessage,n._flutterHandlerInterval=setInterval((function(){window.fromFlutter=n._handleMobileMessage}),100),window.addEventListener("message",n._handleMessage,!1)},n._collapseIframe=function(){n._iframe&&(n._iframe.style.top="",n._iframe.style.right="",n._iframe.style.height="2px",n._iframe.style.width="2px")},n._getPreferredAdapter=function(){return localStorage&&localStorage.getItem("solflarePreferredWalletAdapter")||null},n._setPreferredAdapter=function(e){localStorage&&e&&localStorage.setItem("solflarePreferredWalletAdapter",e)},n._clearPreferredAdapter=function(){localStorage&&localStorage.removeItem("solflarePreferredWalletAdapter")},n._webConnected=function(){n._connectHandler&&(n._connectHandler.resolve(),n._connectHandler=null),n.emit("connect",n.publicKey)},n._webDisconnected=function(){n._connectHandler&&(n._connectHandler.reject(),n._connectHandler=null),n._disconnected(),n.emit("disconnect")},n._disconnected=function(){window.removeEventListener("message",n._handleMessage,!1),n._removeElement(),n._clearPreferredAdapter(),n._adapterInstance=null},n._handleMobileMessage=function(e){var t,r;null===(r=null===(t=n._iframe)||void 0===t?void 0:t.contentWindow)||void 0===r||r.postMessage({channel:"solflareMobileToIframe",data:e},"*")},(null==t?void 0:t.network)&&(n._network=null==t?void 0:t.network),(null==t?void 0:t.provider)&&(n._provider=null==t?void 0:t.provider),n}return y(Solflare,e),Object.defineProperty(Solflare.prototype,"publicKey",{get:function(){var e;return(null===(e=this._adapterInstance)||void 0===e?void 0:e.publicKey)||null},enumerable:!1,configurable:!0}),Object.defineProperty(Solflare.prototype,"isConnected",{get:function(){var e;return!!(null===(e=this._adapterInstance)||void 0===e?void 0:e.connected)},enumerable:!1,configurable:!0}),Object.defineProperty(Solflare.prototype,"connected",{get:function(){return this.isConnected},enumerable:!1,configurable:!0}),Object.defineProperty(Solflare.prototype,"autoApprove",{get:function(){return!1},enumerable:!1,configurable:!0}),Solflare.prototype.connect=function(){return esm_awaiter(this,void 0,void 0,(function(){var e=this;return esm_generator(this,(function(t){switch(t.label){case 0:return this.connected?[2]:(this._injectElement(),[4,new Promise((function(t,n){e._connectHandler={resolve:t,reject:n}}))]);case 1:return t.sent(),[2]}}))}))},Solflare.prototype.disconnect=function(){return esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(e){switch(e.label){case 0:return this._adapterInstance?[4,this._adapterInstance.disconnect()]:[2];case 1:return e.sent(),this._disconnected(),this.emit("disconnect"),[2]}}))}))},Solflare.prototype.signTransaction=function(e){return esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(t){switch(t.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._adapterInstance.signTransaction(e)];case 1:return[2,t.sent()]}}))}))},Solflare.prototype.signAllTransactions=function(e){return esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(t){switch(t.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._adapterInstance.signAllTransactions(e)];case 1:return[2,t.sent()]}}))}))},Solflare.prototype.signMessage=function(e,t){return void 0===t&&(t="utf8"),esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(n){switch(n.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._adapterInstance.signMessage(e,t)];case 1:return[2,n.sent()]}}))}))},Solflare.prototype.sign=function(e,t){return void 0===t&&(t="utf8"),esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(n){switch(n.label){case 0:return[4,this.signMessage(e,t)];case 1:return[2,n.sent()]}}))}))},Solflare.prototype.detectWallet=function(e){return void 0===e&&(e=10),esm_awaiter(this,void 0,void 0,(function(){return esm_generator(this,(function(t){return[2,new Promise((function(t){var n=null;function handleDetected(e){!function cleanUp(){window.removeEventListener("message",handleMessage,!1),n&&(document.body.removeChild(n),n=null);r&&(clearTimeout(r),r=null)}(),t(e)}var r=setTimeout((function(){handleDetected(!1)}),1e3*e);function handleMessage(e){var t,n,r;"solflareDetectorToAdapter"===(null===(t=e.data)||void 0===t?void 0:t.channel)&&handleDetected(!!(null===(r=null===(n=e.data)||void 0===n?void 0:n.data)||void 0===r?void 0:r.detected))}window.addEventListener("message",handleMessage,!1),(n=document.createElement("div")).className="solflare-wallet-detect-iframe",n.innerHTML="\n        <iframe src='".concat(Solflare.DETECT_IFRAME_URL,"?timeout=").concat(e,"' style='position: fixed; top: -9999px; left: -9999px; width: 0; height: 0; pointer-events: none; border: none;'></iframe>\n      "),document.body.appendChild(n)}))]}))}))},Solflare.IFRAME_URL="https://connect.solflare.com/",Solflare.DETECT_IFRAME_URL="https://connect.solflare.com/detect",Solflare}(i())}}]);
//# sourceMappingURL=489.8f0b0db7.chunk.js.map