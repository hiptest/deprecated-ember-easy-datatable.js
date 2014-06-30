(function () {
  var sut;

  module(Ember.EasyDatatableKeyboardMoves.toString(), {
    setup: function () {
      createSampleTable();
      sut = Ember.EasyDatatableKeyboardMoves.create({
        tableSelector: '#sample1'}
      );
      sinon.spy(sut, 'focusCell', Ember.K);
      sinon.spy(jQuery.fn, 'blur');
    },

    teardown: function () {
      $('#qunit-fixtures').empty();
      jQuery.fn.blur.restore();
      sut.focusCell.restore();
    }
  });

  test('move', function () {
    sinon.stub(sut, 'moveUp', Ember.K);
    sinon.stub(sut, 'moveRight', Ember.K);
    sinon.stub(sut, 'moveDown', Ember.K);
    sinon.stub(sut, 'moveLeft', Ember.K);
    sinon.stub(sut, 'preventDefaultInViewport', Ember.K)

    sut.move({which: 38});
    ok(sut.moveUp.calledOnce,
      'When triggered with the arrow_up keycode, it calls moveUp ...');

    sut.move({which: 39});
    ok(sut.moveRight.calledOnce,
      '... with the right arrow keycode, it calls moveRight ...');

    sut.move({which: 40});
    ok(sut.moveDown.calledOnce,
      '... with the arraow down keycode, oh surprise, it calls moveDown ...');

    sut.move({which: 37});
    ok(sut.moveLeft.calledOnce,
      '... and as you could guess, the the left arrow keycode, it calls moveLeft. Yep it is full of surprises ....');

    sut.move({which: 9});
    ok(sut.moveRight.calledOnce,
      'The tab key does not trigger moveRight, it uses the default browser behavior ...');

    sut.moveUp.restore();
    sut.moveRight.restore();
    sut.moveDown.restore();
    sut.moveLeft.restore();
    sut.preventDefaultInViewport.restore();
  });

  test('moveUp', function () {
    var cell = selectCell(-1, 2);
    sut.moveUp();

    ok(cell.blur.calledOnce,
      'The selected cell was in the header, so moving up deselected it ...');
    equal(sut.focusCell.callCount, 0,
      '... and no other cell was focused');

    cell = selectCell(2, 3);
    sut.moveUp();

    deepEqual(sut.focusCell.firstCall.args, [1, 3],
      'If there is a cell above, we focus it');
  });

  test('moveDown', function () {
    var cell = selectCell(3, 2);
    sut.moveDown();

    ok(cell.blur.calledOnce,
      'If we are in the last rown, we blur the cell ...');
    equal(sut.focusCell.callCount, 0,
      '... and do not try to focus another cell');

    cell = selectCell(2, 2);
    sut.moveDown();
    deepEqual(sut.focusCell.firstCall.args, [3, 2],
      'If the selected cell is in the header, we focus on the corresponding one in the first row');
  });

  test('moveRight', function () {
    var cell = selectCell(3, 4);
    sut.moveRight();

    ok(cell.blur.calledOnce,
      'If the selected cell is the last one of the last row, we blur it ...');
    equal(sut.focusCell.callCount, 0,
      '... and do not try to focus another cell');

    cell = selectCell(-1, 2);
    sut.moveRight();

    deepEqual(sut.focusCell.firstCall.args, [-1, 3],
      'By default, we focus on the cell on the right');

    cell = selectCell(2, 4);
    sut.moveRight();

    deepEqual(sut.focusCell.secondCall.args, [3, 0],
      'If the cell is the last one of the row, we focu the first one of the next row');
  });

  test('moveLeft', function () {
    var cell = selectCell(-1, 0);
    sut.moveLeft();

    ok(cell.blur.calledOnce,
      'If the selected cell is the first one of the header, we blur it ...');
    equal(sut.focusCell.callCount, 0,
      '... and do not try to focus another cell');


    cell = selectCell(1, 2);
    sut.moveLeft();

    deepEqual(sut.focusCell.firstCall.args, [1, 1],
      'By default, we move to the cell on the left');

    cell = selectCell(2, 0);
    sut.moveLeft();
    deepEqual(sut.focusCell.secondCall.args, [1, -1],
      'If the cell is the first one of the row, we focus the last one of the next row');
  });

  test('focusCell', function () {
    var focusSpy = sinon.spy(jQuery.fn, 'focus');

    sut.focusCell(-1, 0);
    deepEqual(focusSpy.firstCall.thisValue.get(0), $('#sample1 thead th:first').get(0),
      'If the row equals -1, the focus is given to the header cell');

    sut.focusCell(2, 4);
    // It might look weird to select the 4th cell and check that it's the 3rd <td>, but
    // in the table there is one <th> at the beginning of each row, so the 3rd <td> is the
    // fourth cell.
    deepEqual(focusSpy.secondCall.thisValue.get(0), $('#sample1 tbody tr:nth(2) td:nth(3)').get(0),
      '... otherwise it uses the row from the tbody');

    jQuery.fn.focus.restore();
  });
})();