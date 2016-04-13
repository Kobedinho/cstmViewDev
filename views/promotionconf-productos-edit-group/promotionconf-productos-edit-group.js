({
	plugins: [
        'GridBuilder',
    ],

	events: {
		'click a[name="guardar-grupo"]': '_handlerSave',
		'keyup textarea[name="paste"]': '_handlerPaste',
		'click a[name="cancel"]': '_handlerCancel',
	},

	initialize: function () {
		this._super('initialize', arguments);
		var self = this;
		var modelData = _.extend({ grupo_padre_c:'', grupo_c:'1', iniciador_c: true }, this.options.productoCriterio||{});
		this.model = app.data.createBean('QS_ProductosCriterio', modelData);
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
					iniciador_c: self.model.get('iniciador_c'),
					grupo_c: self.model.get('grupo_c'),
					grupo_padre_c: self.model.get('grupo_padre_c'),
					qs_productoscriterio_producttemplatesproducttemplates_ida: model.get('id'),
				});
			});
		}
		this.trigger('onSave', this.model, this.collection, this.options.nodoPadre);
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
		var $containerSku = this.$el.find('.sku-list-container');
		var $containerGrupo = this.$el.find('.group-list-container');
		self.listView.render();
		$containerSku.html(self.listView.el);
		// self.groupListView.render();
		// $containerGrupo.html(self.groupListView.el);
	},

	_clearPaste: function() {
		//debugger;
		this.$el.find('textarea[name="paste"]').val('');
		this.collection.reset([]);
		this.$el.find('.sku-list-container').addClass('hidden');
		this.$el.find('.group-list-container').addClass('hidden');
		this.$el.find('a[name="guardar-grupo"]').addClass('hidden');
		this.$el.find('a[name="clear-paste"]').addClass('hidden');

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
		self.$el.find('.sku-list-container').removeClass('hidden');
		self.$el.find('.group-list-container').removeClass('hidden');
		self.$el.find('th.sorting').removeClass('sorting');
		self.$el.find('th.orderBy').removeClass('orderBy');
		self.$el.find('a[name="clear-paste"]').removeClass('hidden');
		self.listView.render();
	},

	_handlerCancel: function (argument) {
		this.trigger('onCancel');
	}
})