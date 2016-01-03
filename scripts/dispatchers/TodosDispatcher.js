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

        this.filters = this.findAllWithTag('TodosDispatcher:filter');

        this.checkAllBox = this.findWithTag('TodosDispatcher:checkAllBox');

        this.remainingCount = this.findWithTag('TodosDispatcher:remainingCount');

        this.clearCompletedButton = this.findWithTag('TodosDispatcher:clearCompletedButton');

        this.formComponent = null;

        this.todoRepository = new TodoRepository();

    }
    TodosDispatcher.prototype = Object.create(Dispatcher.prototype);
    var proto = TodosDispatcher.prototype;
    proto.constructor = TodosDispatcher;


    var MODEL_ID_KEY = 'todosModelId';


    var _handleSubmit = function (e) {
        var todoModel = this.todoRepository.create(e.data.requestObject);
        this.add(todoModel);
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


    var _handleFilterChange = function (e) {

    };


    var _handleTodoRemove = function (e) {
        this.remove([ e.target ]);
        this.updateUI();
    };


    var _handleCheckAllChange = function (e) {
        this.toggleComplete(this.getComponents(TodoComponent), e.target.checked);
        this.updateUI();
    };


    var _handleClearCompletedClick = function () {
        var completed = this.getComponents(TodoComponent).filter(todoComponent => todoComponent.checkbox.checked);
        this.remove(completed);
        this.updateUI();
    };


    proto.init = function () {
        this.formComponent = this.getComponent(FormComponent);

        this.createBinding(this.formComponent, FormComponent.EVENT.SUBMIT, _handleSubmit);
        this.createBinding(this.filters, 'change', _handleFilterChange);
        this.createBinding(this.checkAllBox, 'change', _handleCheckAllChange);
        this.createBinding(this.clearCompletedButton, 'click', _handleClearCompletedClick);
        this.enable();

        this.todoRepository.fetch().forEach(todo => this.add(todo));
        this.updateUI();
    };


    proto.add = function (todoModel) {
        var element = this.todoList.appendChild(document.createElement('li'));
        var component = Parser.create(TodoComponent, element, { option: true });
        component.render(todoModel.data);
        element.dataset[MODEL_ID_KEY] = todoModel.guid;
        this.createBinding(component, TodoComponent.EVENT.STATUS_CHANGE, _handleTodoStatusChange).enable();
        this.createBinding(component, TodoComponent.EVENT.TEXT_CHANGE, _handleTodoTextChange).enable();
        this.createBinding(component, TodoComponent.EVENT.REMOVE, _handleTodoRemove).enable();
    };


    proto.remove = function (todoComponents) {
        todoComponents.forEach(function (todoComponent) {
            var element = todoComponent.element;
            var id = element.dataset[MODEL_ID_KEY];
            this.todoRepository.delete(id);
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
        var todoComponents = this.getComponents(TodoComponent);
        var completedCount = todoComponents.filter(c => c.checkbox.checked).length;
        var remainingCount = todoComponents.length - completedCount;
        var areAllComplete = remainingCount <= 0;

        this.checkAllBox.style.display = (todoComponents.length > 0) ? '' : 'none';
        this.checkAllBox.checked = areAllComplete;

        this.remainingCount.innerHTML = remainingCount;
        this.clearCompletedButton.disabled = completedCount <= 0;
    };


    return TodosDispatcher;
});
