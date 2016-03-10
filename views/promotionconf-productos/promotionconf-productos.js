({
	events:{
		'keyup textarea[name="paste"]': '_handlerPaste'
	},
	initialize: function (argument) {
		this._super('initialize', arguments);
		this.meta = {
			fields: [
				{
					name: 'todos_usuario_c',
					type: 'bool',
					label: 'LBL_TODOS_USUARIO'
				},
			]
		}
		this.model = app.data.createBean('QS_Promociones');
		this.action = 'detail';
		this.collection = app.data.createBeanCollection('QS_ProductosCriterio');
		this.collection.on('reset add remove', _.bind(this._renderCollection, this))
	},

	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		var self = this;
	},

	_handlerPaste: function(evt) {
		var self = this;
		var text = evt.target.value;
		var rows = text.split('\n');
		var model = null;
		_.each(rows, function(row, index) {
			model = app.data.createBean('QS_ProductosCriterio', {name: row});
			self.collection.add(model)
		})
	},

	_renderCollection: function () {
		var $container = this.$el.find('.productos-criterio-grid');
		var template = app.template.get('promotionconf-productos.productos-criterio-grid.QS_Promociones');
		$container.html(template(this)); 
	}
})