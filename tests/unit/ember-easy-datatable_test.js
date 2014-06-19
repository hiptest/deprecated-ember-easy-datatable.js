(function () {
  module(Ember.EasyDatatable.toString(), {
    setup: function () {
      createSampleTable();
    },

    teardown: function () {
      $('#qunit-fixtures').empty();
    }
  });

  test('addRemoveEditor', function () {
    var sut = Ember.EasyDatatable.create({tableSelector: '#sample1'}),
      cell = $('table td:first');

    sinon.stub(sut, 'getSelectedCell', function () {
      return cell;
    });

    equal(sut.get('table').find('input').length, 0,
      'There is no input in the table at the beginning');

    sut.set('editorShown', true);
    equal(cell.find('input').length, 1,
      'If editorShown is set to true, an input field is added to the current cell');

    sut.set('editorShown', false);
    equal(sut.get('table').find('input').length, 0,
      'If editorShown is set to false, input is removed from the dom');

    sut.getSelectedCell.restore();
  });
})();