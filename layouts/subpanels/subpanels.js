({
	extendsFrom: 'SubpanelsLayout',
	showSubpanel: function(linkName) {
		var self = this;
    	this._super('showSubpanel', [linkName]);
    	_.each(this._components, function(component) {
    		var currentModel = app.controller.context.get('model');
	        if(component.module==="QS09_RangosEscalas"){
	        	currentModel.on("change:tipo_promocion",function(model,value){
	        		if(value!=="Escala"){
	        			component.hide();
	        		}
	        		else{
	        			component.show();	
	        		}
	        	});
	        	return false;
	        }
    	});
	},
	_dispose: function(){
		this._super('_dispose');
	},
})
