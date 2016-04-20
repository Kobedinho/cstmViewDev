({
	events:{
		'click a.agregar-grupo': '_handlerCreateGroup',
	},

	initialize: function () {
		this._super('initialize', arguments);
		this.nextGrupo = 1;
		this.collection = app.data.createBeanCollection('QS_ProductosCriterio', []);
		this.collection.on('reset add remove', _.bind(this.render, this));
		this.grupos = {};
		this.arbol = [];
		debugger;
	},

	_handlerCreateGroup: function (argument) {
		this.$el.find('.group-list-container').addClass('hidden');
		this.$el.find('.group-container').removeClass('hidden');
		var $li = $(arguments[0].target).closest('li');
		//var grupo
		//var nodoPadre
		//debugger;
		var grupoPadre = $li ? this.grupos[$li.data('grupo')] : null;
		// if(grupoPadre){
		// 	debugger;
		// }
		var nodoPadre = grupoPadre ? grupoPadre.nodo : null;
		var grupo = (nodoPadre ? nodoPadre.grupo + '-' : '') + ((nodoPadre ? nodoPadre.grupos:this.arbol).length+1).toString();
		var iniciador = nodoPadre ? false : true;
		debugger;
		this.groupEditView =  app.view.createView({
			type: 'promotionconf-productos-edit-group',
			name: 'promotionconf-productos-edit-group',
			module: 'QS_Promociones',
			nodoPadre: nodoPadre,
			productoCriterio: {
                grupo_c: grupo,
                grupo_padre_c: this.grupoPadre ,
                iniciador_c: iniciador,
                qs_productoscriterio_qs_promocionesqs_promociones_ida: this.model.id
            }
		});
		this.groupEditView.on('onSave', _.bind(this._handlerSaveGrupo, this));
		this.groupEditView.on('onCancel', _.bind(this._handlerCancelEditGrupo, this));
		this.groupEditView.render();
		this.$el.find('.group-container').html(this.groupEditView.el);
	},

	_handlerSaveGrupo: function (productoCriterio, productosCriterioCollection, nodoPadre) {
		var condicion = productoCriterio.get('condicion') + ' de ' + productoCriterio.get('cantidad') + ' en ' + productoCriterio.get('tipo_unidad_c');
		var nodo = {
			grupo: productoCriterio.get('grupo_c'),
			grupoPadre: null,
			iniciador: productoCriterio.get('iniciador_c'),
			name: productoCriterio.get('name'),
			condicion: condicion,
			grupos: []
		};
		if(nodoPadre){
			nodoPadre.grupos.push(nodo);
		}
		else{
			this.arbol.push(nodo);
		}
		this.grupos[productoCriterio.get('grupo_c')] = {
			model: productoCriterio,
			collection: productosCriterioCollection,
			nodo: nodo
		}
		this.render();
	},

	_handlerCancelEditGrupo: function (argument) {
		this.$el.find('.group-list-container').removeClass('hidden');
		this.$el.find('.group-container').addClass('hidden');
		this.groupEditView.remove();
		this.groupEditView = null;
	}

});