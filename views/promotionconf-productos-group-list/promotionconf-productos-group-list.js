({
	events:{
		'click a[name="create-group"]': '_handlerCreateGroup',
		'click li.group a': '_handlerItemClick',
	},

	initialize: function () {
		this._super('initialize', arguments);
		this.collection = app.data.createBeanCollection('QS_ProductosCriterio', []);
		this.collection.on('reset add remove', _.bind(this.render, this));
	},

	_handlerCreateGroup: function (argument) {
		this.$el.find('.group-list-container').addClass('hidden');
		this.$el.find('.group-container').removeClass('hidden');
		var groupEditView =  app.view.createView({
			//context: context,
			type: 'promotionconf-productos-edit-group',
			name: 'promotionconf-productos-edit-group',
			module: 'QS_Promociones'
		});
		groupEditView.render();
		this.$el.find('.group-container').html(groupEditView.el);
	},

	_handlerItemClick: function () {
		
	},



});