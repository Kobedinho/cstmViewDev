({
	initialize: function(){
		var self = this;
		this._super('initialize', arguments);
		
		var moduleName = 'Accounts';
        self.accountModel = app.data.createBean(moduleName);

		//Handlebars.registerPartial('account_filter', app.template.get('promotion-configurator.account_filter.QS_Promociones'));
		Handlebars.registerPartial('promotion-configurator.user_filter', app.template.get('promotion-configurator.user_filter.QS_Promociones'));
		Handlebars.registerPartial('promotion-configurator.products_filter', app.template.get('promotion-configurator.products_filter.QS_Promociones'));
		Handlebars.registerPartial('promotion-configurator.regalos_filter', app.template.get('promotion-configurator.regalos_filter.QS_Promociones'));
	},
	render: function(){
		this._super('render', arguments);
		var self = this;
		self._initWizard();
		self._showCustomViews();
		$("#configurator_close_drawer").on('click',function(){
			app.once('app:view:change', self.dispose);
    		app.drawer.close();
    	});
	},
	_initWizard : function (){
		/* Gestion de wizard y forms */
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
		});

		$('div.setup-panel div a.btn-primary').trigger('click');
	},
	_showCustomViews: function(){
		var self = this;
		// accounts
		var $accountContent = $("#view_promotionconf_accounts");
		self.accountsView = app.view.createView({
			context: self.context, //contextCstm,
			name: 'promotionconf-accounts',
			module: 'QS_Promociones',
			model: self.model,
		});
		$accountContent.append(self.accountsView.$el);
        self.accountsView.render();
        // asesores
        var $usersContent = $("#view_promotionconf_asesores");
		self.usersView = app.view.createView({
			context: self.context, //contextCstm,
			name: 'promotionconf-asesores',
			module: 'QS_Promociones',
			model: self.model,
		});
		$usersContent.append(self.usersView.$el);
        self.usersView.render();
        // Listas precio
        var $listasContent = $("#view_promotionconf_listaprecios");
		self.listasView = app.view.createView({
			context: self.context, //contextCstm,
			name: 'promotionconf-listaprecios',
			module: 'QS_Promociones',
			model: self.model,
		});
		$listasContent.append(self.listasView.$el);
        self.listasView.render();

        // productos
        var $productosContent = $("#view_promotionconf_productos");
		self.productosView = app.view.createView({
			context: self.context, //contextCstm,
			name: 'promotionconf-productos',
			module: 'QS_Promociones',
			model: self.model,

		});
		//self.layout._components.push(self.productosView);
		$productosContent.append(self.productosView.$el);
        self.productosView.render();
        // regalos
        var $regalosContent = $("#view_promotionconf_regalos");
		self.regalosView = app.view.createView({
			context: self.context, //contextCstm,
			name: 'promotionconf-regalos',
			module: 'QS_Promociones',
			model: self.model,

		});
		//self.layout._components.push(self.regalosView);
		$regalosContent.append(self.regalosView.$el);
        self.regalosView.render();
	},
	// vistas personalizadas
	// record, selection_list
	dispose: function(){
		app.trigger('promotion-configurator::close');
	}
})