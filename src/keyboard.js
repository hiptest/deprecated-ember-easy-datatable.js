Ember.EasyDatatableKeyboardMoves = Ember.Object.extend(Ember.Evented, Ember.EasyDatatableUtils, {
  bindKeydownForMovements: function () {
    var self = this;

    this.get('table')
      .on('keydown', 'td, th', function (event) {
        if (!event.ctrlKey) {
          self.move(event);
        }
      });
  }.on('init'),

  move: function (event) {
    var navigationKeys = [
      this.keyCodes.ARROW_UP,
      this.keyCodes.ARROW_DOWN,
      this.keyCodes.ARROW_RIGHT,
      this.keyCodes.ARROW_LEFT,
      this.keyCodes.TAB];

    if (event.which === this.keyCodes.ARROW_UP) {
      this.moveUp();
    }

    if (event.which === this.keyCodes.ARROW_DOWN) {
      this.moveDown();
    }

    if (event.which === this.keyCodes.ARROW_RIGHT) {
      this.moveRight();
    }

    if (event.which === this.keyCodes.ARROW_LEFT) {
      this.moveLeft();
    }

    if (navigationKeys.contains(event.which)) {
      this.preventDefaultInViewport(event);
    }
  },

  moveUp: function () {
    var selectedCell = this.getSelectedCell(),
      row = this.getRowFor(selectedCell),
      column = this.getColumnFor(selectedCell);

    if (row === -1) {
      selectedCell.blur();
      return;
    }

    this.focusCell(row - 1, column);
  },

  moveDown: function () {
    var table = this.get('table'),
      selectedCell = this.getSelectedCell(),
      row = this.getRowFor(selectedCell),
      column = this.getColumnFor(selectedCell),
      rowCount = table.find('tbody tr').length;

    if (row === rowCount -1) {
      selectedCell.blur();
      return;
    }

    this.focusCell(row + 1, column);
  },

  moveRight: function () {
    var table = this.get('table'),
      selectedCell = this.getSelectedCell(),
      row = this.getRowFor(selectedCell),
      column = this.getColumnFor(selectedCell),
      rowCount = table.find('tbody tr').length,
      columnCount = selectedCell.closest('tr').find('td, th').length;

    if (column === columnCount - 1) {
      row += 1;
      column = -1;
    }

    if (row === rowCount) {
      selectedCell.blur();
      return;
    }

    this.focusCell(row, column + 1);
  },

  moveLeft: function () {
    var selectedCell = this.getSelectedCell(),
      row = this.getRowFor(selectedCell),
      column = this.getColumnFor(selectedCell);

    if (column === 0) {
      if (row === - 1) {
        selectedCell.blur();
        return;
      }

      row -= 1;
    }

    this.focusCell(row, column - 1);
  },

  focusCell: function (row, column) {
    var table = this.get('table'),
      destinationRow = null;

    if (row === -1) {
      destinationRow = table.find('thead tr');
    } else {
      destinationRow = table.find('tbody tr:nth(%@)'.fmt(row));
    }
    destinationRow.find('th, td').eq(column).focus();
  },

  isElementInViewport: function (el) {
    // Based on http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
    if (Ember.isNone(el)) {
      return;
    }
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  },

  preventDefaultInViewport: function (event) {
    var selectedCell = this.getSelectedCell();

    if (selectedCell && this.isElementInViewport(selectedCell.get(0))) {
      event.preventDefault();
    }
  },

  moveAfterEdition: function (data) {
    if (data.event.which === this.keyCodes.ENTER) {
      this.moveDown();
    }

    if (data.event.which === this.keyCodes.TAB) {
      if (data.event.shiftKey) {
        this.moveLeft();
      } else {
        this.moveRight();
      }
    }
  }.on('cellEdited')
});