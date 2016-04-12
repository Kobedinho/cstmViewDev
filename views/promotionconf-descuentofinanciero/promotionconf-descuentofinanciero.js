({
	plugins: [
        'GridBuilder',
        'SugarLogic',
    ],
    events:{
    	'a[name="save"]': '_handlerSave',
    	'a[name="cancel"]': '_handlerCancel'
    },
	initialize:function(){
		this._super('initialize', arguments);
		var self = this;
		this.meta.fields = [];
		this.meta.columns = 2;
		this.meta.labelsOnTop = true;
		this.module = 'QS_DescuentosFinancieros';
		this.model = app.data.createBean(this.module);

		var module = _.clone(app.metadata.getModule(this.module));
		var editableFields = ['tipo', 'precio','descuento_monto','descuento','lista_precio','cascada_1','cascada_2','cascada_3'];

		_.each(editableFields, function (item) {
			//module.fields[item].template = 'edit';
			self.meta.fields.push(module.fields[item]);
		});

		this.grid = this.getGridBuilder(this.meta).build().grid;
		this.action = 'edit';

		this.model.on('change', _.bind(this._handlerChangeModel, this));
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
		
		if(showSaveButton){
			this.$el.find('a[name="save"]').removeClass('hidden');
		}
		else{
			this.$el.find('a[name="save"]').addClass('hidden');

		}
	},
	_handlerSave: function (argument) {
		this.trigger('onSave', this.model);		
	},
	_handlerCancel: function (argument) {
		this.trigger('onCancel');
	}

})