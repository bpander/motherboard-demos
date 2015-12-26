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
    };


    var _handleTodoStatusChange = function (e) {
        var guid = e.target.element.dataset[MODEL_ID_KEY];
        this.todoRepository.update(guid, { complete: e.data.complete });
        this.updateCheckAllBox();
    };


    var _handleTodoTextChange = function (e) {
        var guid = e.target.element.dataset[MODEL_ID_KEY];
        this.todoRepository.update(guid, { text: e.data.text });
    };


    var _handleFilterChange = function (e) {

    };


    var _handleTodoRemove = function (e) {
        var id = e.target.element.dataset[MODEL_ID_KEY];
        var element = e.target.element;
        this.todoRepository.delete(id);
        Parser.unparse(e.target.element);
        element.parentNode.removeChild(element);
    };


    var _handleCheckAllChange = function (e) {
        var isComplete = e.target.checked;
        this.getComponents(TodoComponent).forEach(function (todoComponent) {
            todoComponent.setComplete(isComplete);
        });
    };


    proto.init = function () {
        this.formComponent = this.getComponent(FormComponent);

        this.createBinding(this.formComponent, FormComponent.EVENT.SUBMIT, _handleSubmit);
        this.createBinding(this.filters, 'change', _handleFilterChange);
        this.createBinding(this.checkAllBox, 'change', _handleCheckAllChange);
        this.enable();

        this.todoRepository.fetch().forEach(todo => this.add(todo));
        this.updateCheckAllBox();
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


    proto.updateCheckAllBox = function () {
        this.checkAllBox.checked = this.getComponents(TodoComponent).every(c => c.checkbox.checked);
    };


    return TodosDispatcher;
});
