Ember.EasyDatatable = Ember.Object.extend({
  table: null,
  tableSelector: '',

  selectionClass: 'selected',
  selectedColumn: null,
  selectedRow: null,

  tabindex: 1,

  table: function () {
    return $(this.get('tableSelector'));
  }.property('tableSelector'),

  addTabindex: function () {
    this.get('table').find('th, td').attr('tabindex', this.get('tabindex'));
  }.on('init'),

  bindFocusBlur: function () {
    var table = this.get('table'),
      self = this;

    table.find('thead th')
      .on('focus', function () {
        var th = $(this),
          selectedColumn = th.index('%@ thead th'.fmt(self.get('tableSelector')));

        self.set('selectedColumn', selectedColumn);
      })
      .on('blur', function () {
        self.set('selectedColumn', null);
      });

    table.find('tbody th')
      .on('focus', function () {
        var row = $(this).closest('tr'),
          selectedRow = row.index('%@ tbody tr'.fmt(self.get('tableSelector')));

        self.set('selectedRow', selectedRow);
      })
      .on('blur', function () {
        self.set('selectedRow', null);
      })
  }.on('init'),

  updateSelection: function () {
    var table = this.get('table'),
      selectionClass = this.get('selectionClass'),
      selectedRow = this.get('selectedRow'),
      selectedColumn = this.get('selectedColumn');

    table.find('.%@'.fmt(selectionClass)).removeClass(selectionClass);
    if (!Ember.isNone(selectedRow)) {
      table.find('tbody tr:nth(%@)'.fmt(selectedRow)).find('td, th').addClass(selectionClass);
    } else if (!Ember.isNone(selectedColumn)) {
      table.find('tr').each(function () {
        $(this).find('th, td').eq(selectedColumn).addClass(selectionClass);
      });
    }
  }.on('init').observes('selectedRow', 'selectedColumn')
})