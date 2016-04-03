({
	extendsFrom: 'RowactionField',
	initialize: function () {
		this._super('initialize', arguments);
		if(this.options.view.name === 'record' && (this.name==='edit_button' || this.name==='save_button')){
			console.log(this.model.toJSON());
			// debugger;
   //          //debugger;
   //          this.setDisable();
        }
	}
})