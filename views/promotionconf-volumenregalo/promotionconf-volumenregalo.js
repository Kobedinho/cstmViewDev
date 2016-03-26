({
	events:{
		'click a[name="volumenregalo_close"]': '_closeDrawer',
		'click span[name="volumenregalo_select_prod"]': '_seleccionaProductos',
	},
	initialize:function(args){
		this._super('initialize', arguments);
		this.meta = {
			fields: [
				{
					name: 'tipo',
					type: 'enum',
					label: 'LBL_TIPO'
				},
			]
		}
		this.action = 'detail';
		this.model = app.data.createBean('QS_VolumenRegalo');
		this.productsCollection = app.data.createBeanCollection('ProductTemplates');
	},
	_closeDrawer:function(){
		app.drawer.close();
	},
	_seleccionaProductos:function(){
		var self = this;
		console.log(self.module);
		//var template = app.template.get('promotionconf-productos.productos-criterio-grid.QS_Promociones');
		var model = app.data.createBean('ProductTemplates');
		var context = app.context.getContext({
			collection: this.productsCollection,
			model: model,
			module: model.module
		});
		var module = _.clone(app.metadata.getModule('ProductTemplates'));
		var fields = [];
		fields.push(module.fields.name);

		//var editableFields = ['condicion','cantidad','ycantidad_c','cantidad_minima_c','limitado_a_c','iniciador_c','tipo_unidad_c'];

		/*_.each(editableFields, function (item) {
			module.fields[item].template = 'edit';
			fields.push(module.fields[item]);
		});*/
		debugger;
		var tipo = 'list';
		var isMultiSelect = false;
		if(self.model.get('tipo')==='Cualquiera_de'){
			isMultiSelect = true;
		}
		self.productoModel = model;
		self.listViewXX =  app.view.createView({
			context: context,
			type: 'flex-list',
			name: 'volumen-select-list',
			module: 'ProductTemplates',
			//template: app.template.get('promotionconf-volumenregalo.list.QS_Promociones'),
			layout: self,
			meta: {
				panels: [
					{
						fields: fields
					}
				]
			}
		});

    	app.drawer.open({
    		layout: 'selection-list',
          	view: self.listViewXX,
          	context: context,
        });
	},

})