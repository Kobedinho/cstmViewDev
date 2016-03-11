({
	initialize: function(options){
		this._super('initialize', arguments);
		var self = this;
		self.context = options.context;
		self._model = options.model;
		self.allUsers = true;
		// event to dispose this view
		app.once('promotion-configurator::close', _.bind(this._handlerClose, this))
	},
	_renderHtml: function(){
		this._super('_renderHtml', arguments);
		var self = this;
		// init events 
		var btnShowCatalogUsers = $(self.$el.find(".show_user_list"));
		var chkUserFilter = $(self.$el.find("#user_filter_todos"));
		var pasteArea = $(self.$el.find("#users_by_identifier"));
		var cleanBtn = $(self.$el.find("#paste_content_clearbtn"));
		chkUserFilter.on('change',function(hdl){
			if(self.allUsers){
				var msg = "La promoción esta configurada para que aplique a todas los usuarios, si desea puede modificar este valor editando la promoción... ";
				app.alert.show('notifica_usuarios_promo', { level: 'info', messages: msg, title: 'INFO: ',autoClose: true, autoCloseDelay: 15000,});
				chkUserFilter.val(true);
				chkUserFilter.attr('checked', true);
			}
			else{
				self._changeFilterVisibility(this,'user_select_content');
			}
		});
		btnShowCatalogUsers.on('click',function(hdl){
			self._showUsersDrawer();
		});
		if(!self.model.get('todos_usuario_c')){
			self.allUsers = false;
			chkUserFilter.val(false);
			chkUserFilter.attr('checked', false);
			chkUserFilter.trigger('change');
			$(self.$el.find('#user_folios_content')).show();
			$(self.$el.find('#selected_users_list')).show();
			// permitiendo que se elijan cuentas
			self.usersCollection = self._model.getRelatedCollection('qs_promociones_users');//('qs_promociones_users');
			self.usersCollection.fetch({relate: true,
	    		success: function(records) {
		    		self._showUsersTable(self.usersCollection);
				},
				error: function (obj){
					console.log("Error : "+obj);
				}
			});
		}
		else{
			// alertando al usuario que puede pasar al siguiente paso porque la promocion aplica para todas las cuentas
			var msg = "Puedes continuar con el paso siguiente ya que la promoción aplica para todas las cuentas... ";
			app.alert.show('notifica_usuario_promo', { level: 'info', messages: msg, title: 'INFO: ',autoClose: true, autoCloseDelay: 15000,});
			self.allUsers = true;
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
	_showUsersDrawer: function(){
		var self = this;
    	app.drawer.open({
          	layout: 'selection-list',
            context: {
            	module: 'Users',
            	recLink: 'qs_promociones_users',
            	recContext: app.controller.context,
            	recParentModel: self._model,
            	recParentModule: self.module,
            	recView: self,
            },
        });
	},
	_showUsersTable: function(){
		var self = this;
		var $usersContent = $(self.$el.find('#selected_users_list'));
		var contextCstm = this.context.getChildContext({
			module: 'Accounts',
			forceNew: false,
			create: false,
			link:'qs_promociones_users', //relationship name
		});
		contextCstm.prepare();
		self.usersList = app.view.createLayout({
			context:contextCstm,
			name: 'list',
			module: contextCstm.module,
		});
		$usersContent.html(self.usersList.$el);
        self.usersList.render();
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
		self.users = [];
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
			    		self.users.push({
			    			user_name: cells[x],
			    		});
			    	}
			    	countCells++;
			    }
			}
			var msg = "Folios encontrados : "+count;
			var $cstMsg = $(self.$el.find("#paste_content_cstmsg"));
			$cstMsg.append(msg);
			self._validateUsers();
		}
		else{
			$("#paste_content").show();
			$("#paste_content_message").hide();
		}
	},
	_validateUsers: function () {
		var self = this;
		var dataRequest = {
            requests:[]
        };
		_.each(self.users, function (userData) {
        	var filter = {filter:[{folio_qs_c: userData.folio_qs}]};
            dataRequest.requests.push({ method: "GET", url: "/v10/Users/filter?" + $.param(filter),});
        });
        var callbacks = { 
            success: _.bind(function (responses) {
            	var invalidCounter = 0;
            	var validCounter = 0;
            	var validUsers = [];
            	_.each(responses, _.bind(function (response, index) {
            		if(response.contents && response.contents.records.length){
            			validUsers.push(response.contents.records[0]);
            			validCounter++;
            		}
            		else{
            			invalidCounter++;
            		}

            	}, self));
        		if(invalidCounter){
        			var msg = "Folios incorrectos : "+invalidCounter;
        			app.alert.show('valida_Users_error', { level: 'error', messages: msg, title: 'FolioQS',});
					//var $cstMsgFail = $(self.$el.find("#paste_content_final_messageFail"));
					//$cstMsgFail.html(msg);
        		}
        		if(validCounter){
        			var msg = "Folios relacionados correctamente : "+validCounter;
        			app.alert.show('valida_Users_ok', { level: 'success', messages: msg, title: 'FolioQS',});
					//var $cstMsgOk = $(self.$el.find("#paste_content_final_messageOk"));
					//$cstMsgOk.html(msg);
        			self._relacionaUsuarios(validUsers);
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
	_relacionaUsuarios: function(users){
		var self = this;
		var idsList = [];
		if (users.length) {
			_.each(users,_.bind(function(user, index){
				idsList.push(user.id);
			},self));
			debugger;
			if(idsList.length){
				var dataRequest = {link_name : 'qs_promociones_users',ids:idsList};
				var linkUsers = app.api.call('create', '/rest/v10/QS_Promociones/'+self.model.get('id')+'/link', dataRequest );
				linkUsers.xhr.done(function(data){
					console.log('registros relacionados');
					app.alert.show('link_users', { 
						level: 'success', 
						messages: 'Se han relacionado '+users.length+' registros ', 
						title: 'Link',
					});
				});
			}
		}
	},
	_limpiarArea : function(){
		var self = this;
		$(self.$el.find("#paste_content")).show();
		$(self.$el.find("#paste_content_message")).hide();
		$(self.$el.find("#paste_content_final_messageOk")).html('');
		$(self.$el.find("#users_by_identifier")).val('');

	},
	_handlerClose: function(){
		//this.usersList.dispose();
	},
})