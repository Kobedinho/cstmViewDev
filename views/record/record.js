({

    extendsFrom: "RecordView",
	
	initialize: function(){
		this._super('initialize', arguments);
		var self = this;
		this.model.on('change:region', _.bind(self._handlerSucursales, self));
		this.model.on('change:todo_grupo_c', _.bind(self._handlerTodoGrupo, self));

		this.model.on('change:canal', _.bind(self._handlerCanales, self));
		this.model.on('change:sub_canal', _.bind(self._handlerSubcanales, self));

		//add listener for custom button
        this.context.on('button:configura_promocion:click', this._configurePromotion, this);

        self.accountModule = App.metadata.getModule('Accounts');

	},

	_renderHtml: function () {
		this._super('_renderHtml', arguments);
		var self = this;
		

	},

	_render: function(){
		this._super('_render', arguments);
		var self = this;
		var todasCompanias = self.getField('todas_companias_c');
		if(todasCompanias){
			todasCompanias.setDisabled(self.model.get('todo_grupo_c'));
			var todasSucursales = self.getField('todas_sucursales_c');
			todasSucursales.setDisabled(!self.model.get('region').length);
		}
	},

	_handlerSucursales: function(){
		var self = this;
		//if(self.currentState === 'view') return;
        var sucursal = this.getField('sucursal');
        if(!sucursal) return;
        var values = self.model.get('region');
		var options = {};
		// Obtener la listas de las companias seleccionadas
		
		_.each(values, function(item, index){
			var listStringsName = "seg_geo_com_"+item+"_list";
            options = _.extend(options, app.lang.getAppListStrings(listStringsName));
		});
		var sucursalOptions = self.model.get('sucursal');
		var sucursalOptionsAux = [];
		_.each(sucursalOptions, function(sucursalOption, key){
			if(!_.isUndefined(options[sucursalOption])){
				sucursalOptionsAux.push(sucursalOption);
			}
		})
		self.model.set('sucursal', sucursalOptionsAux);
        sucursal.render();

        var todasSucursales = self.getField('todas_sucursales_c');
        if(!values.length){
			self.model.set('todas_sucursales_c', !values.length);
        }
        
        var todasSucursales = self.getField('todas_sucursales_c');
		todasSucursales.setDisabled(!values.length);
	},

	_handlerTodoGrupo: function(){
		var self = this;
		//if(self.currentState === 'view') return;
		var todasCompanias = self.getField('todas_companias_c');
		if(!todasCompanias) return;
		todasCompanias.setDisabled(self.model.get('todo_grupo_c'));
		if(self.model.get('todo_grupo_c')){
			self.model.set('todas_companias_c', true);
		}
	},


	/***********************************
	* Bloque Nicho
	***********************************/
	_handlerCanales: function () {
		var self = this;
		if(self.currentState === 'view') return;
        var subcanal = this.getField('sub_canal');
        if(!subcanal) return;
		var values = self.model.get('canal');
		var options = {};

		// Obtener la listas de las companias seleccionadas
		_.each(values, function(canalOption){
			var subcanalOptions = self.accountModule.fields['sub_canal_c'].visibility_grid.values[canalOption];
			var subcanalListStrings = app.lang.getAppListStrings('Account_sub_canal_c_list');
			_.each(subcanalOptions, function(subcanalOption){

				options[subcanalOption] = subcanalListStrings[subcanalOption];
			});
		});

		var subcanalOptions = self.model.get('sub_canal');
		var subcanalOptionsAux = [];
		_.each(subcanalOptions, function(subcanalOption, key){
			if(!_.isUndefined(options[subcanalOption])){
				subcanalOptionsAux.push(subcanalOption);
			}
		})
		self.model.set('sub_canal', subcanalOptionsAux);

        subcanal.render();

        var todosSubcanales = self.getField('todos_subcanales_c');
        if(!values.length){
			self.model.set('todos_subcanales_c', !values.length);
        }

		todosSubcanales.setDisabled(!values.length);
	},



	_handlerSubcanales: function () {
		var self = this;
		if(self.currentState === 'view') return;
        var giroCanal = this.getField('giro_canal');
        if(!giroCanal) return;
		var options = {};
		// Obtener la listas de las companias seleccionadas
		var values = self.model.get('sub_canal');
		_.each(values, function(subcanalOption){
			var giroOptions = self.accountModule.fields['giro_c'].visibility_grid.values[subcanalOption];
			var giroListStrings = app.lang.getAppListStrings('Account_giro_list');
			_.each(giroOptions, function(giroOption){
				options[giroOption] = giroListStrings[giroOption];
			});
		});
        var giroOptions = self.model.get('giro_canal');
		var giroOptionsAux = [];
		_.each(giroOptions, function(giroOption, key){
			if(!_.isUndefined(options[giroOption])){
				giroOptionsAux.push(giroOption);
			}
		})
		self.model.set('giro_canal', giroOptionsAux);
        giroCanal.render();

        var todosGiros = self.getField('todos_giros_c');
        if(!values.length){
			self.model.set('todos_giros_c', !values.length);
        }

		todosGiros.setDisabled(!values.length);
	},

	/////////////////////////////////
	//configuración de promociones //
	/////////////////////////////////
	_configurePromotion: function(){
		var self = this;
        var context = this.model.isNew() ? this.context: app.controller.context;
        context = this.context;
        app.drawer.open({
            "layout" : "promotion-configurator",
            "context": context,
            "showInDrawer": true,
        }, function (argument) {
        	debugger; // configuracion terminada
        });
	},

})