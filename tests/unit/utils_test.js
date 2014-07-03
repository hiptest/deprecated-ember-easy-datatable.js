(function () {
  module(Ember.EasyDatatableUtils.toString(), {
    setup: function () {
      createSampleTable();
    },

    teardown: function () {
      $('#qunit-fixtures').empty();
    }
  });

  test('table property', function () {
    var sut = Ember.Object.createWithMixins(Ember.EasyDatatableUtils, {
      tableSelector: '#sample1'
    });

    deepEqual(sut.get('table'), $('#sample1'), 'Provides the table selected with jQuery');
  });

  test('addTabindex', function () {
    deepEqual(getTabindex('#sample1'), [],
      'No tabindex is set by default');

    Ember.Object.createWithMixins(Ember.EasyDatatableUtils, {
      tableSelector: '#sample1',
      tabindex: '3.14'
    });

    var tabIndexes = getTabindex('#sample1');
    equal(tabIndexes.length, 25, 'Each cell got a tabIndex after creation of the EasyDatatable');
    deepEqual(tabIndexes.uniq(), ['3.14'], 'The value at the object creation is used');
  });

  test('getSelectedCell', function () {
    var sut = Ember.Object.createWithMixins(Ember.EasyDatatableUtils, {
        tableSelector: '#sample1'
      }),
      cell = $('#sample1 thead th:first');

    cell.focus();
    deepEqual(sut.getSelectedCell().get(0), cell.get(0),
      'It gives the jQuery element of the focused object ...');

    cell.append('<input type="text" />')
      .find('input')
      .focus();

    deepEqual(sut.getSelectedCell().get(0), cell.get(0),
      'If the focus is in an element inside a cell, we still return the cell');

    $('#qunit-fixtures')
      .append('<input type="text" />')
      .find('input')
      .focus();

    equal(sut.getSelectedCell(), null,
      '... or null if the selected element does not belong to the table');
  });

  test('getColumnFor', function () {
    var sut = Ember.Object.createWithMixins(Ember.EasyDatatableUtils, {
      tableSelector: '#sample1'
    });

    equal(sut.getColumnFor($('#sample1 thead th:first')), 0,
      'It gives the column of the element ...');

    // Due to the <th> in each row, the 3rd <td> is the 4th cell.
    equal(sut.getColumnFor($('#sample1 tr:nth(3) td:nth(3)')), 4,
      '... as expected');
  });

  test('getRowFor', function () {
    var sut = Ember.Object.createWithMixins(Ember.EasyDatatableUtils, {
      tableSelector: '#sample1'
    });

    equal(sut.getRowFor($('#sample1 tbody tr:nth(3) td:nth(3)')), 3,
      'It gives the row of the element ...');

    equal(sut.getRowFor($('#sample1 thead th:first')), -1,
      '... except for header element, there it returns -1');
  });

  test('notifyEvent', function () {
    var sut = Ember.Object.createWithMixins(Ember.EasyDatatableUtils);

    sut.notifyEvent('someEvent', {my: 'data'});
    ok(true, 'If no datatable is set, nothing happens ...');

    sut.set('datatable', Ember.Object.create({
      dispatchEvent: Ember.K
    }));

    sinon.spy(sut.get('datatable'), 'dispatchEvent');
    sut.notifyEvent('someEvent', {my: 'data'});

    deepEqual(sut.get('datatable').dispatchEvent.getCall(0).args, ['someEvent', {my: 'data'}],
      'Otherwise it calls the "dispatchEvent" method on the datatable');

    sut.get('datatable').dispatchEvent.restore();
  });

  test('validateAndProcess', function () {
    var sut = Ember.Object.createWithMixins(Ember.EasyDatatableUtils, {
      booleanValidator: function (x) {
        return x > 1;
      },

      promiseValidator: function (x) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
          if (x > 1) {
            resolve();
          } else {
            reject();
          }
        });
      },

      otherValidator: function () {
        return [];
      },

      successCallback: Ember.K,
      failureCallback: Ember.K
    });

    sinon.stub(sut, 'processForBoolean', Ember.K);
    sinon.stub(sut, 'processForPromise', Ember.K);
    sinon.spy(sut, 'booleanValidator');
    sinon.spy(sut, 'promiseValidator');

    sut.validateAndProcess(sut.booleanValidator, sut.successCallback, sut.failureCallback, [1, 2, 3]);
    deepEqual(sut.booleanValidator.getCall(0).args, [1, 2, 3],
      'It calls the validator to determine the result type ...');
    deepEqual(sut.processForBoolean.getCall(0).args, [false, sut.successCallback, sut.failureCallback, [1, 2, 3]],
      '... and calls the processor for the type, using the result as first argument');

    sut.validateAndProcess(sut.otherValidator, sut.successCallback, sut.failureCallback, [7, 8, 9]);
    ok(sut.processForBoolean.calledTwice,
      'It uses booleanValidator by default (if the result is not a Ember.RSVP.Promise)');

    sut.validateAndProcess(sut.promiseValidator, sut.successCallback, sut.failureCallback, [4, 5, 6]);
    deepEqual(sut.promiseValidator.getCall(0).args, [4, 5, 6],
      'The process with promise is the same, calling the validator ...');
    deepEqual(sut.processForPromise.getCall(0).args.slice(1), [sut.successCallback, sut.failureCallback, [4, 5, 6]],
      '... calling the correct processor ...');
    ok(sut.processForPromise.getCall(0).args[0] instanceof Ember.RSVP.Promise,
      '... using the validation result as first argument');

    sut.processForBoolean.restore();
    sut.processForPromise.restore();
    sut.booleanValidator.restore();
    sut.promiseValidator.restore();
  });

  test('processForBoolean', function () {
    var sut = Ember.Object.createWithMixins(Ember.EasyDatatableUtils, {
      successCallback: Ember.K,
      failureCallback: Ember.K
    });

    sinon.spy(sut, 'successCallback');
    sinon.spy(sut, 'failureCallback');

    sut.processForBoolean(true, sut.successCallback, sut.failureCallback, [1, 2, 3]);
    deepEqual(sut.successCallback.getCall(0).args, [1, 2, 3],
      'If the result is true, it calls the success callback ...');

    sut.processForBoolean(false, sut.successCallback, sut.failureCallback, [4, 5, 6]);
    deepEqual(sut.failureCallback.getCall(0).args, [4, 5, 6],
      '... otherwise it calls the failure callback');

    sut.successCallback.restore();
    sut.failureCallback.restore();
  });

  test('processForPromise', function () {

    var sut = Ember.Object.createWithMixins(Ember.EasyDatatableUtils, {
      promiseValidator: function (x) {
        return new Ember.RSVP.Promise(function(resolve, reject){
          if (x > 2) {
            resolve(x);
          } else {
            reject(x);
          }
        });
      },
      successCallback: Ember.K,
      failureCallback: Ember.K
    });

    sinon.spy(sut, 'successCallback');
    sinon.spy(sut, 'failureCallback');

    Ember.run(function () {
      sut.processForPromise(sut.promiseValidator(3), sut.successCallback, sut.failureCallback, [1, 2, 3]);
    });
    deepEqual(sut.successCallback.getCall(0).args, [1, 2, 3],
      'If the result is true, it calls the success callback ...');

    Ember.run(function() {
      sut.processForPromise(sut.promiseValidator(0), sut.successCallback, sut.failureCallback, [4, 5, 6]);
    });
    deepEqual(sut.failureCallback.getCall(0).args, [4, 5, 6],
      '... otherwise it calls the failure callback');

    sut.successCallback.restore();
    sut.failureCallback.restore();
 });
})();