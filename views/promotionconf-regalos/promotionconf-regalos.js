({
	_renderHtml: function(){
		var self = this;
		self.currentView = app.template.get('promotionconf-regalos.QS_Promociones');
		self.$el.html(self.currentView());
	}
})