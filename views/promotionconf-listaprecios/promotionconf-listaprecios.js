({
	initialize: function(options){
		this._super('initialize', arguments);
		var self = this;
		self.context = options.context;
		self._model = options.model;
		self.allListas = true;
		self.parentView = options.parentView;
		// event to dispose this view
		app.once('promotion-configurator::close', _.bind(this._handlerClose, this));
	},
	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		var self = this;
		// init events 
		var btnShowCatalogLista = $(self.$el.find(".show_precio_list"));
		var chkListaFilter = $(self.$el.find(".precio_filter_todos"));
		chkListaFilter.on('change',function(hdl){
			self._changeFilterVisibility(this,'precio_select_content');
			// validando si el check esta encendido
			if($(self.$el.find(".precio_filter_todos")).is(':checked')){
				// ligar todas las listas desplegables a la promoción
				app.alert.show('link_LP', { 
					level: 'confirmation', 
					messages: '¿Desea relacionar todas las listas de precio a la promoción?', 
					title: 'Relación masiva',
					onCancel: function() {
						$(self.$el.find(".precio_filter_todos")).prop('checked', false);
						$(self.$el.find(".precio_filter_todos")).trigger('change');
                		return false;
            		},
            		onConfirm: function() {
            			app.alert.show('link_LP_Process', { 
							level: 'process', 
							messages: 'Relacionando listas de precios.....', 
							title: '',
						});
                		self._relacionaLP();
            		}
				});
			}
		});
		btnShowCatalogLista.on('click',function(hdl){
			self._showListDrawer();
		});
		chkListaFilter.trigger('change');
		$(self.$el.find('.precio_folios_content')).show();
		$(self.$el.find('.selected_precios_list')).show();
		// permitiendo que se elijan listas de precio
		self.listasCollection = self._model.getRelatedCollection('qs_promociones_qs01_listasprecio');
		self.listasCollection.fetch({relate: true,
    		success: function(records) {
	    		self._showListasTable(self.listasCollection);
			},
			error: function (obj){
				console.log("Error : "+obj);
			}
		});
		self.parentView.layout.on('filter:record:linked',_.bind(function(){
			// refresca tabla
			self._refresLPTable();
		}));
	},
	_showListDrawer: function(){
		var self = this;
		console.log(self.module);
    	app.drawer.open({
          	layout: 'selection-list',
            context: {
            	module: 'QS01_ListasPrecio',
            	recLink: 'qs_promociones_qs01_listasprecio',
            	recContext: app.controller.context,
            	recParentModel: self._model,
            	recParentModule: self.module,
            	recView: self.parentView,
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
		self.listasLayout = app.view.createLayout({
			context:contextCstm,
			name: 'list',
			module: contextCstm.module,
		});
		
        //self.listasLayout.$el.find('a[data-event="list:preview:fire"]').addClass('hidden');
        var listButtonView = self.listasLayout._components.reverse()[0]
        listButtonView.paginationComponent.meta.rowactions.actions.shift(); 
        
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
	_relacionaLP: function(){
		var self = this;
		var dataRequest = {idPromocion : self.model.get('id')};
		var linkLP = app.api.call('create', '/rest/v10/QS_Promociones/listaprecios', dataRequest );
		linkLP.xhr.done(function(data){
			console.log('registros relacionados');
			app.alert.dismiss('link_LP_Process');
			app.alert.show('link_LP', { 
				level: 'success', 
				messages: 'Se han relacionado Todas las Listas de precio correctamente', 
				title: 'Link',
			});
			// refrescando tabla
			self._refresLPTable();
		});
	},
	_refresLPTable: function(){
		var term = "";
        var options = { limit: null, query: term };
        this.listasLayout.context.get("collection").resetPagination();
        this.listasLayout.context.resetLoadFlag(false);
        this.listasLayout.context.set('skipFetch', false);
        this.listasLayout.context.loadData(options);
        debugger;
	},
	_handlerClose: function(){
		if(this.listasLayout)
			this.listasLayout.dispose();
	},
})