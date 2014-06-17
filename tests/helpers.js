function createSampleTable () {
  $('#qunit-fixtures')
    .append('<table id="%@"><thead>%@</thead><tbody>%@</tbody></table>'.fmt(
      'sample1',
      '<tr><th></th><th>Name</th><th>Value 1</th><th>Value 2</th><th>Value 3</th>',
      [0, 1, 2, 3].map(function (index) {
        return '<tr><th>#%@</th><td>Row %@</td><td>%@</td><td>%@</td><td>%@</th>'.fmt(
          index, index, index, 10 + index, 20 + index
        )
      }).join('')
    ));
}

function getTabindex (selector) {
  return $(selector).find('td, th').map(function () {
    return $(this).attr('tabindex')
  }).get();
}

function getSelectedCellsText () {
  return $('#sample1 .selected').map(function () {
    return $(this).text()
  }).get();
}

function selectCell (row, column, tableSelector) {
  tableSelector = tableSelector || '#sample1';
  var selectedRow;

  if (row == -1) {
    selectedRow = $('%@ thead tr'.fmt(tableSelector));
  } else {
    selectedRow = $('%@ tbody tr:nth(%@)'.fmt(tableSelector, row))
  }

  return selectedRow.find('th, td').eq(column).focus();
}

function registerDatatableHelpers () {
  function getDatatable () {
    return $('#qunit-fixtures table');
  }

  function getSelectedCell() {
    return $(document.activeElement).closest('td, th');
  }

  function getSelectedPosition () {
    var selected = getSelectedCell(),
      rowElement = selected.parent(),
      column = rowElement.find('td, th').index(selected),
      row = rowElement.closest('table').find('tr').index(rowElement);

    return {row: row, column: column}
  }

  Ember.Test.registerAsyncHelper('pressKey', function (app, keyCode, ctrlKey) {
    // Does not eask for an element, send event to the currently focused element.
    var
      $el = $(document.activeElement),
      eventData = { which: keyCode, keyCode: keyCode, ctrlKey: ctrlKey || false },
      keyDownEvent = Ember.$.Event("keydown", eventData),
      keyUpEvent = Ember.$.Event("keyup", eventData);

    Ember.run(function () {
      $el.trigger(keyDownEvent);
      $el.trigger(keyUpEvent);
    });
    return wait(app);
  });


  Ember.Test.registerAsyncHelper('debug', function (app) {
    return wait(app);
  });

  Ember.Test.registerAsyncHelper('assertDatatableHeader', function (app, content, message) {
    var headers = getDatatable().find('thead th').map(function () {
      return $(this).text();
    }).get();

    deepEqual(datatable, content, message || 'Headers are correct');
    return wait(app);
  });

  Ember.Test.registerAsyncHelper('assertDatatableContent', function (app, content, message) {
    var datatable = [];

    getDatatable().find('tbody tr').each(function () {
      datatable.push($(this).find('td').map(function () {
        return $(this).text();
      }).get());
    });

    deepEqual(datatable, content, message || 'The datatable content is correct');
    return wait(app);
  });

  Ember.Test.registerAsyncHelper('assertNoSelectedDatatableCell', function (app, message) {
    equal(getSelectedCell().length, 0, message || 'No cell is currently selected');
    return wait(app);
  });

  Ember.Test.registerAsyncHelper('assertSelectedDatatableCell', function (app, row, column, message) {
    deepEqual(getSelectedPosition(), {row: row, column: column}, message || 'The correct cell is selected');
    return wait(app);
  });

  Ember.Test.registerAsyncHelper('assertHightlightedCellsText', function (app, content, message) {
    console.log($(document.activeElement), $('table').find('td.selected, th.selected'))
    var highlighted = $('table').find('td.selected, th.selected').map(function () {
      return $(this).text();
    }).get();

    deepEqual(highlighted, content, message);
    return wait(app);
  });

  Ember.Test.registerAsyncHelper('clickOnDatatableCell', function (app, row, column) {
    var element = $('table tr:nth(%@)'.fmt(row)).find('td, th').eq(column);
    element.focus();

    return click(element);
  });

  Ember.Test.registerAsyncHelper('fillInDatatable', function (app, value) {
    return fillIn('table input', value);
  });

  Ember.Test.registerAsyncHelper('pressEnterInDatatable', function (app) {
    return pressKey(13)
  });

  Ember.Test.registerAsyncHelper('pressEscInDatatable', function (app) {
    return pressKey(27)
  });

  Ember.Test.registerAsyncHelper('pressUpKeyInDatatable', function (app) {
    return pressKey(38)
  });

  Ember.Test.registerAsyncHelper('pressDownKeyInDatatable', function (app) {
    return pressKey(40)
  });

  Ember.Test.registerAsyncHelper('pressRightKeyInDatatable', function (app) {
    return pressKey(39)
  });

  Ember.Test.registerAsyncHelper('pressLeftKeyInDatatable', function (app) {
    return pressKey(37)
  });
}