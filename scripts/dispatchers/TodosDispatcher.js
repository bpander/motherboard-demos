define(function (require) {
    'use strict';

    var Dispatcher = require('motherboard').Dispatcher;
    var Parser = require('motherboard').Parser;
    var FormComponent = require('components/FormComponent');
    var TodoComponent = require('components/TodoComponent');
    var TodoRepository = require('repositories/TodoRepository');


    function TodosDispatcher (element, options) {
        Dispatcher.call(this, element, options);

        this.todoList = this.findWithTag('TodosDispatcher:todoList');

        this.checkAllBox = this.findWithTag('TodosDispatcher:checkAllBox');

        this.remainingCount = this.findWithTag('TodosDispatcher:remainingCount');

        this.clearCompletedButton = this.findWithTag('TodosDispatcher:clearCompletedButton');

        this.footer = this.findWithTag('TodosDispatcher:footer');

        this.formComponent = null;

        this.filters = {};

        this.models = [];

        this.todoRepository = new TodoRepository();

    }
    TodosDispatcher.prototype = Object.create(Dispatcher.prototype);
    var proto = TodosDispatcher.prototype;
    proto.constructor = TodosDispatcher;


    var MODEL_ID_KEY = 'todosModelId';


    var _handleSubmit = function (e) {
        var model = this.todoRepository.create(e.data.requestObject);
        this.add([ model ]);
        this.formComponent.element.reset();
        this.updateUI();
    };


    var _handleTodoStatusChange = function (e) {
        this.toggleComplete([ e.target ], e.data.complete);
        this.updateUI();
    };


    var _handleTodoTextChange = function (e) {
        var guid = e.target.element.dataset[MODEL_ID_KEY];
        this.todoRepository.update(guid, { text: e.data.text });
    };


    var _handleTodoRemove = function (e) {
        var guid = e.target.element.dataset[MODEL_ID_KEY];
        this.todoRepository.delete(guid);
        this.remove([ e.target ]);
        this.updateUI();
    };


    var _handleCheckAllChange = function (e) {
        this.toggleComplete(this.getComponents(TodoComponent), e.target.checked);
        this.updateUI();
    };


    var _handleClearCompletedClick = function () {
        var models = this.todoRepository.clearCompleted();
        this.updateList();
        this.updateUI();
    };


    proto.init = function () {
        this.formComponent = this.getComponent(FormComponent);

        this.createBinding(this.formComponent, FormComponent.EVENT.SUBMIT, _handleSubmit);
        this.createBinding(this.checkAllBox, 'change', _handleCheckAllChange);
        this.createBinding(this.clearCompletedButton, 'click', _handleClearCompletedClick);
        this.enable();
    };


    proto.updateList = function () {
        this.models = this.todoRepository.fetch(this.filters);
        this.remove(this.getComponents(TodoComponent));
        this.add(this.models);
    };


    proto.add = function (models) {
        models.forEach(function (model) {
            var element = this.todoList.appendChild(document.createElement('li'));
            var component = Parser.create(TodoComponent, element, { option: true });
            component.render(model.data);
            element.dataset[MODEL_ID_KEY] = model.guid;
            this.createBinding(component, TodoComponent.EVENT.STATUS_CHANGE, _handleTodoStatusChange).enable();
            this.createBinding(component, TodoComponent.EVENT.TEXT_CHANGE, _handleTodoTextChange).enable();
            this.createBinding(component, TodoComponent.EVENT.REMOVE, _handleTodoRemove).enable();
        }, this);
    };


    proto.remove = function (todoComponents) {
        todoComponents.forEach(function (todoComponent) {
            var element = todoComponent.element;
            var id = element.dataset[MODEL_ID_KEY];
            Parser.unparse(todoComponent.element);
            element.parentNode.removeChild(element);
        }, this);
    };


    proto.toggleComplete = function (todoComponents, isComplete) {
        todoComponents.forEach(function (todoComponent) {
            var guid = todoComponent.element.dataset[MODEL_ID_KEY];
            this.todoRepository.update(guid, { complete: isComplete });
            todoComponent.checkbox.checked = isComplete;
        }, this);
    };


    proto.updateUI = function () {
        var models = this.models;
        if (models.length <= 0) {
            this.footer.style.display = 'none';
            this.checkAllBox.style.display = 'none';
            return;
        }
        console.log(models);
        var completedCount = models.filter(model => model.data.complete).length;
        var remainingCount = models.length - completedCount;
        var areAllComplete = remainingCount <= 0;

        this.footer.style.display = '';
        this.checkAllBox.style.display = '';
        this.checkAllBox.checked = areAllComplete;

        this.remainingCount.innerHTML = remainingCount;
        this.clearCompletedButton.disabled = completedCount <= 0;
    };


    proto.filter = function (filters) {
        this.filters = filters;
        this.updateList();
    };


    return TodosDispatcher;
});
