Ember.EasyDatatableRemover = Ember.Object.extend(Ember.EasyDatatableUtils, {
  bindKeydownForDeletion: function () {
    var self = this,
      table = this.get('table');

    table
      .on('keydown', 'thead th', function (event) {
        var index = self.getColumnFor(self.getSelectedCell());

        if (event.ctrlKey && event.which === self.keyCodes.DEL) {
          if (self.canDeleteColumn(index)) {
            event.stopPropagation();
            self.deleteColumn(index);
          }
        }
      })
      .on('keydown', 'tbody th', function (event) {
        var index = self.getRowFor(self.getSelectedCell());

        if (event.ctrlKey && event.which === self.keyCodes.DEL) {
          if (self.canDeleteRow(index)) {
            event.stopPropagation();
            self.deleteRow(index);
          }
        }
      });
  }.on('init'),

  canDeleteRow: function (index) {
    return true;
  },

  canDeleteColumn: function (index) {
    return true;
  },

  deleteRow: function (index) {
    var table = this.get('table');
    table.find('tbody tr:nth(%@)'.fmt(index)).remove();

    index = Math.min(index, table.find('tbody tr').length - 1);
    table.find('tbody tr:nth(%@) th'.fmt(index)).focus();
  },

  deleteColumn: function (index) {
    var table = this.get('table');

    table.find('tr').each(function () {
      $(this).find('th, td').eq(index).remove();
    });

    index = Math.min(index, table.find('thead th').length - 1);
    table.find('thead th:nth(%@)'.fmt(index)).focus();
  }
});