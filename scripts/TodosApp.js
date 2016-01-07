define(function (require) {
    'use strict';

    var $ = require('jquery');
    var Router = require('Router');
    var App = require('motherboard').App;
    var TodosDispatcher = require('dispatchers/TodosDispatcher');
    var TodoComponent = require('components/TodoComponent');


    function TodosApp (element) {
        App.call(this);

        this.todosDispatcher = null;

        this.router = null;

    }
    TodosApp.prototype = Object.create(App.prototype);
    var proto = TodosApp.prototype;
    proto.constructor = TodosApp;


    var _handleRouteChange = function (action) {
        if (this.todosDispatcher === null) {
            return;
        }
        var filters = {};
        switch (action) {
            case 'active':
                console.log('active');
                filters = { complete: false };
                break;

            case 'completed':
                console.log('completed');
                filters = { complete: true };
                break;
        }
        this.todosDispatcher.filter(filters);
    };


    proto.init = function () {
        this.todosDispatcher = this.getDispatcher(TodosDispatcher);
        this.router = new Router();
        this.router.init();
        this.router.mount({
            '(.*)': _handleRouteChange.bind(this)
        });
        _handleRouteChange.call(this, this.router.getRoute(0));
    };


    return TodosApp;
});
