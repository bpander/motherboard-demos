define(['./EventEmitter'], function (EventEmitter) {
    'use strict';


    function Binding (target, type, handler) {

        this.target = target;

        this.type = type;

        this.handler = handler;

        this.isEnabled = false;

    }


    Binding.prototype.enable = function () {
        if (this.isEnabled === true) {
            return;
        }

        if (this.target instanceof EventEmitter) {
            this.target.on(this.type, this.handler);

        } else if (this.target instanceof EventTarget) {
            this.target.addEventListener(this.type, this.handler);

        } else if (this.target instanceof NodeList) {
            var i = this.target.length;
            while (--i > 0) {
                this.target[i].addEventListener(this.type, this.handler);
            }
        }
    };


    Binding.prototype.disable = function () {
        if (this.target instanceof EventEmitter) {
            this.target.off(this.type, this.handler);

        } else if (this.target instanceof EventTarget) {
            this.target.removeEventListener(this.type, this.handler);

        } else if (this.target instanceof NodeList) {
            var i = this.target.length;
            while (--i > 0) {
                this.target[i].removeEventListener(this.type, this.handler);
            }
        }
        this.isEnabled = false;
    };


    return Binding;
});
