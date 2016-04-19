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
	_handlerNewGroup : function(){
		var self = this;
		// ocultando listado
		self.$el.find(".contentList").addClass('hidden');//.hide();
		self.$el.find(".groupContent").removeClass('hidden');//.show();
		var tipoRegalo = self.$el.find("#tipoRegalo").val();
		var grupoView = null;
		if(tipoRegalo==="volumen"){
			grupoView = app.view.createView({
				context: self.context, //contextCstm,
				name: 'promotionconf-volumenregalo',
				module: 'QS_Promociones',
				idPromo: self.model.get('id'),
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
		self.contentGroup.html(grupoView.$el);

		self.$el.find('.groupContent').removeClass('hidden');
		self.$el.find('.contentList').addClass('hidden');
	},

	_handlerCancelGrupo: function (argument) {
		this.$el.find('.groupContent').addClass('hidden');
		this.$el.find('.contentList').removeClass('hidden');
	},

	_handlerSaveGrupo: function (model,collection) {
		this.$el.find('.groupContent').addClass('hidden');
		this.$el.find('.contentList').removeClass('hidden');
		console.log('**********************************');
		console.log(model);
		console.log(collection);
		console.log('**********************************');
	}
})