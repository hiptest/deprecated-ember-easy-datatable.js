EasyDatatable.EasyDatatableCellActionsView = Ember.View.extend({
  templateName: 'easy_datatable_cell_actions',
  classNameBindings: [
    'showColumnButtons:datatable-column-actions',
    'showRowButtons:datatable-row-actions'
  ],

  row: Ember.computed.alias('controller.position.row'),
  column: Ember.computed.alias('controller.position.column'),
  cell: Ember.computed.alias('controller.model'),
  datatable: Ember.computed.alias('controller.datatableController.model'),

  showEditButton: Ember.computed.and('cell.isEditable', 'cell.showActions'),

  showColumnButtons: function () {
    return this.get('row') === -1 && this.get('cell.showActions');
  }.property('row', 'cell.showActions'),

  showRemoveColumnButton: Ember.computed.and('showColumnButtons', 'cell.isRemovable'),

  showMoveColumnLeftButton: function () {
    return this.get('datatable').columnCanMoveLeft(this.get('column')) && this.get('showColumnButtons');
  }.property('showColumnButtons', 'cell.isMovable', 'column', 'datatable.headers.cells.length'),

  showMoveColumnRightButton: function () {
    return this.get('datatable').columnCanMoveRight(this.get('column')) && this.get('showColumnButtons');
  }.property('showColumnButtons', 'cell.isMovable', 'column', 'datatable.headers.cells.length'),

  showRowButtons: function () {
    return this.get('row') !== -1 && this.get('cell.showActions');
  }.property('row', 'cell.showActions'),

  showRemoveRowButton: Ember.computed.and('showRowButtons', 'cell.isRemovable'),

  showMoveRowUpButton: function () {
    var row = this.get('row');
    if (row === -1) return;

    return this.get('datatable').rowCanMoveUp(row);
  }.property('showRowButtons', 'cell.isMovable', 'row', 'datatable.body.length'),

  showMoveRowDownButton: function () {
    var row = this.get('row');
    if (row === -1) return;

    return this.get('datatable').rowCanMoveDown(row);
  }.property('showRowButtons', 'cell.isMovable', 'row', 'datatable.body.length')
});