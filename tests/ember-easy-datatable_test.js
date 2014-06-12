(function () {
  module(Ember.EasyDatatable.toString(), {
    setup: function () {
      $('#qunit-fixtures')
        .append('<table id="%@"><thead>%@</thead><tbody>%@</tbody></table>'.fmt(
          'sample1',
          '<tr><th></th><th>Name</th><th>Value 1</th><th>Value 2</th><th>Value 3</th>',
          [0, 1, 2, 3].map(function () {
            return '<tr><th>#%@</th><td>Row %@</td><td>%@</td><td>%@</td><td>%@</th>'.fmt(
              this, this, this, 10 + this, 20 + this
            )
          }).join('')
        ))
    },

    teardown: function () {
      $('#qunit-fixtures table').remove();
    }
  });

  test('table', function () {
    var sut = Ember.EasyDatatable.create({tableSelector: '#sample1'});

    deepEqual(sut.get('table'), $('#sample1'), 'Provides the table selected with jQuery');
  });

  test('addTabindex', function () {
    deepEqual(getTabindex('#sample1'), [],
      'No tabindex is set by default');

    Ember.EasyDatatable.create({tableSelector: '#sample1', tabindex: '3.14'});
    var tabIndexes = getTabindex('#sample1');

    equal(tabIndexes.length, 25, 'Each cell got a tabIndex after creation of the EasyDatatable');
    deepEqual(tabIndexes.uniq(), ['3.14'], 'The value at the object creation is used')
  });



  function getTabindex(selector) {
    return $(selector).find('td, th').map(function () {
      return $(this).attr('tabindex')
    }).get();
  }
})();