({
	initialize:function(args){
		this._super('initialize', arguments);
		this.meta = {
			fields: [
				{
					name: 'tipo',
					type: 'enum',
					label: 'LBL_TIPO'
				},
			]
		}
		this.action = 'detail';
		this.model = app.data.createBean('QS_VolumenRegalo');
	}
})