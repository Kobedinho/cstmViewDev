({
	plugins: [
        'GridBuilder',
        'SugarLogic',
    ],
    events:{
    	'click a[name="save"]': '_handlerSave',
    	'click a[name="cancel"]': '_handlerCancel',
    	'keyup textarea[name="paste"]': '_handlerPaste'
    },
	initialize:function(){
		this._super('initialize', arguments);
		var self = this;
		this.meta.fields = [];
		this.meta.columns = 2;
		this.meta.labelsOnTop = true;
		this.module = 'QS_DescuentosFinancieros';
		//debugger;
		var grupo = this.options && this.options.grupo_c ? this.options.grupo_c : null; 
		var grupoPadre = this.options && this.options.grupo_padre_c ? this.options.grupo_padre_c : null; 
		this.model = app.data.createBean(this.module, {grupo_c: grupo, grupo_padre_c: grupoPadre});

		var module = _.clone(app.metadata.getModule(this.module));
		var editableFields = ['tipo', 'precio','descuento_monto','descuento','lista_precio','cascada_1','cascada_2','cascada_3'];

		_.each(editableFields, function (item) {
			//module.fields[item].template = 'edit';
			self.meta.fields.push(module.fields[item]);
		});

		this.grid = this.getGridBuilder(this.meta).build().grid;
		this.action = 'edit';

		this.model.on('change', _.bind(this._handlerChangeModel, this));
		this._initListView();
	},

	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		var self = this;
		var $containerSku = this.$el.find('.sku-list-container');
		self.listView.render();
		$containerSku.html(self.listView.el);
	},

	_handlerChangeModel: function (argument) {
		var showSaveButton = false;
		if(this.model.get('tipo')){
			switch(this.model.get('tipo')){
				case 'Descuento Monto':
					showSaveButton = this.model.get('descuento_monto') ?  true : false;
				break;
				case 'Descuento porcentaje': 
					showSaveButton = this.model.get('descuento') ?  true : false;
				break;
				case 'Cambio lista precio':
					showSaveButton = this.model.get('lista_precio') ?  true : false;
				break;
				case 'Cambio_de_precio':
					showSaveButton = this.model.get('precio') ?  true : false;
				break;
				case 'Cascada':
					if(
						(this.model.get('cascada_1') && this.model.get('cascada_2') && !this.model.get('cascada_3'))||
						(this.model.get('cascada_1') && this.model.get('cascada_2') && this.model.get('cascada_3'))
					){
						showSaveButton = true;
					}
					else{
						showSaveButton = false;
					}
				break;
			}
		}
		this.$el.find('textarea[name="paste"]').val('');
		if(showSaveButton){
			this.$el.find('.paste-container').removeClass('hidden');
		}
		else{
			this.$el.find('.paste-container').addClass('hidden');
		}
	},
	_handlerSave: function (argument) {
		this.trigger('onSave', this.model);		
	},
	_handlerCancel: function (argument) {
		this.trigger('onCancel');
	},

	_handlerPaste: function (evt) {
		var self = this;
		var text = evt.target.value;
		self.collection.reset([]);
		if(text){
			var rows = text.split('\n');
			var model = null;
			_.each(rows, function(row, index) {
				model = app.data.createBean('QS_DescuentosFinancieros', {id: row});
				self.collection.add(model);
			})
			//self.listView.render();
			self._validateSkus(rows, _.bind(self._handlerValidateSkus, self));
			
		}
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
			self.$el.find('a[name="save"]').addClass('hidden');
		}
		else{
			self.$el.find('a[name="save"]').removeClass('hidden');
		}

		self.collection.each(function (model, index) {
			model.set((skuResults[index].status === 200 ? '_is_valid': '_is_invalid'), true);
		});
		self.$el.find('.sku-list-container').removeClass('hidden');
		self.$el.find('th.sorting').removeClass('sorting');
		self.$el.find('th.orderBy').removeClass('orderBy');
		self.listView.render();
	},

	_initListView: function (argument) {
		var self = this;
		//var template = app.template.get('promotionconf-productos.productos-criterio-grid.QS_Promociones');
		var model = app.data.createBean('QS_DescuentosFinancieros');
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
	


})