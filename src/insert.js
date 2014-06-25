Ember.EasyDatatableInserter = Ember.Object.extend(Ember.EasyDatatableUtils, {
  bindKeydownForInsertion: function () {
    var self = this,
      table = this.get('table');

    table
      .on('keydown', 'thead th', function (event) {
        var index = self.getColumnFor(self.getSelectedCell());

        if (event.shiftKey && event.which === self.keyCodes.PLUS) {
          if (self.canInsertColumn(index)) {
            event.stopPropagation();
            self.insertColumnAfter(index);
          }
        }
      })
      .on('keydown', 'tbody th', function (event) {
        var index = self.getRowFor(self.getSelectedCell());

        if (event.shiftKey && event.which === self.keyCodes.PLUS) {
          if (self.canInsertRow(index)) {
            event.stopPropagation();
            self.insertRowAfter(index);
          }
        }
      });
  }.on('init'),

  canInsertRow: function (index) {
    return true;
  },

  canInsertColumn: function (index) {
    return true;
  },

  insertRowAfter: function (index) {
    var self = this,
      row = this.get('table').find('tbody tr:nth(%@)'.fmt(index)),
      newRow = '<tr>%@</tr>'.fmt(row.find('th, td').map(function () {
        var cell = $(this),
          cellType = self.getCellType(cell);

        return '<%@ class="%@" tabindex="%@"></%@>'.fmt(
          cellType,
          cell.attr('class'),
          self.get('tabindex'),
          cellType);
      }).get().join(''));

    $(newRow).insertAfter(row);
    this.get('table').find('tbody tr:nth(%@) th'.fmt(index + 1)).focus();
  },

  insertColumnAfter: function (index) {
    var self = this;

    this.get('table').find('tr').each(function () {
      var row = $(this),
        cell = row.find('th, td').eq(index),
        cellType = self.getCellType(cell);

      $('<%@ tabindex="%@"></%@>'.fmt(
        cellType,
        self.get('tabindex'),
        cellType)).insertAfter(cell);
    });
    this.get('table').find('thead th:nth(%@)'.fmt(index + 1)).focus();
  },

  getCellType: function (cell) {
    return cell.is('td') ? 'td' : 'th';
  }
});