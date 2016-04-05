({
	events:{

	},

	initialize: function (argument) {
		this._super('initialize', arguments);
		
		this._initGroupListView();
	},

	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		var self = this;
		var $container = this.$el.find('.productos-criterio-grupos');
		self.groupLisView.render();
		$container.html(self.groupLisView.el);
		//debugger;
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

	_initGroupListView: function (argument) {
		var self = this;
		var context = app.context.getContext({
			// collection: this.collection,
			// module: model.module
		});

		self.groupLisView =  app.view.createView({
			context: context,
			type: 'promotionconf-productos-group-list',
			name: 'promotionconf-productos-group-list',
			module: 'QS_Promociones'
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