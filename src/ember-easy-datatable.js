Ember.EasyDatatable = Ember.Object.extend(
  Ember.EasyDatatableHighlighter, Ember.EasyDatatableKeyboardMoves, Ember.EasyDatatableEditor,{
  tabindex: 1,
  tableSelector: '',
  selectionClass: 'selected',
  protectedClass: 'protected',
  validationErrorClasses: ['error']
});