(function () {
  module(Ember.EasyDatatable.toString(), {
    setup: function () {
      createSampleTable();
    },

    teardown: function () {
      $('#qunit-fixtures').empty();
    }
  });

  test('addBehaviors', function () {
    var sut, classes = [
      'EasyDatatableHighlighter',
      'EasyDatatableKeyboardMoves',
      'EasyDatatableEditor'
      ];

    classes.forEach(function (cls) {sinon.spy(Ember[cls], 'create');});
    sut = Ember.EasyDatatable.create({
      tabindex: 3.14,
      tableSelector: '#sample1',
      selectionClass: 'easy-datatable-selected',
      protectedClass: '.easy-datatable-protected',
      validationErrorClasses: ['alert', 'alert-danger'],

      _data: [],

      validateCellValue: function (value, row, column) {
        // Yep that does not really make sense ...
        return row < value;
      },

      validateRowHeaderValue: function (value, row, column) {
        // See before :)
        return row + column > value;
      },

      validateColumnHeaderValue: function (value, row, column) {
        return column === row % value;
      },

      updateCellValue: function (value, row, column) {
        this._data[row][column] = value;
      },

      updateRowHeaderValue: function (value, row, column) {
        this._data[row].header = value;
      },

      updateColumnHeaderValue: function (value, row, column) {
        this._data.headers[column] = value;
      },
    });

    deepEqual(Ember.EasyDatatableHighlighter.create.getCall(0).args, [{
      datatable: sut,
      tabindex: 3.14,
      tableSelector: '#sample1',
      selectionClass: 'easy-datatable-selected'
    }], 'On creation, the highlighter gets the tabindex, tableSelector and also the class used to highlight the cells');

    deepEqual(Ember.EasyDatatableKeyboardMoves.create.getCall(0).args, [{
      datatable: sut,
      tabindex: 3.14,
      tableSelector: '#sample1',
    }], 'The keyboard mover only get the tabindex and tabselector');

    deepEqual(Ember.EasyDatatableEditor.create.getCall(0).args, [{
      datatable: sut,
      tabindex: 3.14,
      tableSelector: '#sample1',
      protectedClass: '.easy-datatable-protected',
      validationErrorClasses: ['alert', 'alert-danger'],
      validateCellValue: sut.validateCellValue,
      validateRowHeaderValue: sut.validateRowHeaderValue,
      validateColumnHeaderValue: sut.validateColumnHeaderValue,
      updateCellValue: sut.updateCellValue,
      updateRowHeaderValue: sut.updateRowHeaderValue,
      updateColumnHeaderValue: sut.updateColumnHeaderValue
    }], 'the editor gets a lot of argument');

    classes.forEach(function (cls) {Ember[cls].create.restore();});
  });

  test('makeSubObjectsCreationHash', function () {
    var sut = Ember.EasyDatatable.create({
      tabindex: 3.14,
      tableSelector: '#sample1'
    });

    deepEqual(sut.makeSubObjectsCreationHash([]), {
      datatable: sut,
      tabindex: 3.14,
      tableSelector: '#sample1'
    }, 'Default creation arguments are the datatable, tabindex and tableSelector (the ones used by EasyDatatableUtils)');

    sut.someValue = 42;
    deepEqual(sut.makeSubObjectsCreationHash(['someValue']), {
      datatable: sut,
      tabindex: 3.14,
      tableSelector: '#sample1',
      someValue: 42
    }, 'It can get values set in a classical JS way ...');

    sut.set('anotherValue', 'Tralala');
    deepEqual(sut.makeSubObjectsCreationHash(['anotherValue']), {
      datatable: sut,
      tabindex: 3.14,
      tableSelector: '#sample1',
      anotherValue: 'Tralala'
    }, '... and also the ones in an Ember way (get/set)');

    sut.someFunction = function (x) { return x + 1;};
    deepEqual(sut.makeSubObjectsCreationHash(['someFunction']), {
      datatable: sut,
      tabindex: 3.14,
      tableSelector: '#sample1',
      someFunction: sut.someFunction
    }, 'Functions can also be returned: note that it is the same function, not a copy (same thing applies for objects)');

    deepEqual(sut.makeSubObjectsCreationHash(['someValue', 'anotherValue', 'someFunction']), {
      datatable: sut,
      tabindex: 3.14,
      tableSelector: '#sample1',
      someValue: 42,
      anotherValue: 'Tralala',
      someFunction: sut.someFunction
    }, 'Of course any specified key is taken into account');

    deepEqual(sut.makeSubObjectsCreationHash(['unknownProperty']), {
      datatable: sut,
      tabindex: 3.14,
      tableSelector: '#sample1'
    }, 'In case the the asked key is unknown, it is not added to creation hash');
  });

  test('dispatchEvent', function () {
    var sut = Ember.EasyDatatable.extend({
      behaviorContructors: {
        highlighter: Ember.EasyDatatableHighlighter,
        keyboard: Ember.EasyDatatableKeyboardMoves.extend({
          doSomething: function (data) {}.on('someEvent'),
          shouldNotBeCalled: function (data) {}.on('someOtherEvent'),
        })
      },

      doSomethingElse: function (data) {}.on('someEvent')
    }).create();

    sinon.spy(sut.behaviors.keyboard, 'doSomething');
    sinon.spy(sut.behaviors.keyboard, 'shouldNotBeCalled');
    sinon.spy(sut, 'doSomethingElse');

    sut.dispatchEvent('someEvent', {x: 1});

    deepEqual(sut.behaviors.keyboard.doSomething.getCall(0).args, [{x: 1}],
      'If a listener exists, it is triggered on the datatable object ...');
    deepEqual(sut.doSomethingElse.getCall(0).args, [{x: 1}],
      '... and on each of its behaviors');

    equal(sut.behaviors.keyboard.shouldNotBeCalled.callCount, 0,
      'Of course, only the listeners are triggered');

    sut.behaviors.keyboard.doSomething.restore();
    sut.behaviors.keyboard.shouldNotBeCalled.restore();
    sut.doSomethingElse.restore();
  });
})();