define(function (require) {
    'use strict';

    var motherboard = require('motherboard');
    var TodosApp = require('TodosApp');

    motherboard.dispatchers({
        TodosDispatcher: require('dispatchers/TodosDispatcher')
    });
    motherboard.components({
        FormComponent: require('components/FormComponent'),
        TodoComponent: require('components/TodoComponent')
    });
    motherboard.mount(window.app = new TodosApp());

});
