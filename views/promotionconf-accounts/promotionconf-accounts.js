({
	initialize: function(options){
		this._super('initialize', arguments);
		var self = this;
		self.context = options.context;
		self._model = options.model;
		self.allAccounts = true;
		self.parentView = options.parentView;
		// event to dispose this view
		app.once('promotion-configurator::close', _.bind(this._handlerClose, this));
	},
	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		var self = this;
		// init events 
		var btnShowCatalogAccount = $(self.$el.find(".show_account_list"));
		var chkAccountFilter = $(self.$el.find("#account_filter_todos"));
		var pasteArea = $(self.$el.find("#accounts_by_folio"));
		var cleanBtn = $(self.$el.find("#paste_content_clearbtn"));
		chkAccountFilter.on('change',function(hdl){
			if(self.allAccounts){
				var msg = "La promoción esta configurada para que aplique a todas las cuentas, si desea puede modificar este valor editando la promoción... ";
				app.alert.show('notifica_usuario_cuentas', { level: 'info', messages: msg, title: 'INFO: ',autoClose: true, autoCloseDelay: 15000,});
				chkAccountFilter.val(true);
				chkAccountFilter.attr('checked', true);
			}
			else{
				self._changeFilterVisibility(this,'account_select_content');
			}
		});
		btnShowCatalogAccount.on('click',function(hdl){
			self._showAccountsDrawer();
		});
		if(!self.model.get('todo_grupo_c') && !self.model.get('todas_companias_c')){
			self.allAccounts = false;
			chkAccountFilter.val(false);
			chkAccountFilter.attr('checked', false);
			chkAccountFilter.trigger('change');
			$(self.$el.find('#account_folios_content')).show();
			$(self.$el.find('#selected_accounts_list')).show();
			// permitiendo que se elijan cuentas
			self.accountsCollection = self._model.getRelatedCollection('qs_promociones_accounts');//('qs_promociones_accounts');
			self.accountsCollection.fetch({relate: true,
	    		success: function(records) {
		    		self._showAccountsTable(self.accountsCollection);
				},
				error: function (obj){
					console.log("Error : "+obj);
				}
			});
		}
		else{
			// alertando al usuario que puede pasar al siguiente paso porque la promocion aplica para todas las cuentas
			var msg = "Puedes continuar con el paso 2, la promoción aplica para todas las cuentas... ";
			app.alert.show('notifica_usuario_cuentas', { level: 'info', messages: msg, title: 'INFO: ',autoClose: true, autoCloseDelay: 15000,});
			self.allAccounts = true;
		}
		// 
		pasteArea.on('paste', function (e) {
			// procesando los foliosQS
			var data = e.originalEvent.clipboardData.getData('Text');
			e.target.value = data;
			self._handlerFoliosQs(data);
			cleanBtn.show();
      	});
      	cleanBtn.on('click',function(){
      		self._limpiarArea();
      		cleanBtn.hide();
      	})

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
            	recView: self.parentView,
            },
        },function(arg){
        	// refrescar tabla
        	self._refresAccount();
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
		var self = this; 
		var rows = data.split("\n");
		console.log('rows - pasted -- '+rows);
		self.accounts = [];
		var count = 0;
		if(data.length){
			$("#paste_content").hide();
			$("#paste_content_message").show();
			for(var y in rows) {
			    var cells = rows[y].split("\t");
			    if(cells.length > 1){
			    	$("#paste_content").show();
					$("#paste_content_message").hide();
			    	return false;
			    }
			    count++;
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
			    }
			}
			var msg = "Folios encontrados : "+count;
			var $cstMsg = $(self.$el.find("#paste_content_cstmsg"));
			$cstMsg.append(msg);
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
            dataRequest.requests.push({ method: "GET", url: "/v10/Accounts/filter?" + $.param(filter),});
        });
        var callbacks = { 
            success: _.bind(function (responses) {
            	var invalidCounter = 0;
            	var validCounter = 0;
            	var validAccounts = [];
            	_.each(responses, _.bind(function (response, index) {
            		if(response.contents && response.contents.records.length){
            			validAccounts.push(response.contents.records[0]);
            			validCounter++;
            		}
            		else{
            			invalidCounter++;
            		}

            	}, self));
        		if(invalidCounter){
        			var msg = "Folios incorrectos : "+invalidCounter;
        			app.alert.show('valida_Accounts_error', { level: 'error', messages: msg, title: 'FolioQS',});
					//var $cstMsgFail = $(self.$el.find("#paste_content_final_messageFail"));
					//$cstMsgFail.html(msg);
        		}
        		if(validCounter){
        			var msg = "Folios relacionados correctamente : "+validCounter;
        			app.alert.show('valida_Accounts_ok', { level: 'success', messages: msg, title: 'FolioQS',});
					//var $cstMsgOk = $(self.$el.find("#paste_content_final_messageOk"));
					//$cstMsgOk.html(msg);
        			self._relacionaCuentas(validAccounts);
        		}
        		$(self.$el.find("#paste_content_cstmsg")).html('');
        		$(self.$el.find("#paste_content")).show();
				$(self.$el.find("#paste_content_message")).hide();
            }, self),
            error: _.bind(function (data) {
                $(self.$el.find("#paste_content_cstmsg")).html('');
        		$(self.$el.find("#paste_content")).show();
				$(self.$el.find("#paste_content_message")).hide();
            }, self)
        };
        app.api.call('create', '/rest/v10/bulk', dataRequest, callbacks);
	},
	_relacionaCuentas: function(accounts){
		var self = this;
		var idsList = [];
		if (accounts.length) {
			_.each(accounts,_.bind(function(account, index){
				idsList.push(account.id);
			},self));
			if(idsList.length){
				var dataRequest = {link_name : 'qs_promociones_accounts',ids:idsList};
				var linkAccounts = app.api.call('create', '/rest/v10/QS_Promociones/'+self.model.get('id')+'/link', dataRequest );
				linkAccounts.xhr.done(function(data){
					console.log('registros relacionados');
					app.alert.show('link_Accounts', { 
						level: 'success', 
						messages: 'Se han relacionado '+accounts.length+' registros ', 
						title: 'Link',
					});
					// refrescando tabla
					self._refresAccount();
				});
			}
		}
	},
	_limpiarArea : function(){
		var self = this;
		$(self.$el.find("#paste_content")).show();
		$(self.$el.find("#paste_content_message")).hide();
		$(self.$el.find("#paste_content_final_messageOk")).html('');
		$(self.$el.find("#accounts_by_folio")).val('');

	},
	_refresAccount: function(){
		var term = "";
        var options = { limit: null, query: term };
        this.accountsList.context.get("collection").resetPagination();
        this.accountsList.context.resetLoadFlag(false);
        this.accountsList.context.set('skipFetch', false);
        this.accountsList.context.loadData(options);
	},
	_handlerClose: function(){
		if(this.accountsList)
			this.accountsList.dispose();
	},
})