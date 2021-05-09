/**
 * skylark-domx-plugins-windows - The skylark window plugin library for dom api extension.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx-plugins/skylark-domx-plugins-windows/
 * @license MIT
 */
!function(i,t){var s=t.define,require=t.require,e="function"==typeof s&&s.amd,o=!e&&"undefined"!=typeof exports;if(!e&&!s){var n={};s=t.define=function(i,t,s){"function"==typeof s?(n[i]={factory:s,deps:t.map(function(t){return function(i,t){if("."!==i[0])return i;var s=t.split("/"),e=i.split("/");s.pop();for(var o=0;o<e.length;o++)"."!=e[o]&&(".."==e[o]?s.pop():s.push(e[o]));return s.join("/")}(t,i)}),resolved:!1,exports:null},require(i)):n[i]={factory:null,resolved:!0,exports:s}},require=t.require=function(i){if(!n.hasOwnProperty(i))throw new Error("Module "+i+" has not been defined");var module=n[i];if(!module.resolved){var s=[];module.deps.forEach(function(i){s.push(require(i))}),module.exports=module.factory.apply(t,s)||null,module.resolved=!0}return module.exports}}if(!s)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(i,require){i("skylark-domx-plugins-windows/windows",["skylark-langx/skylark"],function(i){"use strict";return i.attach("domx.plugins.windows")}),i("skylark-domx-plugins-windows/window",["skylark-domx/noder","skylark-domx/eventer","skylark-domx/query","skylark-domx-plugins-base","skylark-domx-plugins-interact/movable","skylark-domx-plugins-interact/resizable","./windows"],function(i,t,s,e,o,n,l){"use strict";var l=[],a=e.Plugin.inherit({klassName:"Window",pluginName:"lark.domx.window",options:{selectors:{headerPane:"",contentPane:"",footerPane:"",titlebar:"",buttons:{fullscreen:".button-fullscreen",maximize:".button-maximize",minimize:".button-minimize",close:".button-close"}},classes:{maximize:"maximize"},fixedContent:!0,initMaximized:!1,movable:{dragHandle:!1,dragCancel:null},resizable:{minWidth:320,minHeight:320,border:{classes:{all:"resizable-handle",top:"resizable-handle-n",left:"resizable-handle-w",right:"resizable-handle-e",bottom:"resizable-handle-s",topLeft:"resizable-handle-nw",topRight:"resizable-handle-ne",bottomLeft:"resizable-handle-sw",bottomRight:"resizable-handle-se"}}}},_construct:function(i,t){e.Plugin.prototype._construct.call(this,i,t),this.isOpened=!1,this.isMaximized=!1,this.$window=s(this._elm),this._velm=this.elmx(),this.options.movable&&(this._movable=new o(i,{handle:this.options.movable.dragHandle,starting:i=>{const t=this.options.movable.dragCancel,e=s(i.target).closest(t);return!e.length&&(!this.isResizing&&!this.isMaximized)}})),this.options.resizable&&(this._resizable=new n(i,{handle:{border:{directions:{top:!0,left:!0,right:!0,bottom:!0,topLeft:!0,topRight:!0,bottomLeft:!0,bottomRight:!0},classes:{all:this.options.resizable.border.classes.all,top:this.options.resizable.border.classes.top,left:this.options.resizable.border.classes.left,right:this.options.resizable.border.classes.right,bottom:this.options.resizable.border.classes.bottom,topLeft:this.options.resizable.border.classes.topLeft,topRight:this.options.resizable.border.classes.topRight,bottomLeft:this.options.resizable.border.classes.bottomLeft,bottomRight:this.options.resizable.border.classes.bottomRight}}},constraints:{minWidth:this.options.resizable.minWidth,minHeight:this.options.resizable.minHeight},started:function(){this.isResizing=!0},moving:function(i){},stopped:function(){this.isResizing=!1}})),this.$close=this._velm.$(this.options.selectors.buttons.close),this.$maximize=this._velm.$(this.options.selectors.buttons.maximize),this.$minimize=this._velm.$(this.options.selectors.buttons.minimize),this.$fullscreen=this._velm.$(this.options.selectors.buttons.fullscreen),this.$close.off("click.window").on("click.window",i=>{this.close()}),this.$fullscreen.off("click.window").on("click.window",()=>{this.fullscreen()}),this.$maximize.off("click.window").on("click.window",()=>{this.maximize()}),this.$window.off("keydown.window").on("keydown.window",i=>{this._keydown(i)}),l.push(this)},close:function(){this.trigger("closing",this),this.$window.remove(),this.isOpened=!1,this.isMaximized=!1;var i=l.indexOf(this);i>-1&&l.splice(i,1),this.trigger("closed",this)},maximize:function(){if(this.$window.get(0).focus(),this.isMaximized){let i=s(window),t=s(document);this.$window.removeClass(this.options.classes.maximize);const e=(i.width()-this.options.modalWidth)/2+t.scrollLeft(),o=(i.height()-this.options.modalHeight)/2+t.scrollTop();this.$window.css({width:this.modalData.width?this.modalData.width:this.options.modalWidth,height:this.modalData.height?this.modalData.height:this.options.modalHeight,left:this.modalData.left?this.modalData.left:e,top:this.modalData.top?this.modalData.top:o}),this.isMaximized=!1}else this.modalData={width:this.$window.width(),height:this.$window.height(),left:this.$window.offset().left,top:this.$window.offset().top},this.$window.addClass(this.options.classes.maximize),this.$window.css({width:"100%",height:"100%",left:0,top:0}),this.isMaximized=!0;t.resized(this._elm)},fullscreen:function(){this.$window.get(0).focus(),i.fullscreen(this.$window[0])},_keydown:function(i){if(!this.options.keyboard)return!1;const t=i.keyCode||i.which||i.charCode;i.ctrlKey||i.metaKey,i.altKey||i.metaKey;switch(t){case 81:this.close()}}});return t.on(window,"resize.window",()=>{for(let i=0;i<l.length;i++)t.resized(l[i]._elm)}),l.Window=a}),i("skylark-domx-plugins-windows/main",["./windows","./window"],function(i){"use strict";return i}),i("skylark-domx-plugins-windows",["skylark-domx-plugins-windows/main"],function(i){return i})}(s),!e){var l=require("skylark-langx-ns");o?module.exports=l:t.skylarkjs=l}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-domx-plugins-windows.js.map