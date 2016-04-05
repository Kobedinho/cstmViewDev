({
	events:{
		'click a.agregar-grupo': '_handlerCreateGroup',
		//'click li.group a': '_handlerItemClick',
	},

	initialize: function () {
		this._super('initialize', arguments);
		this.nextGrupo = 1;
		//this.grupo = this.options.grupo || '';
		this.collection = app.data.createBeanCollection('QS_ProductosCriterio', []);
		this.collection.on('reset add remove', _.bind(this.render, this));
		this.grupos = {};
		this.arbol = [];
	},

	_handlerCreateGroup: function (argument) {
		this.$el.find('.group-list-container').addClass('hidden');
		this.$el.find('.group-container').removeClass('hidden');
		this.groupEditView =  app.view.createView({
			type: 'promotionconf-productos-edit-group',
			name: 'promotionconf-productos-edit-group',
			module: 'QS_Promociones',
			productoCriterio: {
                grupo_c: (this.grupo ? this.grupo + ' - ' : "")  + this.nextGrupo,
                grupo_padre_c: this.grupoPadre ,
                iniciador_c: true
            }
		});
		this.groupEditView.on('onSave', _.bind(this._handlerSaveGrupo, this));
		this.groupEditView.on('onCancel', _.bind(this._handlerSaveGrupo, this));
		this.groupEditView.render();
		this.$el.find('.group-container').html(this.groupEditView.el);
	},

	_handlerSaveGrupo: function (productoCriterio, productosCriterioCollection, grupoPadre) {
		//this.collection.add(productoCriterio);
		this.grupos[productoCriterio.get('grupo_c')] = {
			model: productoCriterio,
			collection: productosCriterioCollection,
			grupo_c: productoCriterio.get('grupo_c'),
			grupo_padre_c: productoCriterio.get('grupo_padre_c')
		};
	},

	_handlerCancelEditGrupo: function (argument) {
		this.$el.find('.group-list-container').removeClass('hidden');
		this.$el.find('.group-container').addClass('hidden');
		this.groupEditView.remove();
		this.groupEditView = null;
	}


});