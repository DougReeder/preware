function PreferencesAssistant()
{
	// setup default preferences in the prefCookie.js model
	this.cookie = new prefCookie();
	this.prefs = this.cookie.get();
	
	// for secret group
	this.secretString = '';
	this.secretAnswer = 'iknowwhatimdoing';
}

PreferencesAssistant.prototype.setup = function()
{
	try
	{
		// setup handlers for preferences
		this.toggleChangeHandler = this.toggleChanged.bindAsEventListener(this)
		this.listChangedHandler  = this.listChanged.bindAsEventListener(this)
		
		
		// Startup Group
		this.controller.setupWidget
		(
			'updateInterval',
			{
				label: 'Update Feeds',
				choices:
				[
					{label:'Every Launch',	value:'launch'},
					{label:'Once Daily',	value:'daily'},
					{label:'Manually Only',	value:'manual'}
				],
				modelProperty: 'updateInterval'
			},
			this.prefs
		);
		if (this.prefs.lastUpdate) 
		{
			this.controller.get('lastUpdate').innerHTML = formatDate(this.prefs.lastUpdate);
		}
		
		this.controller.listen('updateInterval', Mojo.Event.propertyChange, this.listChangedHandler);
		
		
		
		// Main Scene Group
		this.controller.setupWidget
		(
			'showAllTypes',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'showAllTypes'
			},
			{
				value : this.prefs.showAllTypes,
	 			disabled: false
			}
		);
		
		this.controller.listen('showAllTypes', Mojo.Event.propertyChange, this.toggleChangeHandler);
		
		
		
		// List Scene Group
		this.controller.setupWidget
		(
			'listSort',
			{
				label: 'Default Sort',
				choices:
				[
					{label:'Category Default',	value:'default'},
					{label:'Alphabetically',	value:'alpha'},
					{label:'Last Updated',		value:'date'}
				],
				modelProperty: 'listSort'
			},
			this.prefs
		);
		this.controller.setupWidget
		(
			'listInstalled',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'listInstalled'
			},
			{
				value : this.prefs.listInstalled,
	 			disabled: false
			}
		);
		
		this.controller.listen('listSort', Mojo.Event.propertyChange, this.listChangedHandler);
		this.controller.listen('listInstalled', Mojo.Event.propertyChange, this.toggleChangeHandler);
		
		
		
		// Background Group
		this.controller.setupWidget
		(
			'backgroundUpdates',
			{
				label: 'Check Updates',
				choices:
				[
					{label:'Disabled',	value:'disabled'}
				],
				modelProperty: 'backgroundUpdates'
			},
			//this.prefs
			{
				backgroundUpdates: 'disabled',
        		disabled: true
			}
		);
		this.controller.setupWidget
		(
			'autoInstallUpdates',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'autoInstallUpdates'
			},
			{
				value : this.prefs.autoInstallUpdates,
	 			disabled: true
			}
		);
		
		this.controller.listen('backgroundUpdates',  Mojo.Event.propertyChange, this.listChangedHandler);
		this.controller.listen('autoInstallUpdates', Mojo.Event.propertyChange, this.toggleChangeHandler);
		
		
		
		// Secret Group
		this.keyPressHandler = this.keyPress.bindAsEventListener(this)
		Mojo.Event.listen(this.controller.sceneElement, Mojo.Event.keypress, this.keyPressHandler);
		
		this.controller.setupWidget
		(
			'allowServiceUpdates',
			{
	  			trueLabel:  'Yes',
	 			falseLabel: 'No',
	  			fieldName:  'allowServiceUpdates'
			},
			{
				value : this.prefs.allowServiceUpdates,
	 			disabled: false
			}
		);
		
		this.controller.listen('allowServiceUpdates', Mojo.Event.propertyChange, this.toggleChangeHandler);
		
		// hide secret group
		this.controller.get('secretPreferences').style.display = 'none';
		
		
		
		// setup menu that is no menu
		this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, { visible: false });
		
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'preferences#setup');
	}

}

PreferencesAssistant.prototype.listChanged = function(event)
{
	this.cookie.put(this.prefs);
}

PreferencesAssistant.prototype.toggleChanged = function(event)
{
	this.prefs[event.target.id] = event.value;
	this.cookie.put(this.prefs);
}

PreferencesAssistant.prototype.keyPress = function(event)
{
	this.secretString += String.fromCharCode(event.originalEvent.charCode);
	
	if (event.originalEvent.charCode == 8)
	{
		this.secretString = '';
	}
	
	if (this.secretString.length == this.secretAnswer.length)
	{
		if (this.secretString === this.secretAnswer)
		{
			// show settings
			this.controller.get('secretPreferences').style.display = '';
			this.controller.getSceneScroller().mojo.revealElement(this.controller.get('secretPreferences'));
			this.secretString = '';
		}
	}
	else if (this.secretString.length > this.secretAnswer.length)
	{
		this.secretString = '';
	}
}

PreferencesAssistant.prototype.activate = function(event) {}

PreferencesAssistant.prototype.deactivate = function(event)
{
	// reload global storage of preferences when we get rid of this stage
	var tmp = prefs.get(true);
}

PreferencesAssistant.prototype.cleanup = function(event) {}