function registerDatatableHelpers () {
  function getDatatable () {
    return $('#app table');
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
    // Does not ask for an element, send event to the currently focused element.
    var
      $el = $(document.activeElement),
      eventData = {
        which: keyCode,
        keyCode: keyCode,
        key: String.fromCharCode(keyCode),
        ctrlKey: ctrlKey || false
      },
      keyDownEvent = Ember.$.Event("keydown", eventData),
      keyUpEvent = Ember.$.Event("keyup", eventData);

    Ember.run(function () {
      var focused, character = String.fromCharCode(keyCode);

      $el.trigger(keyDownEvent);
      $el.trigger(keyUpEvent);

      focused = $(document.activeElement);

      // Update input value if needed
      if (focused.is('input[type=text]') && character.match(/[a-zA-Z0-9 ]/)) {
        focused.val('%@%@%@'.fmt(
          focused.val().slice(0, focused.get(0).selectionStart),
          String.fromCharCode(keyCode),
          focused.val().slice(focused.get(0).selectionEnd)))
      }
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

  Ember.Test.registerAsyncHelper('typeInDatatable', function (app, value) {
    if (value === '') {
      return wait(app);
    }

    return pressKey(value.charCodeAt(0)).then(function () {
      return typeInDatatable(value.slice(1));
    })
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