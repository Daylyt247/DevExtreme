import $ from 'jquery';
import { getGanttViewCore, Consts } from '../../../helpers/ganttHelpers.js';
import 'ui/gantt';
const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.createInstance = (settings) => {
            this.instance = this.$element.dxGantt(settings).dxGantt('instance');
        };

        this.$element = $('#gantt');
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

QUnit.module('Validate Dependencies', moduleConfig, () => {
    test('Finish to Start dependency type should move successor - when t1.start == t2.start and t1.end == t2.end', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 0;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.notDeepEqual(task2.start, updatedTask2.start);
        assert.notDeepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(task1.end, updatedTask2.start);
    });
    test('Finish to Start dependency type should move successor - when predecessor finishes after successor starts', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 0;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-17T05:00:00.000Z'),
            'end': new Date('2019-02-20T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.notDeepEqual(task2.start, updatedTask2.start);
        assert.notDeepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(task1.end, updatedTask2.start);
    });
    test('Finish to Start dependency type should NOT move successor - when predecessor finishes before successor starts', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 0;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-25T05:00:00.000Z'),
            'end': new Date('2019-02-28T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.notDeepEqual(task1.end, updatedTask2.start);
    });
    test('Finish to Start dependency type should NOT move successor - when predecessor.end == successor.start', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 0;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-24T09:00:00.000Z'),
            'end': new Date('2019-02-27T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(task1.end, updatedTask2.start);
    });
    test('Start to Start dependency type should NOT move successor - when t1.start == t2.start and t1.end == t2.end', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 1;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(updatedTask1.start, updatedTask2.start);
        assert.deepEqual(updatedTask1.end, updatedTask2.end);
    });
    test('Start to Start dependency type should NOT move successor - when predecessor starts before successor starts', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 1;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-22T05:00:00.000Z'),
            'end': new Date('2019-02-25T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.notDeepEqual(updatedTask1.start, updatedTask2.start);
        assert.notDeepEqual(updatedTask1.end, updatedTask2.end);

    });
    test('Start to Start dependency type should move successor - when predecessor starts after suscessor starts', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 1;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-11T05:00:00.000Z'),
            'end': new Date('2019-02-14T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-10T05:00:00.000Z'),
            'end': new Date('2019-02-13T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.notDeepEqual(task2.start, updatedTask2.start);
        assert.notDeepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(task1.start, updatedTask2.start);
        assert.deepEqual(task1.end, updatedTask2.end);
    });
    test('Finish to Finish dependency type should NOT move successor - when t1.start == t2.start and t1.end == t2.end', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 2;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(updatedTask1.start, updatedTask2.start);
        assert.deepEqual(updatedTask1.end, updatedTask2.end);
    });
    test('Finish to Finish dependency type should NOT move successor - when predecessor finishes before successor finishes', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 2;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-22T05:00:00.000Z'),
            'end': new Date('2019-02-25T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.notDeepEqual(updatedTask1.start, updatedTask2.start);
        assert.notDeepEqual(updatedTask1.end, updatedTask2.end);

    });
    test('Finish to Finish dependency type should move successor - when predecessor finishes after suscessor finishes', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 2;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-11T05:00:00.000Z'),
            'end': new Date('2019-02-14T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-10T05:00:00.000Z'),
            'end': new Date('2019-02-13T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.notDeepEqual(task2.start, updatedTask2.start);
        assert.notDeepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(task1.start, updatedTask2.start);
        assert.deepEqual(task1.end, updatedTask2.end);

    });
    test('Start to Finish dependency type should NOT move successor - when t1.start == t2.start and t1.end == t2.end', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 3;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(updatedTask1.start, updatedTask2.start);
        assert.deepEqual(updatedTask1.end, updatedTask2.end);
    });
    test('Start to Finish dependency type should move successor - when predecessor starts after successor finishes', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 3;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-17T05:00:00.000Z'),
            'end': new Date('2019-02-20T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.notDeepEqual(task2.start, updatedTask2.start);
        assert.notDeepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(task1.start, updatedTask2.end);
    });
    test('Start to Finish dependency type should NOT move successor - when predecessor start before successor finishes', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 3;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-25T05:00:00.000Z'),
            'end': new Date('2019-02-28T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.notDeepEqual(task1.start, updatedTask2.end);
    });
    test('Start to Finish dependency type should NOT move successor - when predecessor.start == successor.end', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 3;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-18T09:00:00.000Z'),
            'end': new Date('2019-02-21T05:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.deepEqual(task1.start, updatedTask1.start);
        assert.deepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(task1.start, updatedTask2.end);
    });
    test('Move predecessor should move successor', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 1;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };

        const newStart = new Date('2019-05-21T05:00:00.000Z');
        const newEnd = new Date('2019-05-24T09:00:00.000Z');

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const taskData = getGanttViewCore(this.instance).getTaskByPublicId(globalPrevInsertedKey);
        const taskMoveCommand = getGanttViewCore(this.instance).commandManager.updateTaskCommand;
        taskMoveCommand.execute(taskData.internalId, { start: newStart, end: newEnd });
        this.clock.tick();
        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.notDeepEqual(task1.start, updatedTask1.start);
        assert.notDeepEqual(task1.end, updatedTask1.end);
        assert.notDeepEqual(task2.start, updatedTask2.start);
        assert.notDeepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(updatedTask1.start, updatedTask2.start);
        assert.deepEqual(updatedTask1.end, updatedTask2.end);
    });
    test('Move predecessor should NOT move successor when enablePredecessorGap = true', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 3;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true, enablePredecessorGap: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };

        const newStart = new Date('2019-01-21T05:00:00.000Z');
        const newEnd = new Date('2019-01-24T09:00:00.000Z');

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const taskData = getGanttViewCore(this.instance).getTaskByPublicId(globalPrevInsertedKey);
        const taskMoveCommand = getGanttViewCore(this.instance).commandManager.updateTaskCommand;
        taskMoveCommand.execute(taskData.internalId, { start: newStart, end: newEnd });
        this.clock.tick();
        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.notDeepEqual(task1.start, updatedTask1.start);
        assert.notDeepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.notDeepEqual(updatedTask1.start, updatedTask2.start);
        assert.notDeepEqual(updatedTask1.end, updatedTask2.end);
    });
    test('Move predecessor should move successor even if enablePredecessorGap = true when under validation already', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 1;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true, enablePredecessorGap: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };

        const newStart = new Date('2019-01-21T05:00:00.000Z');
        const newEnd = new Date('2019-01-24T09:00:00.000Z');

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        const taskData = getGanttViewCore(this.instance).getTaskByPublicId(globalPrevInsertedKey);
        const taskMoveCommand = getGanttViewCore(this.instance).commandManager.updateTaskCommand;
        taskMoveCommand.execute(taskData.internalId, { start: newStart, end: newEnd });
        this.clock.tick();
        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.notDeepEqual(task1.start, updatedTask1.start);
        assert.notDeepEqual(task1.end, updatedTask1.end);
        assert.notDeepEqual(task2.start, updatedTask2.start);
        assert.notDeepEqual(task2.end, updatedTask2.end);
        assert.deepEqual(updatedTask1.start, updatedTask2.start);
        assert.deepEqual(updatedTask1.end, updatedTask2.end);
    });
    test('Move predecessor should NOT move successor even if enablePredecessorGap = true and lockPredecessorToSuccessor = false  when under validation already', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 1;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true, enablePredecessorGap: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };

        const newStart = new Date('2019-01-21T05:00:00.000Z');
        const newEnd = new Date('2019-01-24T09:00:00.000Z');

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();
        getGanttViewCore(this.instance).validationController.lockPredecessorToSuccessor = false;
        const taskData = getGanttViewCore(this.instance).getTaskByPublicId(globalPrevInsertedKey);
        const taskMoveCommand = getGanttViewCore(this.instance).commandManager.updateTaskCommand;
        taskMoveCommand.execute(taskData.internalId, { start: newStart, end: newEnd });
        this.clock.tick();
        const updatedTask1 = this.instance.getTaskData(globalPrevInsertedKey);
        const updatedTask2 = this.instance.getTaskData(globalLastInsertedKey);

        assert.notDeepEqual(task1.start, updatedTask1.start);
        assert.notDeepEqual(task1.end, updatedTask1.end);
        assert.deepEqual(task2.start, updatedTask2.start);
        assert.deepEqual(task2.end, updatedTask2.end);
        assert.notDeepEqual(updatedTask1.start, updatedTask2.start);
        assert.notDeepEqual(updatedTask1.end, updatedTask2.end);
    });
    test('TaskEdit dialog dependency validation', function(assert) {
        let globalLastInsertedKey = 0;
        let globalPrevInsertedKey = 0;
        const globalDependencyType = 0;
        const tasks = [];
        const options = {
            tasks: {
                keyExpr: 'my_id',
                dataSource: tasks
            },
            editing: { enabled: true },
            validation: { autoUpdateParentTasks: true, validateDependencies: true }
        };
        this.createInstance(options);
        this.instance.option('onTaskInserted', (e) => {
            globalPrevInsertedKey = globalLastInsertedKey;
            globalLastInsertedKey = e.key;
        });
        this.clock.tick();

        const task1 = {
            'my_id': 1000,
            'parentId': 0,
            'title': 'Task 1 ' + new Date().getMilliseconds(),
            'start': new Date('2019-02-21T05:00:00.000Z'),
            'end': new Date('2019-02-24T09:00:00.000Z'),
            'progress': 100
        };
        const task2 = {
            'my_id': 2000,
            'parentId': 0,
            'title': 'Task 2 ' + new Date().getMilliseconds(),
            'start': new Date('2019-02-17T05:00:00.000Z'),
            'end': new Date('2019-02-20T09:00:00.000Z'),
            'progress': 100
        };

        this.instance.insertTask(task1);
        this.clock.tick();
        this.instance.insertTask(task2);
        this.clock.tick(500);
        const dependency = { predecessorId: globalPrevInsertedKey, successorId: globalLastInsertedKey, type: globalDependencyType };
        this.instance.insertDependency(dependency);
        this.clock.tick();

        this.instance.showTaskDetailsDialog(globalLastInsertedKey);
        this.clock.tick();
        let $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');

        const startTextBox = $dialog.find('.dx-datebox').eq(0).dxDateBox('instance');

        startTextBox.option('value', task1.start);

        const $okButton = $dialog.find('.dx-popup-bottom').find('.dx-button').eq(0);
        $okButton.trigger('dxclick');
        $dialog = $('body').find(Consts.POPUP_SELECTOR);
        assert.equal($dialog.length, 1, 'dialog is shown');
        let isValidStartTextBox = startTextBox._getValidationErrors() === null;
        assert.notOk(isValidStartTextBox, 'empty start validation');

        startTextBox.option('value', task1.end);
        isValidStartTextBox = startTextBox._getValidationErrors() === null;
        assert.ok(isValidStartTextBox, 'not empty start validation');

        $okButton.trigger('dxclick');
    });
});
