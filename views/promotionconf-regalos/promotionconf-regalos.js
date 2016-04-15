({
	events:{
		'click span.crear-grupo': '_handlerNewGroup',
		'click a[name="create-group-descuento"]': '_handlerNewGroup',
		'click a[name="create-group-volumen"]': '_handlerNewGroup',
	},
	initialize:function(args){
		this._super('initialize', arguments);
		var self = this;
		//self.context = options.context;
		self._model = args.model;
		self.parentView = args.parentView;
		self.arbol = [
		{
                grupo:'1',
                name: 'Descuento de 208 pesos a tambos',
                grupos:[
                    {
                        grupo:'1-1',
                        name: 'Descuento de 10 pesos a tambos',
                        grupos:[
                            {
                                grupo:'1-1-1',
                                name: 'Descuento de 10 pesos a tambos',
                                grupos:[
                                
                                ]
                            }, 
                            {
                                grupo:'1-1-2',
                                name: 'Descuento de 10 pesos a tambos',
                                grupos:[
                                
                                ]
                            }, 
                            {
                                grupo:'1-1-3',
                                name: 'Descuento de 10 pesos a tambos',
                                grupos:[
                                
                                ]
                            }, 
                        ]
                    },  
                    {
                        grupo:'1-2',
                        name: 'Descuento de 10 pesos a tambos',
                        grupos:[
                        
                        ]
                    },    
                ]
            },
            {
                grupo:'2',
                name: 'Descuento de 10% tambos',
                grupos:[
                        
                ]
            }
		];
		self.grupos = {};
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
	_handlerNewGroup : function(evt){
		var self = this;
		// ocultando listado
		self.$el.find(".contentList").addClass('hidden');//.hide();
		self.$el.find(".groupContent").removeClass('hidden');//.show();

		var tipoRegalo = '';
		var grupoPadre = null;
		var grupo = null;
		if(evt.target && evt.target.dataset.module){
			tipoRegalo = evt.target.dataset.module;
			grupoPadre = $(evt.target).closest('li.grupo').data('grupo');
			grupo = grupoPadre + '-' + (this.grupos[grupoPadre].collection.length + 1);
		}
		else{
			tipoRegalo = self.$el.find("#tipoRegalo").val();
			grupo = (this.arbol.length + 1).toString();
		}

		if(tipoRegalo==="QS_VolumenRegalo"){
			this.grupoView = app.view.createView({
				context: self.context, //contextCstm,
				name: 'promotionconf-volumenregalo',
				module: 'QS_Promociones',
				idPromo: self.model.get('id'),
				grupo_padre_c: grupoPadre,
				grupo_c: grupo
			});
		}
		else{
			this.grupoView = app.view.createView({
				context: self.context, //contextCstm,
				name: 'promotionconf-descuentofinanciero',
				module: 'QS_Promociones',
				idPromo: self.model.get('id'),
				grupo_padre_c: grupoPadre,
				grupo_c: grupo
			});
		}
		this.grupoView.render();
		this.grupoView.on('onSave', _.bind(this._handlerSaveGrupo, this));
		this.grupoView.on('onCancel', _.bind(this._handlerCancelGrupo, this));
		self.contentGroup.append(this.grupoView.$el);

		self.$el.find('.groupContent').removeClass('hidden');
		self.$el.find('.contentList').addClass('hidden');
	},

	_handlerCancelGrupo: function () {
		this.$el.find('.groupContent').addClass('hidden');
		this.$el.find('.contentList').removeClass('hidden');
		this.grupoView.remove();
		this.grupoView = null;
	},

	_handlerSaveGrupo: function (model,collection) {
		this.$el.find('.groupContent').addClass('hidden');
		this.$el.find('.contentList').removeClass('hidden');
		this.grupoView.remove();
		this.grupoView = null;
		var nodo = {
			grupo: model.get('grupo_c'),
            name: model.get('name'),
            //condicion: 'Descuento de 208 pesos',
            module: model.module,
            grupos:[]
		};

		this.grupos[nodo.grupo] = {
			grupo: nodo.grupo,
			model: model,
			collection: collection,
			nodo: nodo
		};

		if(model.get('grupo_padre_c')){
			var grupoPadre = this.grupos[model.get('grupo_padre_c')];
			grupoPadre.nodo.grupos.push(nodo);
		}
		else{
			this.arbol.push(nodo);
		}
		this.render();
		// console.log(model);
		// console.log(collection);
		// console.log('**********************************');
	}
})