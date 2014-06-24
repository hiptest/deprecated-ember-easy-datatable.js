(function () {
  module('%@ integration - table ordering'.fmt(Ember.EasyDatatable.toString()), {
    setup: function () {
      App.IndexView = Ember.View.extend({
        template: Ember.Handlebars.compile(makeSampleTable()),

        addDatatable: function () {
          Ember.EasyDatatable.create({tableSelector: '#sample1'});
        }.on('didInsertElement')
      });

      DatatableIntegrationHelpers.registerHelpers();
      App.injectTestHelpers();
    },

    teardown: function () {
      App.reset();
    }
  });

  test('Column order can be changed using ctrl + left/right arrow', function () {
    expect(8);

    visit('/')
      .assertDatatableHeader(["", "Name", "Value 1", "Value 2", "Value 3"])
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .pressEscInDatatable()
      .pressCtrlRightKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'If a cell is selected (not a <th> in the header), nothing happens when doing ctrl + right')
      .pressUpKeyInDatatable()
      .pressCtrlRightKeyInDatatable()
      .assertDatatableContent([
        ['0', 'Row 0', '10', '20'],
        ['1', 'Row 1', '11', '21'],
        ['2', 'Row 2', '12', '22'],
        ['3', 'Row 3', '13', '23']
      ], 'Otherwise, the selected is moved to the right')
      .assertDatatableHeader(["", "Value 1", "Name", "Value 2", "Value 3"],
        'And so is the header')
      .assertHightlightedCellsText(['Name', 'Row 0', 'Row 1', 'Row 2', 'Row 3'],
        'The moved column is stilln highlighted')
      .pressCtrlLeftKeyInDatatable()
      .assertDatatableHeader(["", "Name", "Value 1", "Value 2", "Value 3"],
        'Ctrl+left moves the row back')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'And the header too, of course');
  });

  test('Rows order can be changed using ctrl + up/down arrow', function () {
    expect(4);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .pressEscInDatatable()
      .pressCtrlUpKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'As for column ordering, the crlt+arrow combination only works on row headers')
      .pressLeftKeyInDatatable()
      .pressCtrlDownKeyInDatatable()
      .assertDatatableContent([
        ['Row 1', '1', '11', '21'],
        ['Row 0', '0', '10', '20'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'Ctrl+down moves the row down ...')
      .pressCtrlUpKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], '... and ctrl+up moves the row back up');
  });
})();