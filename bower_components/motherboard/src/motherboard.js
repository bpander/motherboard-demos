define(function () {
    'use strict';


    var motherboard = {
        App: require('./App'),
        Binding: require('./Binding'),
        Component: require('./Component'),
        Dispatcher: require('./Dispatcher'),
        Parser: require('./Parser')
    };


    motherboard.component = function (name, value) {
        motherboard.Parser._componentLookup[name] = value;
    };


    motherboard.components = function (dictionary) {
        motherboard.Parser._componentLookup = dictionary;
    };


    motherboard.dispatchers = function (dictionary) {
        motherboard.Parser._dispatcherLookup = dictionary;
    };


    motherboard.mount = function (app) {
        motherboard.Parser._app = app;
        motherboard.Parser.parse(app.element);
        app.init();
    };


    return motherboard;
});
