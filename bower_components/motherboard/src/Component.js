define(['./Binding', './EventEmitter'], function (Binding, EventEmitter) {
    'use strict';


    function Component (element, options) {
        EventEmitter.call(this);

        this.element = element;

        this.options = Object.assign({}, this.constructor.options, options);

        this.bindings = [];

    }
    Component.prototype = Object.create(EventEmitter.prototype);
    var proto = Component.prototype;
    proto.constructor = Component;


    proto.init = function () {
        // Intentional no-op
    };


    proto.destroy = function () {
        var prop;
        this.disable();
        for (prop in this) {
            if (this.hasOwnProperty(prop)) {
                this[prop] = null;
            }
        }
    };


    proto.getTag = function () {
        return this.element.dataset.tag;
    };


    proto.findWithTag = function (tag) {
        return this.element.querySelector('[data-tag="' + tag + '"]');
    };


    proto.findAllWithTag = function (tag) {
        return this.element.querySelectorAll('[data-tag="' + tag + '"]');
    };


    proto.createBinding = function (emitter, type, handler) {
        var binding = new Binding(emitter, type, handler.bind(this));
        this.bindings.push(binding);
        return binding;
    };


    proto.enable = function () {
        this.bindings.forEach(function (binding) {
            binding.enable();
        });
    };


    proto.disable = function () {
        this.bindings.forEach(function (binding) {
            binding.disable();
        });
    };


    return Component;
});
