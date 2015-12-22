define(function (require) {
    'use strict';

    var $ = require('jquery');
    var deparam = require('jquery-deparam');
    var Component = require('motherboard').Component;


    function FormComponent (element, options) {
        Component.call(this, element, options);

    }
    FormComponent.prototype = Object.create(Component.prototype);
    var proto = FormComponent.prototype;
    proto.constructor = FormComponent;


    FormComponent.EVENT = {
        SUBMIT: 'submit'
    };


    var _handleSubmit = function (e) {
        e.preventDefault();
        var request = $(this.element).serialize();
        var requestObject = $.deparam($(this.element).serialize());
        var i = this.element.elements.length;
        var element;
        var isValid = true;
        while ((element = this.element.elements[--i]) !== undefined) {
            if (element.checkValidity() === false) {
                isValid = false;
            }
        }
        if (isValid) {
            this.emit(FormComponent.EVENT.SUBMIT, {
                request: request,
                requestObject: requestObject
            });
        }
    };


    FormComponent.prototype.init = function () {
        this.createBinding(this.element, 'submit', _handleSubmit);
        this.enable();
    };


    return FormComponent;
});
