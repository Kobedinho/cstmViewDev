({
	initialize: function(options){
		var self = this;
		self.context = options.context;
		self._model = options.model;
		// event to dispose this view
		app.once('promotion-configurator::close', _.bind(this._handlerClose, this))
	},
	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		
		var self = this;
		//self.currentView = app.template.get('promotionconf-accounts.QS_Promociones');
		//self.$el.html(self.currentView());
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
		$('#accounts_by_folio').on('keyup', function (e) {
			// procesando los foliosQS
			self._handlerFoliosQs(e.target.value);
			console.log(' ----- ----- End After paste ----- ------ ');
      });
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
	_handlerFoliosQs : function(data){
		var rows = data.split("\n");
		console.log('rows - pasted -- '+rows);
		self.accounts = [];
		if(data.length){
			$("#paste_content").hide();
			$("#paste_content_message").show();
			for(var y in rows) {
			    var cells = rows[y].split("\t");
			    if(cells.length > 1){
			    	self.$el.find('.paste').removeClass('hide');
					self.$el.find('.message').empty();
			    	return false;
			    }
			    //var row = $('<tr />');
			    count++;
			    //row.append('<td>'+count+'</td>');
			    var countCells = 0;
			    for(var x in cells) 
			    {
			    	if(!countCells){
			    		self.accounts.push({
			    			folio_qs: cells[x],
			    			account: null,
			    			sitio: null
			    		});
			    	}
			    	countCells++;
			        //row.append('<td>'+cells[x]+'</td>');
			    }
			    //row.append('<td>--</td>');
			    //table.append(row);
			}
			self._validateAccounts();
		}
		else{
			$("#paste_content").show();
			$("#paste_content_message").hide();
		}
	},
	_validateAccounts: function () {
		var self = this;
		var dataRequest = {
            requests:[]
        };
		_.each(self.accounts, function (accountData) {
        	var filter = {filter:[{folio_qs_c: accountData.folio_qs}]};
        	
            dataRequest.requests.push({
                method: "GET",
                //url: "/v10/" + model.module + "/" + model.id + "/link/" + link,
                url: "/v10/Accounts/filter?" + $.param(filter),

            });
        });

        var callbacks = { 
            success: _.bind(function (responses) {
            	var invalidCounter = 0;
            	_.each(responses, _.bind(function (response, index) {
            		//var $tr = self.$el.find('table tbody tr:eq('+index+')');
            		//debugger;
            		if(response.contents && response.contents.records.length){
            			//$tr.find('td:eq(1)').addClass('valid');
            			self.accounts[index].account = response.contents.records[0];
            		}
            		else{
            			//$tr.find('td:eq(1)').addClass('invalid');
            			invalidCounter++;
            		}

            	}, self));
        		if(invalidCounter){
        			console.log('folios invalidos '+invalidCounter);
        			//self.$el.find('a[name="clear_button"]').removeClass('hide');
					//self.$el.find('.message').empty();
					//self.$el.find('.paste-container').addClass('hide');
        		}
        		else{
        			//self._getSitios();
        			// relacionar las cuentas validas con la promocion
        		}
            }, self),
            error: _.bind(function (data) {
                console.error(data);
            }, self)
        };
        app.api.call('create', '/rest/v10/bulk', dataRequest, callbacks);
	},
	_handlerClose: function(){
		this.accountsList.dispose();
	}
})