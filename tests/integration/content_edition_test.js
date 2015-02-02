(function () {
  var table;
  module('%@ integration - content edition'.fmt(EasyDatatable.toString()), {
    setup: function () {
      EasyDatatable.declareDatatable(App);
      Ember.TEMPLATES.easy_datatable = Ember.Handlebars.compile([
        '<a class="add-first-row" {{action \'addFirstRow\'}}>Add first row</a>',
        '<a class="add-last-row" {{action \'addLastRow\'}}>Add last row</a>',
        '<a class="add-first-column" {{action \'addFirstColumn\'}}>Add first column</a>',
        '<a class="add-last-column" {{action \'addLastColumn\'}}>Add last column</a>',
        '{{render "easy_datatable_table" model}}',
      ].join("\n"));
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

  test('click and edit', function () {
    expect(4);

    visit('/');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(1, 1);
    assertEditorShown();
    typeInDatatable('This is my row');
    pressEnterInDatatable();
    clickOnDatatableCell(0, 0);
    assertEditorShown();
    assertDatatableContent([
      ['This is my row', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
  });

  test('cell validation is called only once when pressing Enter key', function () {
    var count = 0;
    expect(3);

    table.validateCell = function countValidateCell(cell, position, value) {
      count += 1;
      return true;
    };

    visit('/');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(1, 1);
    typeInDatatable('This is my row');
    pressEnterInDatatable();
    assertDatatableContent([
      ['This is my row', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'After changing a cell value, the datatable is updated');
    andThen(function () {
      strictEqual(count, 1, 'and validation is called only once');
    });
  });

  test('cell validation is not called at all when pressing Escape key', function () {
    var count = 0;
    expect(3);

    table.validateCell = function countValidateCell(cell, position, value) {
      count += 1;
      return true;
    };

    visit('/');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(1, 1);
    typeInDatatable('This is my row');
    pressEscInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'After canceling a cell edition, the datatable is back to its original values');
    andThen(function () {
      strictEqual(count, 0, 'and validation is not called at all');
    });
  });

  test('cell validation is not called at all if not modified', function () {
    var count = 0;
    expect(4);

    table.validateCell = function countValidateCell(cell, position, value) {
      count += 1;
      return true;
    };

    visit('/');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(1, 1);
    pressEnterInDatatable();
    assertEditorNotShown();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'without editing, the datatable is the same!');
    andThen(function () {
      strictEqual(count, 0, 'and validation is not called at all');
    });
  });

  test('Clicking moves the editor', function () {
    expect(2);

    visit('/');
    clickOnDatatableCell(1, 1);
    assertEditorShown();
    clickOnDatatableCell(3, 3);
    assertEditorShown();
  });

  test('navigate, press enter and edit', function () {
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
    pressRightKeyInDatatable();
    pressDownKeyInDatatable();
    pressEnterInDatatable();
    assertEditorShown();
    typeInDatatable('My new value');
    pressEnterInDatatable();
    assertEditorNotShown();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', 'My new value', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
  });

  test('navigate, start typing to replace the cell content', function () {
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
    typeInDatatable('I type something without having an input');
    assertEditorShown();
    pressEnterInDatatable();
    assertEditorNotShown();
    assertDatatableContent([
      ['I type something without having an input', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
  });

  test('Cells with "isEditable" set to false can not be edited', function () {
    expect(6);

    visit('/');
    andThen(function () {
      table.set('headers.cells.firstObject.isEditable', false);
      table.get('body').forEach(function (row, index) {
        row.get('cells')[index % 2 === 0 ? 1 : 0].set('isEditable', false);
      });
    });
    clickOnDatatableCell(0, 0);
    assertEditorNotShown(
      'When clicking on the protected cell, the editor does not show up');
    clickOnDatatableCell(0, 1);
    assertEditorShown(
      '(but it still work on an editable cell)');
    pressEscInDatatable();
    pressDownKeyInDatatable();
    pressEnterInDatatable();
    assertEditorNotShown(
      'When pressing enter in a protected cell, we do not get the editor');
    pressDownKeyInDatatable();
    pressEnterInDatatable();
    assertEditorShown(
      '(but it still works in editable cells)');
    pressEscInDatatable();
    pressLeftKeyInDatatable();
    typeInDatatable('Hey');
    assertEditorNotShown(
      'Same principle when typing in a protected cell');
    pressDownKeyInDatatable();
    typeInDatatable('Ho');
    assertEditorShown(
      '(but it still works in editablecells)');
    pressEscInDatatable();
  });

  test('navigation based on enter', function () {
    expect(7);

    visit('/');
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', '1', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    clickOnDatatableCell(2, 2);
    typeInDatatable('x');
    pressEnterInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', 'x', '11', '21'],
      ['Row 2', '2', '12', '22'],
      ['Row 3', '3', '13', '23']
    ], 'After entering "x", the datatable content is correct');
    assertSelectedDatatableCell(3, 2,
      'If the cell value is validated using enter, then cell below is selected');
    typeInDatatable('y');
    pressTabKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', 'x', '11', '21'],
      ['Row 2', 'y', '12', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    assertSelectedDatatableCell(3, 3,
      'If the cell value is validated using tab, then cell on the right is selected');
    typeInDatatable('z');
    pressShiftTabKeyInDatatable();
    assertDatatableContent([
      ['Row 0', '0', '10', '20'],
      ['Row 1', 'x', '11', '21'],
      ['Row 2', 'y', 'z', '22'],
      ['Row 3', '3', '13', '23']
    ]);
    assertSelectedDatatableCell(3, 2,
      'If the cell value is validated using shift+tab, then cell on the left is selected');
  });
})();
