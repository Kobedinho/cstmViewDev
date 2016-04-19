({
	initialize: function(){
		var self = this;
		this._super('initialize', arguments);
		
		var moduleName = 'Accounts';
        self.accountModel = app.data.createBean(moduleName);
        self.renderedStep = 0;
	},
	render: function(){
		this._super('render', arguments);
		var self = this;
		self._showCustomViews();
		$("#configurator_close_drawer").on('click',function(){
			app.once('app:view:change', self.dispose);
    		app.drawer.close();
    	});
    	self._initWizard();
	},
	_initWizard : function (){
		/* Gestion de wizard y forms */
		var self = this; 
		var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn'),
  		allPrevBtn = $('.prevBtn');

		allWells.hide();

		navListItems.click(function (e) {
			e.preventDefault();
			var $target = $($(this).attr('href')),
				$item = $(this);

			if (!$item.hasClass('disabled')) {
				navListItems.removeClass('btn-primary').addClass('btn-default');
				$item.addClass('btn-primary');
				allWells.hide();
				$target.show();
				$target.find('input:eq(0)').focus();
				self._renderViews($target.attr('id'));
			}
		});
		  
		allPrevBtn.click(function(){
			var curStep = $(this).closest(".setup-content"),
				curStepBtn = curStep.attr("id"),
				prevStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().prev().children("a");
				prevStepWizard.removeAttr('disabled').trigger('click');
		});

		allNextBtn.click(function(){
			var curStep = $(this).closest(".setup-content"),
			  curStepBtn = curStep.attr("id"),
			  nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
			  curInputs = curStep.find("input[type='text'],input[type='url']"),
			  isValid = true;

			$(".form-group").removeClass("error");
			for(var i=0; i<curInputs.length; i++){
				if (!curInputs[i].validity.valid){
					isValid = false;
					$(curInputs[i]).closest(".form-group").addClass("error");
				}
			}
			if (isValid)
				nextStepWizard.removeAttr('disabled').trigger('click');

			//self._renderViews(curStepBtn);
		});

		$('div.setup-panel div a.btn-primary').trigger('click');
	},
	_renderViews: function(step){
		var self = this;
		debugger;
		switch(step){
			case 'step-1': if(self.renderedStep<1){ self.accountsView.render(); self.renderedStep=1 } break;
			case 'step-2': if(self.renderedStep<2){ self.usersView.render(); self.renderedStep=2 } break;
			case 'step-3': if(self.renderedStep<3){ self.listasView.render(); self.renderedStep=3 } break;
			case 'step-4': if(self.renderedStep<4){ self.productosView.render(); self.renderedStep=4 } break;
			case 'step-5': if(self.renderedStep<5){ self.regalosView.render(); self.renderedStep=5 } break;
		}
	},
	_showCustomViews: function(){
		var self = this;
		// accounts
		var $accountContent = $(self.$el.find("#view_promotionconf_accounts"));
		self.accountsView = app.view.createView({
			context: self.context,
			name: 'promotionconf-accounts',
			module: 'QS_Promociones',
			model: self.model,
			parentView : self,
		});
		$accountContent.append(self.accountsView.$el);
        //self.accountsView.render();
        // asesores
        var $usersContent = $(self.$el.find("#view_promotionconf_asesores"));
		self.usersView = app.view.createView({
			context: self.context,
			name: 'promotionconf-asesores',
			module: 'QS_Promociones',
			model: self.model,
			parentView : self, 
		});
		$usersContent.append(self.usersView.$el);
        //self.usersView.render();
        // Listas precio
        var $listasContent = $(self.$el.find("#view_promotionconf_listaprecios"));
		self.listasView = app.view.createView({
			context: self.context, //contextCstm,
			name: 'promotionconf-listaprecios',
			module: 'QS_Promociones',
			model: self.model,
			parentView : self,
		});
		$listasContent.append(self.listasView.$el);
        //self.listasView.render();

        // productos
        var $productosContent = $(self.$el.find("#view_promotionconf_productos"));
		self.productosView = app.view.createView({
			context: self.context, //contextCstm,
			name: 'promotionconf-productos',
			module: 'QS_Promociones',
			model: self.model,
			parentView : self,
		});
		//self.layout._components.push(self.productosView);
		$productosContent.append(self.productosView.$el);
        //self.productosView.render();
        // regalos
        var $regalosContent = $(self.$el.find("#view_promotionconf_regalos"));
		self.regalosView = app.view.createView({
			context: self.context, //contextCstm,
			name: 'promotionconf-regalos',
			module: 'QS_Promociones',
			model: self.model,
			parentView : self,
		});
		//self.layout._components.push(self.regalosView);
		$regalosContent.append(self.regalosView.$el);
        //self.regalosView.render();
	},
	// vistas personalizadas
	// record, selection_list
	dispose: function(){
		app.trigger('promotion-configurator::close');
	}
})