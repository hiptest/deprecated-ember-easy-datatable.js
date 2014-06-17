(function () {
  var sut, App = Ember.Application.create({
    rootElement: '#qunit-fixtures'
  });

  App.setupForTesting();
  registerDatatableHelpers();
  App.injectTestHelpers();

  Ember.Test.adapter = Ember.Test.QUnitAdapter.extend({
    exception: function (error) {
      console.log(error.stack);
      this._super(error);
    }
  }).create();

  module('%@: integration tests'.fmt(Ember.EasyDatatable.toString()), {
    setup: function () {
      createSampleTable();
      sut = Ember.EasyDatatable.create({tableSelector: '#sample1'});
    },

    teardown: function () {
      App.reset();
      $('#qunit-fixtures').empty();
    }
  });

  test('Keyboard navigation', function () {
    visit('/')
      .assertNoSelectedDatatableCell('No cell is selected by default')
      .clickOnDatatableCell(1, 1)
      .assertSelectedDatatableCell(1, 1)
      .pressRightKeyInDatatable()
      .assertSelectedDatatableCell(1, 1,
        'If the input is present, keyboard navigation does not have any effect')
      .pressUpKeyInDatatable()
      .pressDownKeyInDatatable()
      .pressLeftKeyInDatatable()
      .assertSelectedDatatableCell(1, 1)
      .pressEscInDatatable()
      .pressRightKeyInDatatable()
      .assertSelectedDatatableCell(1, 2,
        'Pressing ESC removes the input, so we can navigate with the keyboard')
      .pressDownKeyInDatatable()
      .assertSelectedDatatableCell(2, 2)
      .pressLeftKeyInDatatable()
      .assertSelectedDatatableCell(2, 1)
      .pressUpKeyInDatatable()
      .assertSelectedDatatableCell(1, 1)
      .pressUpKeyInDatatable()
      .assertSelectedDatatableCell(0, 1,
        'It is also possible to navigate to the header')
      .pressRightKeyInDatatable()
      .assertSelectedDatatableCell(0, 2)
      .pressLeftKeyInDatatable()
      .pressLeftKeyInDatatable()
      .pressDownKeyInDatatable()
      .pressDownKeyInDatatable()
      .assertSelectedDatatableCell(2, 0,
        'Navigation can also be done to the body <th> cells')
  });

  test('Highliting on header selection', function () {
    visit('/')
      .clickOnDatatableCell(1, 1)
      .pressEscInDatatable()
      .assertHightlightedCellsText([],
        'When a <td> cel is focused, it does not highlight anything')
      .pressUpKeyInDatatable()
      .assertHightlightedCellsText(['Name', 'Row 0', 'Row 1', 'Row 2', 'Row 3'],
        'If a cell in the <thead> is selected, then all cells in the column are highlited')
      .pressLeftKeyInDatatable()
      .assertHightlightedCellsText(['', '#0', '#1', '#2', '#3'],
        'It follows keyboard navigation')
      .pressDownKeyInDatatable()
      .assertHightlightedCellsText(['#0', 'Row 0', '0', '10', '20'],
        'If the focused cell is a <th> in the body, then the row is highlited')
      .pressDownKeyInDatatable()
      .assertHightlightedCellsText(['#1', 'Row 1', '1', '11', '21'],
        'It still follows keyboard navigation')
      .clickOnDatatableCell(0, 3)
      .assertHightlightedCellsText(['Value 2', '10', '11', '12', '13'],
        'Clicking to another <th> updates highliting')
      .clickOnDatatableCell(3, 0)
      .assertHightlightedCellsText(['#2', 'Row 2', '2', '12', '22'],
        'Same thing it a <th> in the body')
      .clickOnDatatableCell(2, 3)
      .assertHightlightedCellsText([])
  });

  test('Content edition', function () {
    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .fillInDatatable('This is my row')
      .pressEnterInDatatable()
      .assertDatatableContent([
        ['This is my row', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .pressRightKeyInDatatable()
      .pressDownKeyInDatatable()
      .pressEnterInDatatable()
      .fillInDatatable('My new value')
      .pressEnterInDatatable()
      .assertDatatableContent([
        ['This is my row', '0', '10', '20'],
        ['Row 1', 'My new value', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
  })
})();