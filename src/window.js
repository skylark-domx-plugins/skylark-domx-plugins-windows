define([
    "skylark-domx/noder",
    "skylark-domx/eventer",
    "skylark-domx/query",
    "skylark-domx-plugins-base",
    "skylark-domx-plugins-interact/movable",
    "skylark-domx-plugins-interact/resizable",
    "./windows"
], function (noder,eventer,$,plugins,Movable, Resizable,windows) {
    'use strict';

    /*ref: skylark-photoviewer */
    var windows = [];

    var Window = plugins.Plugin.inherit({
        klassName : "Window",

        pluginName : "lark.domx.window",

        options : {
            selectors : {
                headerPane  : "",
                contentPane : "",
                footerPane  : "",
                titlebar : "",
                buttons : {
                    "fullscreen" : ".button-fullscreen",
                    "maximize" : ".button-maximize",
                    "minimize" : ".button-minimize",     
                    "close" : ".button-close"
                }
            },

            classes : {
                "maximize" : "maximize"
            },

            fixedContent: true,
            initMaximized: false,

            movable : {
                dragHandle: false,
                dragCancel: null
            },
            resizable : {
                minWidth: 320,
                minHeight: 320,
                border : {
                    classes :  {
                        all : "resizable-handle",
                        top : "resizable-handle-n",
                        left: "resizable-handle-w",
                        right: "resizable-handle-e",
                        bottom: "resizable-handle-s", 
                        topLeft : "resizable-handle-nw", 
                        topRight : "resizable-handle-ne",
                        bottomLeft : "resizable-handle-sw",             
                        bottomRight : "resizable-handle-se"     
                    }
                }
            }
        },

        _construct : function(elm,options) {
            plugins.Plugin.prototype._construct.call(this,elm,options);
            this.isOpened = false;
            this.isMaximized = false;

            this.$window = $(this._elm);

            this._velm = this.elmx();

            if (this.options.movable) {
                this._movable = new Movable(elm,{
                    handle : this.options.movable.dragHandle,
                    starting : (e) => {
                        const   dragCancel = this.options.movable.dragCancel, 
                                elemCancel = $(e.target).closest(dragCancel);
                        if (elemCancel.length) {
                            return false;
                        }
                        if (this.isResizing || this.isMaximized) {
                            return false;
                        }

                        return true;
                    }
                });

            }

            if (this.options.resizable) {

                this._resizable = new Resizable(elm,{
                    handle : {
                        border : {
                            directions : {
                                top: true, //n
                                left: true, //w
                                right: true, //e
                                bottom: true, //s
                                topLeft : true, // nw
                                topRight : true, // ne
                                bottomLeft : true, // sw
                                bottomRight : true // se                         
                            },
                            classes : {
                                all : this.options.resizable.border.classes.all,
                                top : this.options.resizable.border.classes.top,
                                left: this.options.resizable.border.classes.left,
                                right: this.options.resizable.border.classes.right,
                                bottom: this.options.resizable.border.classes.bottom, 
                                topLeft : this.options.resizable.border.classes.topLeft, 
                                topRight : this.options.resizable.border.classes.topRight,
                                bottomLeft : this.options.resizable.border.classes.bottomLeft,             
                                bottomRight : this.options.resizable.border.classes.bottomRight                        
                            }                        
                        }
                    },
                    constraints : {
                        minWidth : this.options.resizable.minWidth,
                        minHeight : this.options.resizable.minHeight
                    },
                    started : function(){
                        this.isResizing = true;
                    },
                    moving : function(e) {
                        /*
                        const imageWidth = $(image).width();
                        const imageHeight = $(image).height();
                        const stageWidth = $(stage).width();
                        const stageHeight = $(stage).height();
                        const left = (stageWidth - imageWidth) /2;
                        const top = (stageHeight- imageHeight) /2;
                        $(image).css({
                            left,
                            top
                        });
                        */
                    },
                    stopped :function () {
                        this.isResizing = false;
                    }
                });

            }

            this.$close = this._velm.$(this.options.selectors.buttons.close);
            this.$maximize = this._velm.$(this.options.selectors.buttons.maximize);
            this.$minimize = this._velm.$(this.options.selectors.buttons.minimize);
            this.$fullscreen = this._velm.$(this.options.selectors.buttons.fullscreen);


            this.$close.off("click.window").on("click.window", e => {
                this.close();
            });
            this.$fullscreen.off("click.window").on("click.window", () => {
                this.fullscreen();
            });
            this.$maximize.off("click.window").on("click.window", () => {
                this.maximize();
            });
            this.$window.off("keydown.window").on("keydown.window", e => {
                this._keydown(e);
            });

            windows.push(this);
        },
        close: function() {
            this.trigger('closing', this);
            this.$window.remove();
            this.isOpened = false;
            this.isMaximized = false;

            ///if (!$(Constants.CLASS_NS + '-modal').length) {
            ///    if (this.options.fixedContent) {
            ///        $('html').css({
            ///            overflow: '',
            ///            'padding-right': ''
            ///        });
            ///    }
                ///if (this.options.multiInstances) {
                ///    zIndex = this.options.zIndex;
                ///}
            ///    eventer.off(window,"resize.window");
            var idx = windows.indexOf(this);
            if (idx>-1) {
                windows.splice(idx,1);
            }
            this.trigger('closed', this);
        },

        maximize: function() {
            this.$window.get(0).focus();
            if (!this.isMaximized) {
                this.modalData = {
                    width: this.$window.width(),
                    height: this.$window.height(),
                    left: this.$window.offset().left,
                    top: this.$window.offset().top
                };
                this.$window.addClass(this.options.classes.maximize);
                this.$window.css({
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0
                });
                this.isMaximized = true;
            } else {
                let $W = $(window),$D = $(document);
                this.$window.removeClass(this.options.classes.maximize);
                const initModalLeft = ($W.width() - this.options.modalWidth) / 2 + $D.scrollLeft();
                const initModalTop = ($W.height() - this.options.modalHeight) / 2 + $D.scrollTop();
                this.$window.css({
                    width: this.modalData.width ? this.modalData.width : this.options.modalWidth,
                    height: this.modalData.height ? this.modalData.height : this.options.modalHeight,
                    left: this.modalData.left ? this.modalData.left : initModalLeft,
                    top: this.modalData.top ? this.modalData.top : initModalTop
                });
                this.isMaximized = false;
            }

            eventer.resized(this._elm);
        },
        fullscreen: function() {
            this.$window.get(0).focus();
            noder.fullscreen(this.$window[0]);
        },
        _keydown: function(e) {
            if (!this.options.keyboard) {
                return false;
            }
            const keyCode = e.keyCode || e.which || e.charCode;
            const ctrlKey = e.ctrlKey || e.metaKey;
            const altKey = e.altKey || e.metaKey;
            switch (keyCode) {

                // Q
                case 81:
                    this.close();
                    break;
                default:
            }
        }

    });

    eventer.on(window,"resize.window", ()=>{
        for (let i=0; i<windows.length; i++ ) {
            eventer.resized(windows[i]._elm);
        }
    });

    return windows.Window = Window;
});