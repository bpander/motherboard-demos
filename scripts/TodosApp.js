define(function (require) {
    'use strict';

    var App = require('motherboard').App;


    function TodosApp (element, options) {
        App.call(this);

    }
    TodosApp.prototype = Object.create(App.prototype);
    var proto = TodosApp.prototype;
    proto.constructor = TodosApp;


    return TodosApp;
});
