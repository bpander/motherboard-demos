define(['./Dispatcher'], function (Dispatcher) {
    'use strict';


    function App (element, options) {
        Dispatcher.call(this, element || document.body, options);

        this.dispatchers = [];

    }
    App.prototype = Object.create(Dispatcher.prototype);
    var proto = App.prototype;
    proto.constructor = App;


    App.prototype.getDispatcher = function (T) {
        return this.dispatchers.find(function (dispatcher) {
            return dispatcher.constructor === T;
        }) || null;
    };


    App.prototype.getDispatchers = function (T) {
        return this.dispatchers.filter(function (dispatcher) {
            return dispatcher.constructor === T;
        });
    };


    return App;
});
