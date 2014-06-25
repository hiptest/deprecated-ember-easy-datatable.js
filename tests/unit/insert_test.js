(function () {
  var sut;

  module(Ember.EasyDatatableInserter.toString(), {
    setup: function () {
      createSampleTable();
      sut = Ember.EasyDatatableInserter.create({
        tableSelector: '#sample1'
      });
    },

    teardown: function () {
      $('#qunit-fixtures').empty();
    }
  });

  test('canInsertRow', function () {
    ok(sut.canInsertRow(),
      'There is no special checks, this should be overriden if needed');
  });

  test('canInsertColumn', function () {
    ok(sut.canInsertColumn(),
      'There is no special checks, this should be overriden if needed');
  });

  test('insertRowAfter', function () {
    sut.insertRowAfter(0);
    equal($('#sample1 tbody tr:nth(1)').html(),
      [
        '<th class="" tabindex="1"></th>',
        '<td class="" tabindex="1"></td>',
        '<td class="" tabindex="1"></td>',
        '<td class="" tabindex="1"></td>',
        '<td class="" tabindex="1"></td>'
      ].join(''),
      'It creates a new row with the same type as elements as the previous row');

    $('#sample1 tbody tr:nth(1)').find('th').addClass('thCustomClass');
    $('#sample1 tbody tr:nth(1)').find('td').addClass('tdCustomClass');
    $('#sample1 tbody tr:nth(1)').find('td:last').addClass('lastElementClass');

    sut.insertRowAfter(1);
    equal($('#sample1 tbody tr:nth(2)').html(),
      [
        '<th class="thCustomClass" tabindex="1"></th>',
        '<td class="tdCustomClass" tabindex="1"></td>',
        '<td class="tdCustomClass" tabindex="1"></td>',
        '<td class="tdCustomClass" tabindex="1"></td>',
        '<td class="tdCustomClass lastElementClass" tabindex="1"></td>'
      ].join(''),
      'It copies the classes from the cell above');

    deepEqual($(document.activeElement).get(0), $('#sample1 tbody tr:nth(2) th').get(0),
      'It gives the focus to the first <th> in the created row');
  });

  test('insertColumnAfter', function () {
    sut.insertColumnAfter(2);
    var newColumn = $('#sample1 tr').map(function () {
      return $(this).find('th, td').get(3).outerHTML;
    }).get();

    deepEqual(newColumn, [
        '<th tabindex="1"></th>',
        '<td tabindex="1"></td>',
        '<td tabindex="1"></td>',
        '<td tabindex="1"></td>',
        '<td tabindex="1"></td>'
      ], 'It creates an empty column with the correct cell type');
    deepEqual($(document.activeElement).get(0), $('#sample1 thead th:nth(3)').get(0),
      'It gives the focus to the <th> in the created column');
  });

  test('getCellType', function () {
    equal(sut.getCellType($('td:first')), 'td',
      'If the cell is a <td>, it returns "td"');

    equal(sut.getCellType($('th:first')), 'th',
      'Otherwise it returns "th" ...');

    equal(sut.getCellType($('table')), 'th',
      '... which can give weird results if you pass anything else than a cell, but that must be why it is called "getCellType", not "getWhateverElementYouWantType"');
  });
})();