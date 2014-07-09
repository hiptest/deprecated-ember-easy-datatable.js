Ember.EasyDatatableUtils = Ember.Mixin.create({
  datatable: null,
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
    INSER: 45,
    DEL: 46,
    PLUS: 107,
    SHIFT: 16
  },

  needFirefoxFixes: function () {
    var match = navigator.userAgent.match(/Firefox\/(\d+)/);
    if (Ember.isNone(match)) {
      return false;
    }

    // Not 100% sure about the version were it started working correctly ...
    return parseInt(match[1]) < 30;
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
    return element && element.closest('tr').find('th, td').index(element);
  },

  getRowFor: function(element) {
    return element && element.closest('tbody').find('tr').index(element.closest('tr'));
  },

  notifyEvent: function (event, data) {
    var datatable = this.get('datatable');

    if (!Ember.isNone(datatable)) {
      datatable.dispatchEvent(event, data);
    }
  },

  validateAndProcess: function (validator, success, failure, args) {
    var result = validator.apply(this, args);

    if (result instanceof Ember.RSVP.Promise) {
      this.processForPromise(result, success, failure, args);
    } else  {
      this.processForBoolean(result, success, failure, args);
    }
  },

  processForBoolean: function (result, success, failure, args) {
    if (result) {
      success.apply(this, args);
    } else {
      failure.apply(this, args);
    }
  },

  processForPromise: function  (result, success, failure, args) {
    var self = this;

    result.then(function () {
      success.apply(self, args);
    },
    function () {
      failure.apply(self, args);
    });
  }
});
