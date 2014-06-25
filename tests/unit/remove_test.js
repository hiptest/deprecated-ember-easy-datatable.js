(function () {
  var sut;

  module(Ember.EasyDatatableRemover.toString(), {
    setup: function () {
      createSampleTable();
      sut = Ember.EasyDatatableRemover.create({
        tableSelector: '#sample1'
      });
    },

    teardown: function () {
      $('#qunit-fixtures').empty();
    }
  });

  test('canDeleteRow', function () {
    ok(sut.canDeleteRow(),
      'There is no special checks, this should be overriden if needed');
  });

  test('canDeleteColumn', function () {
    ok(sut.canDeleteColumn(),
      'There is no special checks, this should be overriden if needed');
  });

  test('deleteRow', function () {
    equal($('#sample1 tbody tr:nth(0)').text(), '#0Row 001020');
    sut.deleteRow(0);
    equal($('#sample1 tbody tr:nth(0)').text(), '#1Row 111121',
      'It removes the currently selected row');

    deepEqual($(document.activeElement).get(0), $('#sample1 tbody tr:nth(0) th').get(0),
      'It gives the focus to the row that was below');

    sut.deleteRow(2);
    deepEqual($(document.activeElement).get(0), $('#sample1 tbody tr:nth(1) th').get(0),
      'It the row was the last one, it gives focus to the one above');
  });

  test('deleteColumn', function () {
    deepEqual(getColumnText(2), ['Value 1', '0', '1', '2', '3']);

    sut.deleteColumn(2);
    deepEqual(getColumnText(2), ['Value 2', '10', '11', '12', '13'],
      'It removes the column at the given index');

    deepEqual($(document.activeElement).get(0), $('#sample1 thead th:nth(2)').get(0),
      'It gives the focus to the <th> in the column that was on the right');

    sut.deleteColumn(3);
    deepEqual($(document.activeElement).get(0), $('#sample1 thead th:nth(2)').get(0),
      'If the deleted column was the last one, then the focus is given to the previous column');
  });
})();