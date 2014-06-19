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
})();