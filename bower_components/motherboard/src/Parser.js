define(['./App', './Dispatcher', './Component'], function (App, Dispatcher, Component) {
    'use strict';


    var Parser = {};

    Parser._app = null;

    Parser._componentLookup = {};

    Parser._dispatcherLookup = {};


    var COMPONENT_KEY = 'motherboardComponent';

    var DISPATCHER_KEY = 'motherboardDispatcher';


    var _reverseLookup = function (object, value) {
        var prop;
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                 if (object[prop] === value) {
                     return prop;
                 }
            }
        }
    };


    Parser.parse = function (scope) {
        scope = (scope === undefined) ? document.body : scope;
        var i;
        var l;
        var dispatcherElements = Array.prototype.slice.call(scope.querySelectorAll('[data-dispatcher]'));
        var componentElements = Array.prototype.slice.call(scope.querySelectorAll('[data-component]'));
        var dispatchers = Parser._app.dispatchers;
        var components = Parser._app.components;
        if (scope.dataset.dispatcher !== undefined) {
            dispatcherElements.unshift(scope);
        }
        if (scope.dataset.component !== undefined) {
            componentElements.unshift(scope);
        }

        l = dispatcherElements.length;
        for (i = 0; i < l; i++) {
            Parser.registerDispatcher(dispatcherElements[i]);
        }
        l = componentElements.length;
        for (i = 0; i < l; i++) {
            Parser.registerComponent(componentElements[i]);
        }

        l = dispatchers.length;
        for (i = 0; i < l; i++) {
            dispatchers[i].init();
        }
        l = components.length;
        for (i = 0; i < l; i++) {
            components[i].init();
        }
    };


    Parser.unparse = function (scope) {
        var component;
        var dispatcher;
        var componentElement;
        var dispatcherElement;
        var dispatcherElements = Array.prototype.slice.call(scope.querySelectorAll('[data-dispatcher]'));
        var componentElements = Array.prototype.slice.call(scope.querySelectorAll('[data-component]'));
        if (scope.dataset.dispatcher !== undefined) {
            dispatcherElements.unshift(scope);
        }
        if (scope.dataset.component !== undefined) {
            componentElements.unshift(scope);
        }
        var app = Parser._app;
        var appElement = app.element;
        var parentElement;
        var i = componentElements.length;
        while ((componentElement = componentElements[--i]) !== undefined) {
            component = componentElement[COMPONENT_KEY];
            component.disable();
            component.destroy();
            parentElement = componentElement;
            while ((parentElement = parentElement.parentElement) !== appElement) {
                dispatcher = parentElement[DISPATCHER_KEY];
                if (dispatcher !== undefined) {
                    dispatcher.components.splice(dispatcher.components.indexOf(component), 1);
                }
            }
            app.components.splice(app.components.indexOf(component), 1);
        }
        i = dispatcherElements.length;
        while ((dispatcherElement = dispatcherElements[--i]) !== undefined) {
            dispatcher.disable();
            dispatcher.destroy();
            app.dispatchers.splice(app.dispatchers.indexOf(dispatcher), 1);
        }
    };


    Parser.registerComponent = function (element) {
        var name = element.dataset.component;
        var T = Parser._componentLookup[name];
        if (T === undefined) {
            throw new Error('Could not find component named "' + name + '" in component dictionary.');
        }
        var instance = new T(element, JSON.parse(element.dataset.options || '{}'));
        var parentElement = element;
        var appElement = Parser._app.element;
        var dispatcher;
        while ((parentElement = parentElement.parentElement) !== appElement) {
            dispatcher = parentElement[DISPATCHER_KEY];
            if (dispatcher !== undefined) {
                dispatcher.components.push(instance);
            }
        }
        element[COMPONENT_KEY] = instance;
        Parser._app.components.push(instance);
        return instance;
    };


    Parser.registerDispatcher = function (element) {
        var name = element.dataset.dispatcher;
        var T = Parser._dispatcherLookup[name];
        if (T === undefined) {
            throw new Error('Could not find dispatcher named "' + name + '" in dispatcher dictionary.');
        }
        var instance = new T(element, JSON.parse(element.dataset.options || '{}'));
        element[DISPATCHER_KEY] = instance;
        Parser._app.dispatchers.push(instance);
        return instance;
    };


    Parser.create = function (T, element) {
        var match;
        var proto = T.prototype;
        if (proto instanceof App) {
            throw new Error('Cannot create App this way. Use `motherboard.mount`.');
        } else if (proto instanceof Dispatcher) {
            match = _reverseLookup(Parser._dispatcherLookup, T);
            if (match === undefined) {
                throw new Error('Type not found in dictionary of Dispatchers registered with `motherboard.dispatcher(s)`');
            }
            element.dataset.dispatcher = match;
            return Parser.registerDispatcher(element);
        } else if (proto instanceof Component) {
            match = _reverseLookup(Parser._componentLookup, T);
            if (match === undefined) {
                throw new Error('Type not found in dictionary of Components registered with `motherboard.component(s)`');
            }
            element.dataset.component = match;
            return Parser.registerComponent(element);
        } else {
            throw new Error('Could not create component. Type not found.');
        }
    };


    return Parser;
});
