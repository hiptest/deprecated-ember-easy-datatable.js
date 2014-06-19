Ember.EasyDatatableHighlighter = Ember.Object.extend(Ember.EasyDatatableUtils, {
  selectionClass: 'selected',

  selectedColumn: null,
  selectedRow: null,

  bindFocusAndBlurForHighlighting: function () {
    var table = this.get('table'),
      self = this;

    table
      .on('focus', 'thead th, thead th *', function () {
        self.set('selectedColumn', self.getColumnFor($(this)));
      })
      .on('blur', 'thead th, thead th *', function () {
        self.set('selectedColumn', null);
      });

    table
      .on('focus', 'tbody th, tbody th *', function () {
        self.set('selectedRow', self.getRowFor($(this)));
      })
      .on('blur', 'tbody th, tbody th *', function () {
        self.set('selectedRow', null);
      });
  }.on('init'),

  notifyCellSelection: function () {
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
});