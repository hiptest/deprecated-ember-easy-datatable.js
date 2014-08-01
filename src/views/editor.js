EasyDatatable.EasyDatatableEditorView = Ember.TextField.extend({
  originalValue: null,
  cellController: Ember.computed.alias('parentView.controller'),

  storeOriginalValue: function () {
    this.set('originalValue', this.get('value'));
  }.on('init'),

  keyDown: function (event) {
    event.stopPropagation();
    if (event.which === 27) {
      this.get('cellController').send('cancel', this.get('originalValue'));
    }

    if (event.which === 13 || event.which === 9) {
      event.preventDefault();

      var postSaveAction = 'navigateDown';
      if (event.which === 9) {
        postSaveAction = event.shiftKey ? 'navigateLeft' : 'navigateRight';
      }
      this.get('cellController').send('save', postSaveAction);
    }
  },

  focusOut: function () {
    this.get('cellController').send('saveOnLeave', this.get('originalValue'));
  },

  placeAndFocusOnShow: function () {
    var selectedCell = this.$().closest('th, td'),
      domElement = this.$().get(0);
    // We need absolute positionning before checking the width/height of the cell
    // Otherwise, the input counts in the cell size
    this.$()
      .css({position: 'absolute'})
      .css({
        width: selectedCell.outerWidth(),
        height: selectedCell.outerHeight(),
        top: selectedCell.position().top,
        left: selectedCell.position().left
      }).focus();

    domElement.selectionStart = 0;
    domElement.selectionEnd = this.get('value').toString().length;
  }.on('didInsertElement'),

});