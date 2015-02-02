EasyDatatable.EasyDatatableEditorView = Ember.TextField.extend({
  valueState: 'unmodified',  // valid values are 'unmodified', 'modified', 'saved'
  valueBinding: Ember.Binding.oneWay('oneWayValue'),  // so updating input value
                                                      // does not update the originating value
  cellController: Ember.computed.alias('parentView.controller'),

  originalValue: function() {
    if (this.get('oneWayValue') === undefined) {
      return undefined;
    } else {
      return this.get('oneWayValue').toString();
    }
  }.property('oneWayValue'),

  initValueState: function () {
    this.set('valueState', 'unmodified');
  }.on('init'),

  onValueChanged: function() {
    if (this.get('originalValue') !== this.get('value')) {
      this.set('valueState', 'modified');
    }
  }.observes('value'),

  keyDown: function (event) {
    event.stopPropagation();
    if (event.which === 27) {
      this.set('valueState', 'unmodified');
      this.get('cellController').send('cancel');
    }

    if (event.which === 13 || event.which === 9) {
      event.preventDefault();

      var postSaveAction = 'navigateDown';
      if (event.which === 9) {
        postSaveAction = event.shiftKey ? 'navigateLeft' : 'navigateRight';
      }

      if (this.get('valueState') === 'unmodified') {
        // warning: if edition is not leaved at this point, then it will trigger
        // an extra valueDidChange and it will save the value on focusOut. I
        // could not reproduce it in the test 'cell validation is not called at
        // all if not modified' because this behavior is at the jquery events
        // level and the test acts at the ember events level...
        this.get('cellController').send('leaveEdition');
        this.get('cellController').send(postSaveAction);
      } else {
        this.get('cellController').send('save', this.get('value'), postSaveAction);
        this.set('valueState', 'saved');
      }
    }
  },

  focusOut: function () {
    if (this.get('valueState') === 'modified') {
      this.get('cellController').send('saveOnLeave', this.get('value'));
    } else {
      this.get('cellController').send('leaveEdition');
    }
  },

  placeAndFocusOnShow: function () {
    var selectedCell = this.$().closest('th, td'),
      domElement = this.$().get(0),
      value = this.get('value') || '';

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
    domElement.selectionEnd = value.toString().length;
  }.on('didInsertElement'),

});
