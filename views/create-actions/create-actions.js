({
	events: {

	},

    extendsFrom: "CreateActionsView",
	
	initialize: function(){
		this._super('initialize', arguments);
		var self = this;
		this.model.on('change:region', _.bind(self._handlerSucursales, self));
		this.model.on('change:todo_grupo_c', _.bind(self._handlerTodoGrupo, self));

		this.model.on('change:canal', _.bind(self._handlerCanales, self));
		this.model.on('change:sub_canal', _.bind(self._handlerSubcanales, self));

		app.once("app:view:change", function(name, attributes){
			var todasCompanias = self.getField('todas_companias_c');
			todasCompanias.setDisabled();
			var todasSucursales = self.getField('todas_sucursales_c');
			todasSucursales.setDisabled();

			var todosSubcanales = self.getField('todos_subcanales_c');
			todosSubcanales.setDisabled();
			var todosGiros = self.getField('todos_giros_c');
			todosGiros.setDisabled();
        });

        self.accountModule = App.metadata.getModule('Accounts');
	},

	_handlerSucursales: function(){
		var self = this;
		var options = {};
		// Obtener la listas de las companias seleccionadas
		var values = self.model.get('region');
		_.each(values, function(item, index){
			var listStringsName = "seg_geo_com_"+item+"_list";
            options = _.extend(options, app.lang.getAppListStrings(listStringsName));
		});
        var sucursal = this.getField('sucursal');
        self.model.set('sucursal', []);
        sucursal.items = options;
        sucursal.render();

        var todasSucursales = self.getField('todas_sucursales_c');
        if(!values.length){
			self.model.set('todas_sucursales_c', !values.length);
        }

		todasSucursales.setDisabled(!values.length);
	},

	_handlerTodoGrupo: function(){
		var self = this;
		var todasCompanias = self.getField('todas_companias_c');
		todasCompanias.setDisabled(self.model.get('todo_grupo_c'));
		if(self.model.get('todo_grupo_c')){
			self.model.set('todas_companias_c', true);
		}
	},

	_handlerCanales: function () {
		var self = this;
		var options = {};
		// Obtener la listas de las companias seleccionadas
		var values = self.model.get('canal');
		_.each(values, function(canalOption){
			var subcanalOptions = self.accountModule.fields['sub_canal_c'].visibility_grid.values[canalOption];
			var subcanalListStrings = app.lang.getAppListStrings('Account_sub_canal_c_list');
			_.each(subcanalOptions, function(subcanalOption){

				options[subcanalOption] = subcanalListStrings[subcanalOption];
			});
		});
		//debugger;
        var subcanal = this.getField('sub_canal');
        self.model.set('sub_canal', []);
        subcanal.items = options;
        subcanal.render();

        var todosSubcanales = self.getField('todos_subcanales_c');
        if(!values.length){
			self.model.set('todos_subcanales_c', !values.length);
        }

		todosSubcanales.setDisabled(!values.length);
	},

	_handlerSubcanales: function () {
		var self = this;
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
		//debugger;
        var giroCanal = this.getField('giro_canal');
        self.model.set('giro_canal', []);
        giroCanal.items = options;
        giroCanal.render();

        var todosGiros = self.getField('todos_giros_c');
        if(!values.length){
			self.model.set('todos_giros_c', !values.length);
        }

		todosGiros.setDisabled(!values.length);
	}
})