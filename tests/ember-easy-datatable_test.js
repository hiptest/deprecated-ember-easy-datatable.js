(function () {
  module(Ember.EasyDatatable.toString(), {
    setup: function () {
      createSampleTable();
    },

    teardown: function () {
      $('#qunit-fixtures').empty();
    }
  });

  test('table property', function () {
    var sut = Ember.EasyDatatable.create({tableSelector: '#sample1'});

    deepEqual(sut.get('table'), $('#sample1'), 'Provides the table selected with jQuery');
  });

  test('addTabindex', function () {
    deepEqual(getTabindex('#sample1'), [],
      'No tabindex is set by default');

    Ember.EasyDatatable.create({tableSelector: '#sample1', tabindex: '3.14'});
    var tabIndexes = getTabindex('#sample1');

    equal(tabIndexes.length, 25, 'Each cell got a tabIndex after creation of the EasyDatatable');
    deepEqual(tabIndexes.uniq(), ['3.14'], 'The value at the object creation is used')
  });

  test('notifyCellSelection', function () {
    var sut = Ember.EasyDatatable.create({tableSelector: '#sample1'});

    deepEqual(getSelectedCellsText(), [],
      'There is no cell marked as selected yet');

    sut.set('selectedColumn', 2);
    deepEqual(getSelectedCellsText(), ['Value 1', '0', '1', '2', '3'],
      'Once the selectedColumn property is set, 5 cells are marked as selected ...');

    sut.set('selectedColumn', null);
    deepEqual(getSelectedCellsText(), [],
      '... and selection is removed if it is set to null');

    sut.set('selectedRow', 2);
    deepEqual(getSelectedCellsText(), ['#2', 'Row 2', '2', '12', '22'],
      'Setting the selectedRow property as the same effect on rows ...');

    sut.set('selectedRow', null);
    deepEqual(getSelectedCellsText(), [],
      '... and also empties the selection when set to null');
  });

  test('focusCell', function () {
    var sut = Ember.EasyDatatable.create({tableSelector: '#sample1'}),
      spy = sinon.spy(jQuery.fn, 'focus');

    sut.focusCell(-1, 0);
    deepEqual(spy.firstCall.thisValue.get(0), $('#sample1 thead th:first').get(0),
      'If the row equals -1, the focus is given to the header cell');

    sut.focusCell(2, 4);
    // It might look weird to select the 4th cell and check that it's the 3rd <td>, but
    // in the table there is one <th> at the beginning of each row, so the 3rd <td> is the
    // fourth cell.
    deepEqual(spy.secondCall.thisValue.get(0), $('#sample1 tbody tr:nth(2) td:nth(3)').get(0),
      '... otherwise it uses the row from the tbody')

    jQuery.fn.focus.restore();
  });

  test('getSelectedCell', function () {
    var sut = Ember.EasyDatatable.create({tableSelector: '#sample1'});
      cell = $('#sample1 thead th:first');

    cell.focus();
    deepEqual(sut.getSelectedCell().get(0), cell.get(0),
      'It gives the jQuery element of the focused object ...')

    $('#qunit-fixtures')
      .append('<input type="text" />')
      .find('input')
      .focus();

    equal(sut.getSelectedCell(), null,
      '... or null if the selected element does not belong to the table');
  });

  test('getColumnFor', function () {
    var sut = Ember.EasyDatatable.create({tableSelector: '#sample1'});

    equal(sut.getColumnFor($('#sample1 thead th:first')), 0,
      'It gives the column of the element ...');

    // Due to the <th> in each row, the 3rd <td> is the 4th cell.
    equal(sut.getColumnFor($('#sample1 tr:nth(3) td:nth(3)')), 4,
      '... as expected')
  });

  test('getRowFor', function () {
    var sut = Ember.EasyDatatable.create({tableSelector: '#sample1'});

    equal(sut.getRowFor($('#sample1 tbody tr:nth(3) td:nth(3)')), 3,
      'It gives the row of the element ...');

    equal(sut.getRowFor($('#sample1 thead th:first')), -1,
      '... except for header element, there it returns -1');
  });
})();