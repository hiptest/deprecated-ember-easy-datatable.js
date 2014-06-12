(function () {
  module(Ember.EasyDatatable.toString(), {
    setup: function () {
      createSampleTable();
    },

    teardown: function () {
      $('#qunit-fixtures table').remove();
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
})();