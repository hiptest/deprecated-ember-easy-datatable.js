(function () {
  module('%@ integration - content edition with direct validation'.fmt(EasyDatatable.toString()), {
    setup: function () {
      EasyDatatable.declareDatatable(App);
      table = EasyDatatable.makeDatatable({
        headers: ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
        body: [
          [{isHeader: true, value: '#0'}, 'Row 0', 0, 10, 20],
          [{isHeader: true, value: '#1'}, 'Row 1', 1, 11, 21],
          [{isHeader: true, value: '#2'}, 'Row 2', 2, 12, 22],
          [{isHeader: true, value: '#3'}, 'Row 3', 3, 13, 23]
        ],

        validateCell: function (cell, position, value) {
          value = value.toString();
          if (position.row === -1) {
            // Should be "Value <numeric value>"
            return !Ember.isNone(value.match(/^Value [0-9]+$/));
          }

          if (cell.isHeader) {
            // Should be #<numeric value>
            return !Ember.isNone(value.match(/^#[0-9]+$/));
          }

          // Only numeric values are allowed in the cells
          return !Ember.isNone(value.match(/^[0-9]+$/));
        }
      });

      App.IndexView = Ember.View.extend({
        table: table,
        template: Ember.Handlebars.compile('{{render "easy_datatable" view.table}}'),
      });

      DatatableIntegrationHelpers.registerHelpers();
      App.injectTestHelpers();
    },

    teardown: function () {
      App.reset();
    }
  });

  test('Cell edition', function () {
    expect(6);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 2)
      .typeInDatatable('This is not an numeric value')
      .pressEnterInDatatable()
      .assertEditorShown(
        'The editor is still there as validation failed')
      .assertCurrentCellHasError()
      .pressEscInDatatable()
      .typeInDatatable('1664')
      .pressEnterInDatatable()
      .assertEditorNotShown(
        'The validation worked so the editor is hidden now')
      .assertCurrentCellHasNotError()
      .assertDatatableContent([
        ['Row 0', '1664', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ]);
  });

  test('Row header', function () {
    expect(7);

    visit('/')
      .clickOnDatatableCell(3, 0)
      .assertHightlightedCellsText(['#2', 'Row 2', '2', '12', '22'])
      .assertEditorShown()
      .typeInDatatable('I forgot it should be #something')
      .pressEnterInDatatable()
      .assertEditorShown(
        'The editor is still there as validation failed')
      .assertCurrentCellHasError()
      .pressEscInDatatable()
      .typeInDatatable('#123')
      .pressEnterInDatatable()
      .assertEditorNotShown(
        'The validation worked so the editor is hidden now')
      .assertCurrentCellHasNotError()
      .pressUpKeyInDatatable()
      .assertHightlightedCellsText(['#123', 'Row 2', '2', '12', '22']);
  });

  test('Column header', function () {
    expect(7);

    visit('/')
      .clickOnDatatableCell(0, 3)
      .assertHightlightedCellsText(['Value 2', '10', '11', '12', '13'])
      .assertEditorShown()
      .typeInDatatable('I forgot it should be #something')
      .pressEnterInDatatable()
      .assertEditorShown(
        'The editor is still there as validation failed')
      .assertCurrentCellHasError()
      .pressEscInDatatable()
      .typeInDatatable('Value 951')
      .pressEnterInDatatable()
      .pressUpKeyInDatatable()
      .assertEditorNotShown(
        'The validation worked so the editor is hidden now')
      .assertCurrentCellHasNotError()
      .assertHightlightedCellsText(['Value 951', '10', '11', '12', '13']);
  });
})();