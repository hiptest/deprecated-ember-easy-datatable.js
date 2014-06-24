(function () {
  var sut;

  module(Ember.EasyDatatableOrderer.toString(), {
    setup: function () {
      createSampleTable();
      sut = Ember.EasyDatatableOrderer.create({
        tableSelector: '#sample1'}
      );
    },

    teardown: function () {
      $('#qunit-fixtures').empty();
    }
  });

  test('moveColumnRight', function () {
    sinon.stub(sut, '_moveColumn', Ember.K);

    sut.moveColumnRight(0);
    ok(sut._moveColumn.calledOnce,
      'It simply calls "_moveColumn"');
    deepEqual(sut._moveColumn.getCall(0).args, [0, 1]);

    sut._moveColumn.restore();
  });

  test('moveColumnLeft', function () {
    sinon.stub(sut, '_moveColumn', Ember.K);

    sut.moveColumnLeft(4);
    ok(sut._moveColumn.calledOnce,
      'It simply calls "_moveColumn"');
    deepEqual(sut._moveColumn.getCall(0).args, [4, 3]);

    sut._moveColumn.restore();
  });

  test('moveRowUp', function () {
    sinon.stub(sut, '_moveRow', Ember.K);

    sut.moveRowUp(4);
    ok(sut._moveRow.calledOnce,
      'It simply calls "_moveRow"');
    deepEqual(sut._moveRow.getCall(0).args, [4, 3]);

    sut._moveRow.restore();
  });

  test('moveRowDown', function () {
    sinon.stub(sut, '_moveRow', Ember.K);

    sut.moveRowDown(2);
    ok(sut._moveRow.calledOnce,
      'It simply calls "_moveRow"');
    deepEqual(sut._moveRow.getCall(0).args, [2, 3]);

    sut._moveRow.restore();
  });

  test('allowMoveColumnRight', function () {
    ok(sut.allowMoveColumnRight(0),
      'It returns true unless the column is the last one');

    ok(!sut.allowMoveColumnRight(4),
      'It returns true unless the column is the last one');
  });

  test('allowMoveColumnLeft', function () {
    ok(!sut.allowMoveColumnLeft(0),
      'It returns true unless the column is the first one');

    ok(sut.allowMoveColumnLeft(4),
      'It returns true unless the column is the first one');
  });

  test('allowMoveRowUp', function () {
    ok(!sut.allowMoveRowUp(0),
      'It returns true unless the row is the first one');

    ok(sut.allowMoveRowUp(4),
      'It returns true unless the row is the first one');
  });

  test('allowMoveRowDown', function () {
    ok(sut.allowMoveRowDown(0),
      'It returns true unless the row is the last one');

    ok(!sut.allowMoveRowDown(4),
      'It returns true unless the row is the last one');
  });

  test('_moveColumn', function () {
    deepEqual(tableContent(), [
      ["", "Name", "Value 1", "Value 2", "Value 3"],
      ["#0", "Row 0", "0", "10", "20"],
      ["#1", "Row 1", "1", "11", "21"],
      ["#2", "Row 2", "2", "12", "22"],
      ["#3", "Row 3", "3", "13", "23"]
    ]);
    sut._moveColumn(0, 3);
    deepEqual(tableContent(), [
      ["Name", "Value 1", "Value 2", "", "Value 3"],
      ["Row 0", "0", "10", "#0", "20"],
      ["Row 1", "1", "11", "#1", "21"],
      ["Row 2", "2", "12", "#2", "22"],
      ["Row 3", "3", "13", "#3", "23"]
    ], 'It moves the column in the table (zero-based index)');
    sut._moveColumn(3, 0);
    deepEqual(tableContent(), [
      ["", "Name", "Value 1", "Value 2", "Value 3"],
      ["#0", "Row 0", "0", "10", "20"],
      ["#1", "Row 1", "1", "11", "21"],
      ["#2", "Row 2", "2", "12", "22"],
      ["#3", "Row 3", "3", "13", "23"]
    ]);
  });

  test('_moveRow', function () {
    deepEqual(tableContent(), [
      ["", "Name", "Value 1", "Value 2", "Value 3"],
      ["#0", "Row 0", "0", "10", "20"],
      ["#1", "Row 1", "1", "11", "21"],
      ["#2", "Row 2", "2", "12", "22"],
      ["#3", "Row 3", "3", "13", "23"]
    ]);
    sut._moveRow(2, 0);
    deepEqual(tableContent(), [
      ["", "Name", "Value 1", "Value 2", "Value 3"],
      ["#2", "Row 2", "2", "12", "22"],
      ["#0", "Row 0", "0", "10", "20"],
      ["#1", "Row 1", "1", "11", "21"],
      ["#3", "Row 3", "3", "13", "23"]
    ], 'It moves the row in the table (zero-based index - thead row is not taken into account)');
    sut._moveRow(0, 2);
    deepEqual(tableContent(), [
      ["", "Name", "Value 1", "Value 2", "Value 3"],
      ["#0", "Row 0", "0", "10", "20"],
      ["#1", "Row 1", "1", "11", "21"],
      ["#2", "Row 2", "2", "12", "22"],
      ["#3", "Row 3", "3", "13", "23"]
    ]);
  });

})();