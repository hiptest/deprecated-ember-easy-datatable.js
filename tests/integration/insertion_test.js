(function () {
  module('%@ integration - inserting data'.fmt(EasyDatatable.toString()), {
    setup: function () {
      EasyDatatable.declareDatatable(App);
      Ember.TEMPLATES.easy_datatable = Ember.Handlebars.compile([
        '{{render "easy_datatable_table" model}}',
        '<a class="add-first-row" {{action \'addFirstRow\'}}>Add first row</a>',
        '<a class="add-last-row" {{action \'addLastRow\'}}>Add last row</a>',
        '<a class="add-first-column" {{action \'addFirstColumn\'}}>Add first column</a>',
        '<a class="add-last-column" {{action \'addLastColumn\'}}>Add last column</a>',
      ].join("\n"));

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
    expect(5);

    visit('/');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(1, 1);
    pressEscInDatatable();
    pressCtrlInserKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'Nothing happens if it is not done in a row header');
    pressLeftKeyInDatatable();
    pressCtrlInserKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['', '', '', ''],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'Otherwise, a new empty row is added after the selected row');
    assertSelectedDatatableCell(2, 0,
      'The header of the new row is selected');
    clickOnDatatableCell(5, 0);
    pressEscInDatatable();
    pressCtrlInserKeyInDatatable();
    assertSelectedDatatableCell(6, 0,
      'Inserting the last row with a keyboard shortcut brings to the correct cell');
  });

  test('Inserting a new row can be prevented by setting "canInsertRows" at the table level', function () {
    expect(2);

    visit('/');
    andThen(function () {
      table.set('canInsertRows', false);
    });
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(1, 0);
    pressEscInDatatable();
    pressCtrlInserKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'There is no row added');
  });

  test('It is also possible to avoid new rows at given indices', function () {
    expect(3);

    visit('/');
    andThen(function (app) {
      table.get('body')[2].set('cells.firstObject.canInsertRowAfter', false);
    });
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(3, 0);
    pressEscInDatatable();
    pressCtrlInserKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'There is no row added');
    pressUpKeyInDatatable();
    pressCtrlInserKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['', '', '', ''],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'But rows can still be inserted at other places');
  });

  test('Add first row', function () {
    visit('/');
    click('a.add-first-row');
    assertDatatableContent([
      ['', '', '', ''],
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'A new row is added at the beginning of the datatable');
    assertSelectedDatatableCell(1, 0,
      'The first cell of the newly added row is selected');
  });

  test('Add last row', function () {
    visit('/');
    click('a.add-last-row');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
      ['', '', '', '']
    ], 'A new row is added at the end of the datatable');
    assertSelectedDatatableCell(5, 0,
      'The first cell of the newly added row is selected');
    andThen(function () {
      table.get('body').forEach(function (row, index) {
        row.set('cells.firstObject.canInsertRowAfter', index <= 1);
      });
    });
    click('a.add-last-row');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['', '', '', ''],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23'],
      ['', '', '', '']
    ], 'It will search for the last place where a row is insertable if needed');
  });

  test('Inserting a new column', function () {
    expect(6);

    visit('/');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(1, 1);
    pressEscInDatatable();
    pressCtrlInserKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'Nothing happens if it is not done in a column header');
    pressUpKeyInDatatable();
    pressCtrlInserKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '', '0', '10', '20'],
      ['Row 1', '', '1', '11', '21'],
      ['Row 2', '', '2', '12', '22'],
      ['Row 3', '', '3', '13', '23']
    ], 'Otherwise, a new empty column is added after the selected column');
    assertDatatableHeader([ "", 'Name', '', 'Value 1', 'Value 2', 'Value 3'],
      'An empty header is also added');
    assertSelectedDatatableCell(0, 2,
      'The correct header cell is selected after insertion');
    clickOnDatatableCell(0, 5);
    pressEscInDatatable();
    pressCtrlInserKeyInDatatable();
    assertSelectedDatatableCell(0, 6,
      'After inserting the last column, the correct cell is selected)');
  });

  test('Inserting a new column can be prevented by setting "canInsertColumns" to false at table level', function () {
    expect(3);

    visit('/');
    andThen(function () {
      table.set('canInsertColumns', false);
    });
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(0, 1);
    pressEscInDatatable();
    pressCtrlInserKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'No column as been added');
    assertDatatableHeader([ '', 'Name', 'Value 1', 'Value 2', 'Value 3'],
      'Headers have not changed');
    });

  test('It can also be prevented for specific columns', function () {
    expect(4);

    visit('/');
    andThen(function () {
      table.get('headers.cells')[2].set('canInsertColumnAfter', false);
    });
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(0, 2);
    pressEscInDatatable();
    pressCtrlInserKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'No column as been added');
    assertDatatableHeader([ '', 'Name', 'Value 1', 'Value 2', 'Value 3'],
      'headers have not changed');
    pressRightKeyInDatatable();
    pressCtrlInserKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '', '20'],
      ['Row 1', '1', '11', '', '21'],
      ['Row 2', '2', '12', '', '22'],
      ['Row 3', '3', '13', '', '23']
    ], 'Columns can still be added in after other columns');
    });

  test('Add first column', function () {
    visit('/');
    click('a.add-first-column');
    assertDatatableContent([
      ['', 'Row 0', '0', '10', '20'],
      ['', 'Row 1', '1', '11', '21'],
      ['', 'Row 2', '2', '12', '22'],
      ['', 'Row 3', '3', '13', '23']
    ], 'A new column is added at the beginning of the datatable');
    assertSelectedDatatableCell(0, 0,
      'The header cell of the newly added column is selected');
  });

  test('Add last column', function () {
    visit('/');
    click('a.add-last-column');
    assertDatatableContent([
      ['Row 0', '0', '10', '20', ''],
      ['Row 1', '1', '11', '21', ''],
      ['Row 2', '2', '12', '22', ''],
      ['Row 3', '3', '13', '23', '']
    ], 'A new column is added at the end of the datatable');
    assertSelectedDatatableCell(0, 5,
      'The header cell of the newly added row is selected');
    andThen(function () {
      table.get('headers.cells').forEach(function (cell, index) {
        cell.set('canInsertColumnAfter', index < 3);
      });
    });
    click('a.add-last-column');
    assertDatatableContent([
      ['Row 0', '0', '', '10', '20', ''],
      ['Row 1', '1', '', '11', '21', ''],
      ['Row 2', '2', '', '12', '22', ''],
      ['Row 3', '3', '', '13', '23', ''],
    ], 'It will search for the last place where a column is insertable if needed');
  });
})();

(function () {
  module('%@ integration - inserting data and edit first cell'.fmt(EasyDatatable.toString()), {
    setup: function () {
      EasyDatatable.declareDatatable(App);
      Ember.TEMPLATES.easy_datatable = Ember.Handlebars.compile([
        '{{render "easy_datatable_table" model}}',
        '<a class="add-first-row" {{action \'addFirstRow\'}}>Add first row</a>',
        '<a class="add-last-row" {{action \'addLastRow\'}}>Add last row</a>',
        '<a class="add-first-column" {{action \'addFirstColumn\'}}>Add first column</a>',
        '<a class="add-last-column" {{action \'addLastColumn\'}}>Add last column</a>',
      ].join("\n"));

      table = EasyDatatable.makeDatatable({
        headers: ['1', '2', '3', '4'],
        body: [
          [
            {isEditable: false, value: '', isHeader: true},
            {isEditable: false, value: ''},
            {isEditable: false, value: ''},
            {isEditable: false, value: ''}
          ],
          [
            {isEditable: false, value: '', isHeader: true},
            {isEditable: false, value: ''},
            {isEditable: false, value: ''},
            {isEditable: false, value: ''}
          ],
          [
            {isEditable: false, value: '', isHeader: true},
            {isEditable: false, value: ''},
            {isEditable: false, value: ''},
            {isEditable: false, value: ''}
          ],
          [
            {isEditable: false, value: '', isHeader: true},
            {isEditable: false, value: ''},
            {isEditable: false, value: ''},
            {isEditable: false, value: ''}
          ],
        ],

        makeDefaultRow: function () {
          return this.get('headers.cells').map(function (item, index) {
            return {
              value: index,
              isEditable: index > 2
            };
          });
        },

        makeDefaultColumn: function (columnId) {
          var column = [{
            isHeader: true,
            isEditable: false,
            value: columnId
          }];

          this.get('body').forEach(function (item, index) {
            column.push({
              value: index,
              isEditable: index > 2
            });
          });
          return column;
        }
      });

      App.IndexView = Ember.View.extend({
        table: table,
        template: Ember.Handlebars.compile('{{render "easy_datatable" view.table}}'),
      });

      App.EasyDatatableController.reopen({
        editAfterInsertion: true
      });

      DatatableIntegrationHelpers.registerHelpers();
      App.injectTestHelpers();
    },

    teardown: function () {
      App.EasyDatatableController.reopen({
        editAfterInsertion: false
      });
      App.reset();
    }
  });

  test('If option "editAfterInsertion" is set to true, the editor is shown after inserting a new row', function () {
    visit('/');
    clickOnDatatableCell(1, 0);
    pressCtrlInserKeyInDatatable();
    assertSelectedDatatableCell(2, 3,
      'The first editable cell is selected (not the header) ...');
    assertEditorShown('... and the editor is shown');
    click('a.add-last-row');
    assertSelectedDatatableCell(6, 3,
      'It also works when inserting last row ...');
    assertEditorShown();
    click('a.add-first-row');
    assertSelectedDatatableCell(1, 3,
      '... or the first row');
    assertEditorShown();
  });

  test('If option "editAfterInsertion" is set to true, the editor is shown after inserting a new column', function () {

    visit('/');
    clickOnDatatableCell(0, 2);
    pressEscInDatatable();
    pressCtrlInserKeyInDatatable();
    assertSelectedDatatableCell(4, 3,
      'The same principle applies when inserting columns');
    assertEditorShown('... and the editor is also shown');
    click('a.add-first-column');
    assertSelectedDatatableCell(4, 0,
      'It also works when inserting the first column ...');
    assertEditorShown();
    click('a.add-last-column');
    assertSelectedDatatableCell(4, 6,
      '... or the last one');
    assertEditorShown();
  });
})();
