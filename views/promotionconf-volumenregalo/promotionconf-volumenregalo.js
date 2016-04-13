({
	plugins: [
        'GridBuilder',
        'SugarLogic',
    ],
	events:{
		'click span[name="cancel_group"]':'_cancelNewGroup',
		'click span[name="save_group"]':'_saveNewGroup',
		'click span[name="clear_skus"]':'_clearSkus',
		'paste #skus_volumen_regalo': '_handlerPaste',
	},
	initialize:function(args){
		this._super('initialize', arguments);
		var self = this;
		var modelData = _.extend({ grupo_padre_c:'', grupo_c:'1', iniciador_c: true }, this.options.regalo||{});
		self.model = app.data.createBean('QS_VolumenRegalo', modelData);
		if(self.options.idPromo){
			self.model.set('qs_volumenregalo_qs_promocionesqs_promociones_ida',self.options.idPromo);
		}
		self.meta.fields = [], self.meta.columns = 2, self.action = 'edit', this.module = 'QS_VolumenRegalo';
		var module = _.clone(app.metadata.getModule('QS_VolumenRegalo'));
		var editableFields = ['tipo','piezas','maximo','precio_c'];
		_.each(editableFields, function (item) {
			self.meta.fields.push(module.fields[item]);
		});
		self.meta.fields.push({ name: 'qs_volumenregalo_producttemplatesproducttemplates_ida', type: 'relate', vname: 'LBL_PRODUCTTEMPLATES_QS_VOLUMENREGALO_1_FROM_PRODUCTTEMPLATES_TITLE'});
		self.grid = self.getGridBuilder(self.meta).build().grid;

		self.model.on('change',_.bind( self._validateFields, self ));
      	this.action = 'edit';
		//this._initListView();

	},
	_initListView: function (argument) {
		var self = this;
		var template = app.template.get('promotionconf-volumenregalo.regaloslist.QS_Promociones');
		if(self.model.get('tipo') == "Cualquiera_de"){
			var model = app.data.createBean('ProductTemplates');
			var context = app.context.getContext({
				collection: self.collection,
				model: model,
				module: model.module
			});
			var fields = [ { name: "id", label: "LBL_NAME" },];
			self.listView =  app.view.createView({
				context: context,
				type: 'list',
				name: 'producto-criterio-designer-list',
				template: template,
				layout: self,
				meta: {
					panels: [
						{
							fields: fields
						}
					]
				}
			});	
		}
		else{
			var model = app.data.createBean('QS_VolumenRegalo');
			var context = app.context.getContext({
				collection: self.collection,
				model: model,
				module: model.module
			});
			var fields = [
				{ name: "qs_volumenregalo_producttemplatesproducttemplates_ida", label: "LBL_PRODUCTTEMPLATES_QS_VOLUMENREGALO_1_FROM_PRODUCTTEMPLATES_TITLE" },
			];
			self.listView =  app.view.createView({
				context: context,
				type: 'list',
				name: 'producto-criterio-designer-list',
				module: 'ProductTemplates',
				template: template,
				layout: self,
				meta: {
					panels: [
						{
							fields: fields
						}
					]
				}
			});
		}
		self._renderSkuList();
	},
	_renderHtml: function(){
		this._super('_renderHtml', arguments);
	},
	_renderSkuList: function() {
		var self = this;
		var $containerSku = this.$el.find('.sku-list-container');
		self.listView.render();
		$containerSku.html(self.listView.el);
	},
	_handlerPaste: function(e){
		var self =this;
		var data = e.originalEvent.clipboardData.getData('Text');
		self._handlerSkus(data);
	},
	_handlerSkus: function(data){
		var self = this; 
		var rows = data.split("\n");
		self.accounts = [];
		var count = 0;
		self.collection.reset([]);
		if(data.length){
			self.$el.find("#paste_content_message").show();
			_.each(rows, function(row, index) {
				if(self.model.get('tipo') == 'Cualquiera_de'){
					model = app.data.createBean('ProductTemplates', {id: row});
				}
				else{
					model = app.data.createBean('QS_VolumenRegalo', {qs_volumenregalo_producttemplatesproducttemplates_ida: row});
				}
				self.collection.add(model);
			})
			var msg = "Folios encontrados : "+rows.length;
			var $cstMsg = $(self.$el.find("#paste_content_cstmsg"));
			$cstMsg.append(msg);
			self._validateSkus(rows,_.bind(self._handlerValidSkus, self));
		}
		else{
			self.$el.find("#paste_content_message").hide();
		}
	},
	_validateSkus: function(skus, callback){
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
	_handlerValidSkus: function(result, skuResults){
		var self = this;
		
		if(!result){
			app.alert.show('Skus invalidos', {
				level: 'error',
				messages: 'Skus invalidos, retire los valores no validos.',
				autoClose: true
			});
		}
		else{
			self.$el.find('span[name="save_group"]').removeClass('hide');
		}

		self.collection.each(function (model, index) {
			model.set((skuResults[index].status === 200 ? '_is_valid': '_is_invalid'), true);
		});
		self.$el.find('.sku-list-container').removeClass('hidden');
		self.$el.find('.group-list-container').removeClass('hidden');
		self.$el.find('th.sorting').removeClass('sorting');
		self.$el.find('th.orderBy').removeClass('orderBy');
		self.$el.find('span[name="clear_skus"]').removeClass('hide');
		self.$el.find("#paste_content_message").hide();

		self._initListView();
		//self._renderSkuList(); //listView.render();
		//debugger;
	},
	_saveNewGroup: function () {
		var self = this;
		if(this._validate()){
			if(self.model.get('tipo') !== 'Cualquiera_de'){
				this.collection.each(function (model) {
					model.set({
						tipo: self.model.get('tipo'),
						piezas: self.model.get('piezas'),	
						iniciador_c: self.model.get('iniciador_c'),
						precio_c : self.model.get('precio_c'),
						grupo_c: self.model.get('grupo_c'),
						grupo_padre_c: self.model.get('grupo_padre_c'),
						qs_volumenregalo_qs_promocionesqs_promociones_ida : self.model.get('qs_volumenregalo_qs_promocionesqs_promociones_ida'),
						qs_volumenregalo_producttemplatesproducttemplates_ida : self.model.get('qs_volumenregalo_producttemplatesproducttemplates_ida'),	
					});
				});
			}
			else{

			}
		}
		self.trigger('onNewGroupSaved', this.model, this.collection);
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
	_clearSkus: function(){
		var self = this;
		self.$el.find("#skus_volumen_regalo").val('');
		self.$el.find('span[name="save_group"]').addClass('hide');
		self.$el.find('span[name="clear_skus"]').addClass('hide');
		self.collection.reset([]);
		self._renderSkuList();
		//self.listView.render();
	},
	_cancelNewGroup: function(){
		var self = this;
		self.trigger('onCancelNewGroup');
	},
	_validateFields : function() {
		console.log("bean modificado .... ");
		var self = this;
		if( self.model.get('tipo') && self.model.get('piezas') ){
			// validando que el regalo no sea mixto
			/*if( self.model.get('tipo')==="mixto" && self.model.get('precio_c') ){
			}*/
			self._showSkusArea();
		}
		else{
			self._hideSkusArea();	
		}
	},
	_showSkusArea : function(){
		var self = this;
		self.$el.find("#skus_volumen_regalo").show();
	},
	_hideSkusArea : function(){
		var self = this;
		self.$el.find("#skus_volumen_regalo").hide();
	},
})