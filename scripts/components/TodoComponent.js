define(function (require) {
    'use strict';

    var Component = require('motherboard').Component;


    function TodoComponent (element, options) {
        Component.call(this, element, options);

    }
    TodoComponent.prototype = Object.create(Component.prototype);
    TodoComponent.prototype.constructor = TodoComponent;
    var proto = TodoComponent.prototype;


    TodoComponent.options = {
        editingClass: 'editing'
    };


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
        this.element.classList.add(this.options.editingClass);
        this.editField.value = this.label.textContent;
        this.editField.select();
    };

    var _handleEditFieldBlur = function (e) {
        if (e.type === 'keyup' && e.keyCode !== 13) {
            return;
        }
        this.element.classList.remove(this.options.editingClass);
        this.label.textContent = this.editField.value;
        this.emit(TodoComponent.EVENT.TEXT_CHANGE, { text: this.editField.value });
    };


    TodoComponent.prototype.render = function (vm) {
        this.disable();
        this.bindings = [];

        this.element.innerHTML = `
            <div class="view">
                <input class="toggle" type="checkbox" ${ vm.complete ? 'checked' : '' } data-tag="TodoComponent:checkbox" />
                <label data-tag="TodoComponent:label">${vm.text}</label>
                <button class="destroy" data-tag="TodoComponent:removalButton"></button>
            </div>
            <input type="text" class="edit" data-tag="TodoComponent:editField" />
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
