Ember.EasyDatatableUtils = Ember.Mixin.create({
  tabindex: 1,
  tableSelector: '',

  keyCodes: {
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    ENTER: 13,
    TAB: 9,
    ESC: 27,
    DEL: 46,
    PLUS: 107,
    SHIFT: 16
  },

  table: function () {
    return $(this.get('tableSelector'));
  }.property('tableSelector'),

  addTabindex: function () {
    this.get('table').find('th, td').attr('tabindex', this.get('tabindex'));
  }.on('init'),

  getSelectedCell: function () {
    var active = $(document.activeElement);
    if (active && active.closest(this.get('table')).length === 1) {
      return active.closest('td, th');
    }
  },

  getColumnFor: function (element) {
    return element.closest('tr').find('th, td').index(element);
  },

  getRowFor: function(element) {
    return element.closest('tbody').find('tr').index(element.closest('tr'));
  }
});
