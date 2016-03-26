({
	plugins: [
        'GridBuilder',
    ],

	events: {
		'click a[name="guardar-grupo"]': '_handlerSave',
		'keyup textarea[name="paste"]': '_handlerPaste',
		'click a[name="clear-paste"]': '_clearPaste'
	},

	initialize: function () {
		this._super('initialize', arguments);
		var self = this;
		this.model = app.data.createBean('QS_ProductosCriterio');
		this.module = 'QS_ProductosCriterio';

		this.meta.fields = [];
		this.meta.columns = 2;
		this.meta.labelsOnTop = true;

		var module = _.clone(app.metadata.getModule('QS_ProductosCriterio'));

		var editableFields = ['name','condicion','cantidad','ycantidad_c','cantidad_minima_c','limitado_a_c','tipo_unidad_c'];

		_.each(editableFields, function (item) {
			//module.fields[item].template = 'edit';
			self.meta.fields.push(module.fields[item]);
		});
		this.grid = this.getGridBuilder(this.meta).build().grid;

		this.model.on('change', _.bind(this._handlerChangeModel, this));
		
		this.action = 'edit';
		//debugger;
		this._initListView();

	},

	_handlerChangeModel: function () {
		if(this.model.get('name') && this.model.get('condicion') && this.model.get('cantidad') && this.model.get('tipo_unidad_c')){
			this.$el.find('.paste-container').removeClass('hidden');
		}
		else{
			this.$el.find('.paste-container').addClass('hidden');
		}
	},

	_handlerSave: function () {
		var self = this;
		if(this._validate()){
			this.collection.each(function (model) {
				model.set({
					condicion: self.model.get('condicion'),
					cantidad: self.model.get('cantidad'),
					tipo_unidad_c: self.model.get('tipo_unidad_c'),
					ycantidad_c: self.model.get('ycantidad_c'),
					cantidad_minima_c: self.model.get('cantidad_minima_c'),
					limitado_a_c: self.model.get('limitado_a_c'),
					qs_productoscriterio_producttemplatesproducttemplates_ida: model.get('id')
				});
			});
		}
	},

	_validate: function (argument) {
		if(!this.collection.length){
			app.alert.show('Collection empty', {
				level: "error",
				messages: "Debe de introducir los SKU's.",
				autoClose: true				
			});
			return false;
		}
		
		return true;
	},

	_handlerPaste: function(evt) {
		var self = this;
		var text = evt.target.value;
		self.collection.reset([]);
		if(text){
			var rows = text.split('\n');
			var model = null;
			_.each(rows, function(row, index) {
				model = app.data.createBean('QS_ProductosCriterio', {id: row});
				self.collection.add(model);
			})
			//self.listView.render();
			self._validateSkus(rows, _.bind(self._handlerValidateSkus, self));
			this.$el.find('.sku-list-container').removeClass('hidden');
			this.$el.find('th.sorting').removeClass('sorting');
			this.$el.find('th.orderBy').removeClass('orderBy');
		}
	},

	_initListView: function (argument) {
		var self = this;
		var template = app.template.get('promotionconf-productos.productos-criterio-grid.QS_Promociones');
		var model = app.data.createBean('QS_ProductosCriterio');
		var context = app.context.getContext({
			collection: self.collection,
			model: model,
			module: model.module
		});
		
		var fields = [{
			name: "id",
			label: "LBL_ID"
		}];

		self.listView =  app.view.createView({
			context: context,
			type: 'list',
			name: 'producto-criterio-designer-list',
			module: 'ProductTemplates',
			template: app.template.get('promotionconf-productos-edit-group.list.QS_Promociones'),
			layout: self,
			meta: {
				panels: [
					{
						fields: fields
					}
				]
			}
		});
	},

	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		var self = this;
		var $container = this.$el.find('.sku-list-container');
		self.listView.render();
		$container.html(self.listView.el);
	},

	_clearPaste: function() {
		//debugger;
		this.$el.find('textarea[name="paste"]').val('');
		this.collection.reset([]);
		this.$el.find('.sku-list-container').addClass('hidden');

	},

	_validateSkus: function (skus, callback) {
		var data = {
			requests: []
		};
		_.each(skus, function (sku) {
			data.requests.push({
				url: '/v10/ProductTemplates/' + sku,
				method: 'GET'
			});
		});
		app.api.call('create', '/rest/v10/bulk', data, {
			success: _.bind(function(data) {
				var result = true;
				var skuResults = [];
				_.each(data, function (response, index) {
					var skuResult = {sku: skus[index], status: response.status};
					if(result){
						result = response.status === 200;
					}
					skuResults.push(skuResult);
				});
				callback(result, skuResults);
			}, this),
		});
	},

	_handlerValidateSkus: function (result, skuResults) {
		var self = this;
		
		if(!result){
			app.alert.show('Skus invalidos', {
				level: 'error',
				messages: 'Skus invalidos, retire los valores no validos.',
				autoClose: true
			});
		}
		else{
			self.$el.find('a[name="guardar-grupo"]').removeClass('hidden');
		}

		self.collection.each(function (model, index) {
			model.set((skuResults[index].status === 200 ? '_is_valid': '_is_invalid'), true);
		});

		self.listView.render();
	},
})