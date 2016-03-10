({
	initialize: function(options){
		var self = this;
		self.context = options.context;
		self._model = options.model;
		self.accountsCollection = app.data.createBeanCollection('Accounts');
		//self.accountsCollection = //app.data.createBeanCollection('Accounts');
		debugger;
	},
	_renderHtml: function(){
		var self = this;
		debugger;
		self.currentView = app.template.get('promotionconf-accounts.QS_Promociones');
		self.$el.html(self.currentView());
		// init events 
		var btnShowCatalogAccount = $(self.$el.find(".show_account_list"));
		var chkAccountFilter = $(self.$el.find("#account_filter_todos"));
		chkAccountFilter.on('change',function(hdl){
			self._changeFilterVisibility(this,'account_select_content');
		});
		btnShowCatalogAccount.on('click',function(hdl){
			self._showAccountsDrawer();
		});

		// init fields
		//self._initAccoutsFilter();
		self.accountsCollection = self._model.getRelatedCollection('qs_promociones_accounts');//('qs_promociones_accounts');
		if(self.accountsCollection.models.length){
			chkAccountFilter.val(false);
			chkAccountFilter.attr('checked', false);
			chkAccountFilter.trigger('change');
			self._showAccountsTable(self.accountsCollection);
		}
		else{
			self.accountsCollection.fetch({relate: true,
	    		success: function(records) {
		    		if(self.accountsCollection.length){
		    			chkAccountFilter.val(false);
		    			chkAccountFilter.attr('checked', false);
		    			chkAccountFilter.trigger('change');
		    		}
		    		self._showAccountsTable(self.accountsCollection);
				},
				error: function (obj){
					console.log("Error : "+obj);
				}
			});
		}
	},
	_showAccountsDrawer: function(){
		var self = this;
    	app.drawer.open({
          	layout: 'selection-list',
            context: {
            	module: 'Accounts',
            	recLink: 'qs_promociones_accounts',
            	recContext: app.controller.context,
            	recParentModel: self._model,
            	recParentModule: self.module,
            	recView: self,
            },
        });
	},
	_showAccountsTable: function(){
		var self = this;
		var $accountContent = $("#selected_accounts_list");
		var contextCstm = this.context.getChildContext({
			module: 'Accounts',
			forceNew: false,
			create: false,
			link:'qs_promociones_accounts', //relationship name
		});
		contextCstm.prepare();
		self.accountsList = app.view.createLayout({
			context:contextCstm,
			name: 'list',
			module: contextCstm.module,
		});
		//debugger;
		//this.layout._components.push(self.accountsList);
		$accountContent.html(self.accountsList.$el);
        self.accountsList.render();
	},
	_changeFilterVisibility : function(hdl,idElement){
		if(!$(hdl).is(':checked')){
			$("#"+idElement).removeClass('hide');
		}
		else{
			$("#"+idElement).addClass('hide');	
		}
	},
})