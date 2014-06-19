(function () {
  var sut;

  module(Ember.EasyDatatableHighlighter.toString(), {
    setup: function () {
      createSampleTable();
      sut = Ember.Object.createWithMixins(Ember.EasyDatatableHighlighter, {
        tableSelector: '#sample1'}
      );
    },

    teardown: function () {
      $('#qunit-fixtures').empty();
    }
  });

  test('notifyCellSelection', function () {
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