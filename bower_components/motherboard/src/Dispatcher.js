define(['./Component', './polyfills/Array.prototype.find'], function (Component) {
    'use strict';


    function Dispatcher (element, options) {
        Component.call(this, element, options);

        this.components = [];

    }
    Dispatcher.prototype = Object.create(Component.prototype);
    var proto = Dispatcher.prototype;
    proto.constructor = Dispatcher;


    proto.getComponent = function (T) {
        return this.components.find(function (component) {
            return component.constructor === T;
        }) || null;
    };


    proto.getComponents = function (T) {
        return this.components.filter(function (component) {
            return component.constructor === T;
        });
    };


    return Dispatcher;
});
