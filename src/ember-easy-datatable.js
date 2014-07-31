EasyDatatable = Ember.Namespace.create({
  declareDatatable: function (namespace) {
    var copiedObjects = Ember.keys(EasyDatatable).filter(function (key) {
      return key.indexOf('EasyDatatable') === 0;
    });

    copiedObjects.forEach(function (obj) {
      namespace[obj] = EasyDatatable[obj].extend();
    });
  },

  makeDatatable: function (datatable) {
    if (datatable instanceof Array) {
      datatable = {
        headers: [],
        body: datatable
      };
    }

    var self = this,
      creationHash = {
        headers: self.makeHeaderRow(datatable.headers),
        body: datatable.body.map(function (row) {
          return self.makeRow(row);
        })
      },
      copiedMethods = ['makeDefaultRow', 'makeDefaultColumn', 'validateCell'];

    copiedMethods.forEach(function (name) {
      if (Ember.isNone(datatable[name])) return;
      creationHash[name] = datatable[name];
    });

    return EasyDatatable.Datatable.create(creationHash);
  },

  makeHeaderRow: function (row) {
    var dtRow = this.makeRow(row);
    dtRow.get('cells').forEach(function (item) {
      item.set('isHeader', true);
    });

    return dtRow;
  },

  makeRow: function (row) {
    var self = this;

    return EasyDatatable.DatatableRow.create({
      cells: row.map(function (item) {
        return self.makeCell(item);
      })
    });
  },

  makeCell: function (value) {
    if (!(value instanceof Object)) {
      value = {value: value};
    }
    return EasyDatatable.DatatableCell.create(value);
  }
});
