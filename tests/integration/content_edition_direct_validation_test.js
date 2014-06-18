(function () {
  module('%@ integration - content edition with direct validation'.fmt(Ember.EasyDatatable.toString()), {
    setup: function () {
      App.IndexView = Ember.View.extend({
        template: Ember.Handlebars.compile(makeSampleTable()),

        addDatatable: function () {
          Ember.EasyDatatable.create({
            tableSelector: '#sample1',
            validateCellValue: function (value, row, column) {
              // Only numeric values are allowed in the cells
              return !Ember.isNone(value.match(/^[0-9]+$/));
            },

            validateRowHeaderValue: function (value, row, column) {
              // Should be #<numeric value>
              return !Ember.isNone(value.match(/^#[0-9]+$/));
            },

            validateColumnHeaderValue: function (value, row, column) {
              // Should be "Value <numeric value>"
              return !Ember.isNone(value.match(/^Value [0-9]+$/));
            }
          });
        }.on('didInsertElement')
      });

      registerDatatableHelpers();
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
      ])
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
      .assertHightlightedCellsText(['#123', 'Row 2', '2', '12', '22'])
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
      .assertEditorNotShown(
        'The validation worked so the editor is hidden now')
      .assertCurrentCellHasNotError()
      .assertHightlightedCellsText(['Value 951', '10', '11', '12', '13'])
  });
})();