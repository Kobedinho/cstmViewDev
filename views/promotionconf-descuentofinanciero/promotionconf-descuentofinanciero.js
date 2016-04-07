({
	plugins: [
        'GridBuilder',
    ],

	initialize:function(){
		this._super('initialize', arguments);
		var self = this;
		this.meta.fields = [];
		this.meta.columns = 2;
		this.meta.labelsOnTop = true;
		this.module = 'QS_DescuentosFinancieros';
		this.model = app.data.createBean(this.module);

		var module = _.clone(app.metadata.getModule(this.module));
		var editableFields = ['tipo', 'precio','descuento_monto','descuento','lista_precio','cascada_1','cascada_2','cascada_3'];

		_.each(editableFields, function (item) {
			//module.fields[item].template = 'edit';
			self.meta.fields.push(module.fields[item]);
		});

		this.grid = this.getGridBuilder(this.meta).build().grid;
		this.action = 'edit';
	}
})