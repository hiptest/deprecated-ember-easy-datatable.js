(function () {
  module('%@ integration - inserting data'.fmt(EasyDatatable.toString()), {
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

        makeDefaultRow: function () {
          var row = EasyDatatable.makeListOf(this.get('headers.cells.length'));
          row[0] = {
            isHeader: true,
            isEditable: false
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

  test('Inserting a new row', function () {
    expect(3);

    visit('/')
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 1)
      .pressEscInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'Nothing happens if it is not done in a row header')
      .pressLeftKeyInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['', '', '', ''],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'Otherwise, a new empty row is added after the selected row');
  });

  test('Inserting a new row can be prevented by setting "canInsertRows" at the table level', function () {
    expect(2);

    visit('/')
      .then(function (app) {
        table.set('canInsertRows', false);
        return wait(app);
      })
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(1, 0)
      .pressEscInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'There is no row added');
  });

  test('It is also possible to avoid new rows at given indices', function () {
    expect(3);

    visit('/')
      .then(function (app) {
        table.get('body')[2].set('cells.firstObject.canInsertRowAfter', false);
        return wait(app);
      })
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(3, 0)
      .pressEscInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'There is no row added')
      .pressUpKeyInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['', '', '', ''],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'But rows can still be inserted at other places');
  });

  test('Inserting a new column', function () {
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
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'Nothing happens if it is not done in a column header')
      .pressUpKeyInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '', '0', '10', '20'],
        ['Row 1', '', '1', '11', '21'],
        ['Row 2', '', '2', '12', '22'],
        ['Row 3', '', '3', '13', '23']
      ], 'Otherwise, a new empty column is added after the selected column')
      .assertDatatableHeader([ "", 'Name', '', 'Value 1', 'Value 2', 'Value 3'],
        'An empty header is also added');
  });

  test('Inserting a new column can be prevented by setting "canInsertColumns" to false at table level', function () {
    expect(3);

    visit('/')
      .then(function (app) {
        table.set('canInsertColumns', false);
        return wait(app);
      })
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(0, 1)
      .pressEscInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'No column as been added')
      .assertDatatableHeader([ '', 'Name', 'Value 1', 'Value 2', 'Value 3'],
        'Headers have not changed');
    });

  test('It can also be prevented for specific columns', function () {
    expect(4);

    visit('/')
      .then(function (app) {
        table.get('headers.cells')[2].set('canInsertColumnAfter', false);
        return wait(app);
      })
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ])
      .clickOnDatatableCell(0, 2)
      .pressEscInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '20'],
        ['Row 1', '1', '11', '21'],
        ['Row 2', '2', '12', '22'],
        ['Row 3', '3', '13', '23']
      ], 'No column as been added')
      .assertDatatableHeader([ '', 'Name', 'Value 1', 'Value 2', 'Value 3'],
        'headers have not changed')
      .pressRightKeyInDatatable()
      .pressCtrlInserKeyInDatatable()
      .assertDatatableContent([
        ['Row 0', '0', '10', '', '20'],
        ['Row 1', '1', '11', '', '21'],
        ['Row 2', '2', '12', '', '22'],
        ['Row 3', '3', '13', '', '23']
      ], 'Columns can still be added in after other columns');
    });
})();