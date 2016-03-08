({
    extendsFrom: "EnumField",
    _render: function(){
        this._super('_render', arguments);
        var self = this;
        var options = {};
        var values = [];
        var accountModule = null;

        if(self.name === 'sucursal'){
            console.log(self.items);
            values = self.model.get('region');
            _.each(values, function(item, index){
                var listStringsName = "seg_geo_com_"+item+"_list";
                options = _.extend(options, app.lang.getAppListStrings(listStringsName));
            });
        }

        if(self.name === 'sub_canal'){
            accountModule = App.metadata.getModule('Accounts');
            values = self.model.get('canal');
            _.each(values, function(canalOption){
                var subcanalOptions = accountModule.fields['sub_canal_c'].visibility_grid.values[canalOption];
                var subcanalListStrings = app.lang.getAppListStrings('Account_sub_canal_c_list');
                _.each(subcanalOptions, function(subcanalOption){
                    if(subcanalOption){                    
                        options[subcanalOption] = subcanalListStrings[subcanalOption];
                    }
                });
            });
        }

        if(self.name === 'giro_canal'){
            accountModule = App.metadata.getModule('Accounts');
            values = self.model.get('sub_canal');
            _.each(values, function(subcanalOption){
                var giroOptions = accountModule.fields['giro_c'].visibility_grid.values[subcanalOption];
                var giroListStrings = app.lang.getAppListStrings('Account_giro_list');
                _.each(giroOptions, function(giroOption){
                    if(giroOption){   
                        options[giroOption] = giroListStrings[giroOption];
                    } 
                });
            });
        }

        if(_.toArray(options).length){
            this.items = options;
        }

    }
})