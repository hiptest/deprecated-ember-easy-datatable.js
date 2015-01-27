(function () {
  module('%@ integration - deleting data'.fmt(EasyDatatable.toString()), {
    setup: function () {
      EasyDatatable.declareDatatable(App);
      table = EasyDatatable.makeDatatable({
        headers: ['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
        body: [
          [{isHeader: true, value: '#0'}, 'Row 0', 0, 10, 20],
          [{isHeader: true, value: '#1'}, 'Row 1', 1, 11, 21],
          [{isHeader: true, value: '#2'}, 'Row 2', 2, 12, 22],
          [{isHeader: true, value: '#3'}, 'Row 3', 3, 13, 23]
        ]
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

  test('Removing a row', function () {
    expect(7);

    visit('/');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(1, 1);
    pressEscInDatatable();
    pressCtrlDelKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'Nothing happens if it is not done in a row header');
    pressLeftKeyInDatatable();
    pressCtrlDelKeyInDatatable();
    assertDatatableContent([
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'Otherwise, the current row is removed');
    assertSelectedDatatableCell(1, 0,
      'The row below is selected after deletion');
    pressDownKeyInDatatable();
    pressDownKeyInDatatable();
    pressCtrlDelKeyInDatatable();
    assertDatatableContent([
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22']
    ]);
    assertSelectedDatatableCell(2, 0,
      'If the last row is selected, the selection moves the the row above');
    pressCtrlDelKeyInDatatable();
    pressCtrlDelKeyInDatatable();
    assertSelectedDatatableCell(0, 0,
      'If the body is empty after deletion, selection moves to the header');
  });

  test('Row can me marked as non-removable', function () {
    expect(2);

    visit('/');
    andThen(function () {
      table.set('body.firstObject.cells.firstObject.isRemovable', false);
    });
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(1, 0);
    pressEscInDatatable();
    pressCtrlDelKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'Nothing happens as the row is marked as non-removable');
  });

  test('Removing a column', function () {
    expect(4);

    visit('/');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(1, 1);
    pressEscInDatatable();
    pressCtrlDelKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'Nothing happens if it is not done in a column header');
    pressUpKeyInDatatable();
    pressCtrlDelKeyInDatatable();
    assertDatatableContent([
      ['0', '10', '20'],
      ['1', '11', '21'],
      ['2', '12', '22'],
      ['3', '13', '23']
    ], 'Otherwise, the current row is removed');
    assertDatatableHeader([ "", 'Value 1', 'Value 2', 'Value 3'],
      'The header is also removed');
  });

  test('Columns can be marked as non-removable', function () {
    expect(3);

    visit('/');
    andThen(function () {
      table.get('headers.cells')[1].set('isRemovable', false);
    });
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(0, 1);
    pressEscInDatatable();
    pressCtrlDelKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'Nothing happens as the column is marker as non removable');
    assertDatatableHeader(['', 'Name', 'Value 1', 'Value 2', 'Value 3'],
      'The header is still there');
  });
})();
