define(function () {
    'use strict';


    function EventEmitter () {

        this._bindings = {};

    }
    var proto = EventEmitter.prototype;


    proto.on = function (type, callback) {
        if (callback instanceof Function === false) {
            throw new Error('Callback is wrong type. Expected Function and got ' + typeof callback);
        }
        var bindings = this._bindings[type];
        if (bindings === undefined) {
            bindings = [];
            this._bindings[type] = bindings;
        }
        bindings.push(callback);
    };


    proto.off = function (type, callback) {
        var bindings = this._bindings[type];
        if (bindings === undefined) {
            return;
        }
        var index = bindings.indexOf(callback);
        if (index === -1) {
            return;
        }
        bindings.splice(index, 1);
        if (bindings.length === 0) {
            delete this._bindings[type];
        }
    };


    proto.emit = function (type, data) {
        var bindings = this._bindings[type];
        if (bindings === undefined) {
            return;
        }
        var i;
        var l = bindings.length;
        for (i = 0; i < l; i++) {
            bindings[i](new XEvent(type, this, data));
        }
    };


    function XEvent (type, target, data) {

        this.type = type;

        this.target = target;

        this.data = data;

    }


    return EventEmitter;
});
