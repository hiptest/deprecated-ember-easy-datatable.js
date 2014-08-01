(function () {
  var table;
  module('%@ integration - index cells'.fmt(EasyDatatable.toString()), {
    setup: function () {
      EasyDatatable.declareDatatable(App);
      table = EasyDatatable.makeDatatable({
        headers: ['', 'Index', 'Original name'],
        body: [
          [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 1'],
          [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 2'],
          [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 3'],
          [{isHeader: true, isEditable: false}, {isIndex: true}, 'Row 4']
        ],

        makeDefaultRow: function () {
          var row = EasyDatatable.makeListOf(this.get('headers.cells.length'));
          row[0] = {
            isHeader: true,
            isEditable: false
          };
          row[1] = {
            isIndex: true
          };
          return row;
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

  test('When isIndex is set to true, the cell displays the row + 1', function () {
    expect(1);

    visit('/')
      .assertDatatableContent([
        ['1', 'Row 1'],
        ['2', 'Row 2'],
        ['3', 'Row 3'],
        ['4', 'Row 4']
      ]);
  });

  test('Is keeps showing the correct value after insertion, removing or reordering', function () {
    expect(4);

    visit('/')
      .assertDatatableContent([
        ['1', 'Row 1'],
        ['2', 'Row 2'],
        ['3', 'Row 3'],
        ['4', 'Row 4']
      ])
      .clickOnDatatableCell(1, 0)
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['1', 'Row 1'],
        ['2', ''],
        ['3', 'Row 2'],
        ['4', 'Row 3'],
        ['5', 'Row 4']
      ])
      .pressCtrlDelKeyInDatatable()
      .assertDatatableContent([
        ['1', 'Row 1'],
        ['2', 'Row 2'],
        ['3', 'Row 3'],
        ['4', 'Row 4']
      ])
      .pressCtrlDownKeyInDatatable()
      .assertDatatableContent([
        ['1', 'Row 1'],
        ['2', 'Row 3'],
        ['3', 'Row 2'],
        ['4', 'Row 4']
      ]);
  });
})();