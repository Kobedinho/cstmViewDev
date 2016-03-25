({
	events:{
		'keyup textarea[name="paste"]': '_handlerPaste',
		'click a[name="clear-paste"]': '_clearPaste'
	},
	initialize: function (argument) {
		this._super('initialize', arguments);
		this.meta = {
			fields: [
				{
					name: 'todos_usuario_c',
					type: 'bool',
					label: 'LBL_TODOS_USUARIO'
				},
			]
		}
		this.model = app.data.createBean('QS_Promociones');
		this.action = 'detail';
		this.collection = app.data.createBeanCollection('QS_ProductosCriterio', []);
		this._initListView();
	},

	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		var self = this;
		var $container = this.$el.find('.productos-criterio-grid');
		self.listView.render();
		$container.html(self.listView.el);
	},

	_handlerPaste: function(evt) {
		var self = this;
		var text = evt.target.value;
		self.collection.reset([]);
		if(text){
			var rows = text.split('\n');
			var model = null;
			_.each(rows, function(row, index) {
				model = app.data.createBean('QS_ProductosCriterio', {name: row, condicion: "Mayor"});
				self.collection.add(model);
			})
			self.listView.render();
			self._validateSkus(rows, _.bind(self._handlerValidateSkus, self));
		}
	},

	_initListView: function (argument) {
		var self = this;
		var template = app.template.get('promotionconf-productos.productos-criterio-grid.QS_Promociones');
		var model = app.data.createBean('QS_ProductosCriterio');
		var context = app.context.getContext({
			collection: this.collection,
			model: model,
			module: model.module
		});
		var module = _.clone(app.metadata.getModule('QS_ProductosCriterio'));
		var fields = [];
		fields.push(module.fields.name);

		var editableFields = ['condicion','cantidad','ycantidad_c','cantidad_minima_c','limitado_a_c','iniciador_c','tipo_unidad_c'];

		_.each(editableFields, function (item) {
			module.fields[item].template = 'edit';
			fields.push(module.fields[item]);
		});

		self.listView =  app.view.createView({
			context: context,
			type: 'list',
			name: 'producto-criterio-designer-list',
			module: 'QS_ProductosCriterio',
			template: app.template.get('promotionconf-productos.list.QS_Promociones'),
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

		self.collection.each(function (model, index) {
			model.set((skuResults[index].status === 200 ? '_is_valid': '_is_invalid'), true);
		});

		self.listView.render();
	},

	_clearPaste: function (argument) {
		this.$el.find('textarea[name="paste"]').val('');
		this.collection.reset([]);
		//this.listView.render();
	}


})