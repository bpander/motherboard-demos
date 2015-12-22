define(function (require) {
    'use strict';

    var Component = require('motherboard').Component;


    function TodoComponent (element, options) {
        Component.call(this, element, options);

    }
    TodoComponent.prototype = Object.create(Component.prototype);
    TodoComponent.prototype.constructor = TodoComponent;
    var proto = TodoComponent.prototype;


    TodoComponent.EVENT = {
        STATUS_CHANGE: 'complete',
        TEXT_CHANGE: 'textchange',
        REMOVE: 'remove'
    };


    var _handleCheckboxChange = function (e) {
        this.emit(TodoComponent.EVENT.STATUS_CHANGE, { complete: e.target.checked });
    };

    var _handleRemovalButtonClick = function () {
        this.emit(TodoComponent.EVENT.REMOVE);
    };

    var _handleLabelDblClick = function () {
        this.label.style.display = 'none';
        this.editField.style.display = '';
        this.editField.value = this.label.textContent;
        this.editField.select();
    };

    var _handleEditFieldBlur = function (e) {
        if (e.type === 'keyup' && e.keyCode !== 13) {
            return;
        }
        this.label.style.display = '';
        this.editField.style.display = 'none';
        this.label.textContent = this.editField.value;
        this.emit(TodoComponent.EVENT.TEXT_CHANGE, { text: this.editField.value });
    };


    TodoComponent.prototype.render = function (vm) {
        this.disable();
        this.bindings = [];

        this.element.innerHTML = `
            <input type="checkbox" ${ vm.complete ? 'checked' : '' } data-tag="TodoComponent:checkbox" />
            <label data-tag="TodoComponent:label">${vm.text}</label>
            <input type="text" data-tag="TodoComponent:editField" style="display: none;" />
            <button data-tag="TodoComponent:removalButton">Remove</button>
        `;

        this.editField = this.findWithTag('TodoComponent:editField');
        this.label = this.findWithTag('TodoComponent:label');

        this.createBinding(this.findWithTag('TodoComponent:checkbox'), 'change', _handleCheckboxChange);
        this.createBinding(this.label, 'dblclick', _handleLabelDblClick);
        this.createBinding(this.editField, 'keyup', _handleEditFieldBlur);
        this.createBinding(this.editField, 'blur', _handleEditFieldBlur)
        this.createBinding(this.findWithTag('TodoComponent:removalButton'), 'click', _handleRemovalButtonClick);
        this.enable();
    };


    return TodoComponent;
});
