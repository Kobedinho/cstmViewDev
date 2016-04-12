({
	events:{
		'click span.crear-grupo': '_handlerNewGroup',
	},
	initialize:function(args){
		this._super('initialize', arguments);
		var self = this;
		//self.context = options.context;
		self._model = args.model;
		self.parentView = args.parentView;
	},
	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		var self = this;
		var $btnCreaRegalos = self.$el.find('.regalos');
		$btnCreaRegalos.on('click',function(){
			self._crearRegalo();
		})
		self.contentGroup = self.$el.find('.nvoGrupo-content');
	},
	_crearRegalo: function(){
		var self = this;
		var $select = self.$el.find('#tipoRegalo');
		if($select.val()=="volumen"){
			var self = this;
	    	app.drawer.open({
	          	view: 'promotionconf-volumenregalo',
	            context: self.context,
	        },function(arg){
	        	// refrescar tabla
	        	alert('vista cerrada --- saludos');
	        });
		}
		else{
			// cargar vista de descuentos financieros
	        var $regalosContent = $("#view_promotionconf_regalos");
			self.regalosView = app.view.createView({
				context: self.context, //contextCstm,
				name: 'promotionconf-descuentofinanciero',
				module: 'QS_Promociones',
				//model: self.model,
				//parentView : self,
			});
	        self.regalosView.render();
	        debugger;
			//self.layout._components.push(self.regalosView);
			$regalosContent.append(self.regalosView.$el);
		}
	},
	_handlerNewGroup : function(){
		var self = this;
		// ocultando listado
		self.$el.find(".contentList").hide();
		var tipoRegalo = self.$el.find("#tipoRegalo").val();
		var grupoView = null;
		if(tipoRegalo==="volumen"){
			grupoView = app.view.createView({
				context: self.context, //contextCstm,
				name: 'promotionconf-volumenregalo',
				module: 'QS_Promociones',
			});
		}
		else{
			grupoView = app.view.createView({
				context: self.context, //contextCstm,
				name: 'promotionconf-descuentofinanciero',
				module: 'QS_Promociones',
			});
		}
		grupoView.render();
		grupoView.on('onSave', _.bind(this._handlerSaveGrupo, this));
		grupoView.on('onCancel', _.bind(this._handlerCancelGrupo, this));
		self.contentGroup.append(grupoView.$el);

		self.$el.find('.groupContent').removeClass('hidden');
		self.$el.find('.contentList').addClass('hidden');
	},

	_handlerCancelGrupo: function (argument) {
		this.$el.find('.groupContent').addClass('hidden');
		this.$el.find('.contentList').removeClass('hidden');
	},

	_handlerSaveGrupo: function (model) {
		this.$el.find('.groupContent').addClass('hidden');
		this.$el.find('.contentList').removeClass('hidden');
	}
})