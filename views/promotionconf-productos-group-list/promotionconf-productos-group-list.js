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

		this.groupEditView =  app.view.createView({
			type: 'promotionconf-productos-edit-group',
			name: 'promotionconf-productos-edit-group',
			module: 'QS_Promociones',
			nodoPadre: nodoPadre,
			productoCriterio: {
                grupo_c: grupo,
                grupo_padre_c: this.grupoPadre ,
                iniciador_c: true
            }
		});
		this.groupEditView.on('onSave', _.bind(this._handlerSaveGrupo, this));
		this.groupEditView.on('onCancel', _.bind(this._handlerCancelEditGrupo, this));
		this.groupEditView.render();
		this.$el.find('.group-container').html(this.groupEditView.el);
	},

	_handlerSaveGrupo: function (productoCriterio, productosCriterioCollection, grupoPadre) {
		var nodo = {
			grupo: productoCriterio.get('grupo_c'),
			grupoPadre: null,
			iniciador: productoCriterio.get('iniciador_c'),
			name: productoCriterio.get('name'),
			grupos: []
		};
		this.arbol.push(nodo);
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