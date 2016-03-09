({
	_renderHtml: function(){
		var self = this;
		self.currentView = app.template.get('promotionconf-productos.QS_Promociones');
		self.$el.html(self.currentView());
	}
})