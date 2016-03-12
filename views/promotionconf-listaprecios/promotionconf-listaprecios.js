({
	initialize: function(options){
		this._super('initialize', arguments);
		var self = this;
		self.context = options.context;
		self._model = options.model;
		self.allListas = true;
		// event to dispose this view
		app.once('promotion-configurator::close', _.bind(this._handlerClose, this))
	},
	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		var self = this;
		// init events 
		var btnShowCatalogLista = $(self.$el.find(".show_precio_list"));
		var chkListaFilter = $(self.$el.find(".precio_filter_todos"));
		//var pasteArea = $(self.$el.find(".lista_by_folio"));
		//var cleanBtn = $(self.$el.find(".paste_content_clearbtn"));
		chkListaFilter.on('change',function(hdl){
			self._changeFilterVisibility(this,'precio_select_content');
		});
		btnShowCatalogLista.on('click',function(hdl){
			self._showListDrawer();
		});
		//if(!self.model.get('todo_grupo_c') && !self.model.get('todas_companias_c')){
			chkListaFilter.trigger('change');
			$(self.$el.find('.precio_folios_content')).show();
			$(self.$el.find('.selected_precios_list')).show();
			// permitiendo que se elijan cuentas
			self.listasCollection = self._model.getRelatedCollection('qs_promociones_qs01_listasprecio');//('qs_promociones_accounts');
			self.listasCollection.fetch({relate: true,
	    		success: function(records) {
		    		self._showListasTable(self.listasCollection);
				},
				error: function (obj){
					console.log("Error : "+obj);
				}
			});
		/*}
		else{
			// alertando al usuario que puede pasar al siguiente paso porque la promocion aplica para todas las cuentas
			var msg = "Puedes continuar con el paso siguiente ya que la promoción aplica para todas las cuentas... ";
			app.alert.show('notifica_usuario_cuentas', { level: 'info', messages: msg, title: 'INFO: ',autoClose: true, autoCloseDelay: 15000,});
			self.allListas = true;
		}*/
      	/*cleanBtn.on('click',function(){
      		self._limpiarArea();
      		cleanBtn.hide();
      	})*/

	},
	_showListDrawer: function(){
		var self = this;
    	app.drawer.open({
          	layout: 'selection-list',
            context: {
            	module: 'QS01_ListasPrecio',
            	recLink: 'qs_promociones_qs01_listasprecio',
            	recContext: app.controller.context,
            	recParentModel: self._model,
            	recParentModule: self.module,
            	recView: self,
            },
        });
	},
	_showListasTable: function(){
		var self = this;
		var $listaContent = $(self.$el.find(".selected_precios_list"));
		var contextCstm = this.context.getChildContext({
			module: 'QS01_ListasPrecio',
			forceNew: false,
			create: false,
			link:'qs_promociones_qs01_listasprecio', //relationship name
		});
		contextCstm.prepare();
		debugger;
		self.listasLayout = app.view.createLayout({
			context:contextCstm,
			name: 'list',
			module: contextCstm.module,
		});
		$listaContent.html(self.listasLayout.$el);
        self.listasLayout.render();
	},
	_changeFilterVisibility : function(hdl,idElement){
		var self = this;
		if(!$(hdl).is(':checked')){
			$(self.$el.find("."+idElement)).removeClass('hide');
		}
		else{
			$(self.$el.find("."+idElement)).addClass('hide');	
		}
	},
	_handlerClose: function(){
		//this.listasLayout.dispose();
	},
})