DatatableIntegrationHelpers = Ember.Object.create({
  helpers: {
    pressKey: function (keyCode, ctrlKey, shiftKey) {
      // Does not ask for an element, send event to the currently focused element.
      var
        $el = $(document.activeElement),
        eventData = {
          which: keyCode,
          keyCode: keyCode,
          key: String.fromCharCode(keyCode),
          ctrlKey: ctrlKey || false,
          shiftKey: shiftKey || false
        },
        keyDownEvent = Ember.$.Event("keydown", eventData),
        keyUpEvent = Ember.$.Event("keyup", eventData);

      Ember.run(function () {
        var focused, character = String.fromCharCode(keyCode);

        $el.trigger(keyDownEvent);
        $el.trigger(keyUpEvent);

        focused = $(document.activeElement);

        // Update input value if needed
        if (focused.is('input[type=text]') && character.match(/[a-zA-Z0-9 \.#\-_]/)) {
          focused.val('%@%@%@'.fmt(
            focused.val().slice(0, focused.get(0).selectionStart),
            String.fromCharCode(keyCode),
            focused.val().slice(focused.get(0).selectionEnd)));
        }
      });
    },

    debug: function () {
      debugger;
    },

    assertDatatableHeader: function (content, message) {
      deepEqual(this.getDatatableHeaders(), content, message || 'Headers are correct');
    },

    assertDatatableContent: function (content, message) {
      deepEqual(this.getDatatableContent(), content, message || 'The datatable content is correct');
    },

    assertNoSelectedDatatableCell: function (message) {
      equal(this.getSelectedCell().length, 0, message || 'No cell is currently selected');
    },

    assertSelectedDatatableCell: function (row, column, message) {
      deepEqual(this.getSelectedPosition(), {row: row, column: column}, message || 'The correct cell is selected');
    },

    assertHightlightedCellsText: function (content, message) {
      deepEqual(this.getHighlightedCellsText(), content, message || 'the correct cells are highlighted');
    },

    assertEditorShown: function (message) {
      ok(this.getInputField().length === 1, message || 'Editor is displayed');
    },

    assertEditorNotShown: function (message) {
      ok(this.getInputField().length === 0, message || 'Editor is not displayed');
    },

    assertCurrentCellHasError: function (message) {
      ok(this.getSelectedCell().hasClass('error'), message || 'Current cell is in error');
    },

    assertCurrentCellHasNotError: function (message) {
      ok(!this.getSelectedCell().hasClass('error'), message || 'Current cell is not in error');
    },

    clickOnDatatableCell: function (row, column) {
      var element = this.getDatatable().find('tr:nth(%@)'.fmt(row)).find('td, th').eq(column);
      element.focus();

      return click(element);
    },

    typeInDatatable: function (value) {
      if (value !== '') {
        return pressKey(value.charCodeAt(0))
          .typeInDatatable(value.slice(1));
      }
    },

    pressEnterInDatatable: function () {
      return pressKey(13);
    },

    pressEscInDatatable: function () {
      return pressKey(27);
    },

    pressUpKeyInDatatable: function () {
      return pressKey(38);
    },

    pressDownKeyInDatatable: function () {
      return pressKey(40);
    },

    pressRightKeyInDatatable: function () {
      return pressKey(39);
    },

    pressLeftKeyInDatatable: function () {
      return pressKey(37);
    },

    pressCtrlUpKeyInDatatable: function () {
      return pressKey(38, true);
    },

    pressCtrlDownKeyInDatatable: function () {
      return pressKey(40, true);
    },

    pressCtrlRightKeyInDatatable: function () {
      return pressKey(39, true);
    },

    pressCtrlLeftKeyInDatatable: function () {
      return pressKey(37, true);
    },

    pressCtrlDelKeyInDatatable: function () {
      return pressKey(46, true);
    },

    pressCtrlInserKeyInDatatable: function () {
      return pressKey(45, true);
    }
  },

  registerHelpers: function () {
    var helpers = this.get('helpers'),
      names = Ember.keys(helpers),
      self = this;

    names.forEach(function (name) {
      Ember.Test.registerAsyncHelper(name, function () {
        var app = arguments[0],
          result = helpers[name].apply(self, Array.prototype.slice.call(arguments, 1));

        return result || wait(app);
      });
    });
  },

  getDatatable: function () {
    return $('#app table');
  },

  getSelectedCell: function () {
    return $(document.activeElement).closest('td, th');
  },

  getSelectedPosition: function () {
    var selected = this.getSelectedCell(),
      rowElement = selected.parent(),
      column = rowElement.find('td, th').index(selected),
      row = rowElement.closest('table').find('tr').index(rowElement);

    return {row: row, column: column};
  },

  getDatatableHeaders: function () {
    return this.getDatatable().find('thead th').map(function () {
      return $(this).text();
    }).get();
  },

  getDatatableContent: function () {
    var datatable = [];

    this.getDatatable().find('tbody tr').each(function () {
      var row = [];
      $(this).find('td').each(function () {
        row.push($(this).text());
      });
      datatable.push(row);
    });
    return datatable;
  },

  getHighlightedCellsText: function () {
    return this.getDatatable().find('td.selected, th.selected').map(function () {
      return $(this).text();
    }).get();
  },

  getInputField: function () {
    return this.getDatatable().find('input');
  }
});
