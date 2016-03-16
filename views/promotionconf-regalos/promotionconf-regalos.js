({
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
	},
	_crearRegalo: function(){
		var self = this;
		var $select = self.$el.find('#tipoRegalo');
		if($select.val()=="volumen"){
			var self = this;
	    	app.drawer.open({
	          	layout: 'promotionconf-volumenregalo',
	            context: self.context,
	        },function(arg){
	        	// refrescar tabla
	        	alert('vista cerrada --- saludos');
	        });
			// cargar vista de volumenes de regalo
	        /*var $productosContent = $("#view_promotionconf_productos");
			self.productosView = app.view.createView({
				context: self.context, //contextCstm,
				name: 'promotionconf-volumenregalo',
				module: 'QS_Promociones',
				model: self._model,
				parentView : self.parentView,
			});
			//self.layout._components.push(self.productosView);
			$productosContent.append(self.productosView.$el);
	        self.productosView.render();
	        */
		}
		else{
			// cargar vista de descuentos financieros
	        var $regalosContent = $("#view_promotionconf_regalos");
			self.regalosView = app.view.createView({
				context: self.context, //contextCstm,
				name: 'promotionconf-regalos',
				module: 'QS_Promociones',
				model: self.model,
				parentView : self,
			});
			//self.layout._components.push(self.regalosView);
			$regalosContent.append(self.regalosView.$el);
	        self.regalosView.render();
		}
	}
})