/*global enyo, preware */
/*jslint sloppy: true */

enyo.kind({
    name: "preware.PackageDisplay",
    kind: "FittableRows",

    published: {
        currentPackage: {}
    },

    components: [
        {
            kind: "Signals",
            onPackageRefresh: "handlePackageRefresh",
            onBackendSimpleMessage: "processSimpleMessage",
            onPackageProgressMessage: "processProgressMessage",
            onDismissMessages: "hideMessages"
        },
		{name: "openService", kind: "enyo.PalmService", service: "palm://com.palm.applicationManager/", method: "open", onError: "openError"},
        {
            kind: "onyx.Toolbar",
            components: [
                {name: "PackageIcon", kind: "Image", style: "height: 100%; margin-right: 8px;"},
                {name: "PackageTitle", style: "display: inline-block; position: absolute;", content: "Package"}
            ]
        },
        {
            kind: "Scroller",
            classes: "enyo-fill",
            style: "padding: 10px;",
            horizontal: "hidden",
            touch: true,
            fit: true,
            components: [
                {
                    style: "padding: 0px 0px 70px 0px; height: 100%; width: 80%; margin: 0px auto; display: block; color: white",
                    fit: true,
                    components: [
                        {tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Description")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageDescription", allowHtml: true},
                			]},
                		]},
                		{tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Homepage")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageHomepage", allowHtml: true, ontap: "homepageTap"},
                			]},
                		]},
                		{tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Maintainer")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageMaintainer", allowHtml: true, ontap: "maintainerTap"},
                			]},
                		]},
                		{tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Version")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageVersion"},
                			]},
                		]},
                		{tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Last Updated")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageLastUpdated"},
                			]},
                		]},
                		{tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Download Size")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageDownloadSize"},
                			]},
                		]},
                		{name: "PackageInstalledVersionGroupbox", tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Installed Version")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageInstalledVersion"},
                			]},
                		]},
                		{name: "PackageInstalledDateGroupbox", tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Installed")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageInstalledDate"},
                			]},
                		]},
                		{name: "PackageInstalledSizeGroupbox", tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Installed Size")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageInstalledSize"},
                			]},
                		]},
                		{tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("ID")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageID"},
                			]},
                		]},
                		{tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("License")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageLicense"},
                			]},
                		]},
                		{tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Type")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageType"},
                			]},
                		]},
                		{tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Category")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageCategory"},
                			]},
                		]},
                		{tag: "div", classes: "webosstyle-groupbox", components: [
                        	{tag: "div", classes: "webosstyle-groupbox-header", content: $L("Feed")},
                			{tag: "div", classes: "webosstyle-groupbox-body-single", style: "width: 100%", components:[
               					{name: "PackageFeed"},
                			]},
                		]}
                    ]
                }
            ]
        },
        {
            name: "SimpleMessage",
            kind: "Toast",
            style: "height: 90px;",
            components: [
                {
                    name: "SimpleMessageContent",
                    style: "display: block; font-size: 14pt; height: 32px;",
                    allowHtml: true,
                    content: "Message<br>I am a fish."
                },
                {kind: "onyx.Button", style: "display: block; width: 100%; margin-top: 4px;", content: "OK", ontap: "hideSimpleMessage"}
            ]
        },
        {
            name: "ActionMessage",
            kind: "Toast",
            components: [
                {
                    name: "ActionMessageContent",
                    style: "display: block; font-size: 14pt; height: 46px;",
                    allowHtml: true,
                    content: "Message<br>I am a fish."
                },
                {kind: "onyx.Button", style: "display: block; width: 100%; margin-top: 10px;", content: "Button 1", ontap: "hideActionMessage"},
                {kind: "onyx.Button", style: "display: block; width: 100%; margin-top: 10px;",  content: "Button 2", ontap: "hideActionMessage"}
            ]
        },
        {
            name: "ProgressMessage",
            kind: "Toast",
            style: "height: 256px;",
            components: [
                {
                    name: "ProgressMessageContent",
                    style: "display: block; font-size: 14pt; height: 132px; margin-top: 8px;",
                    allowHtml: true,
                    content: "Message<br>I am a fish."
                },
                {kind: "onyx.Spinner", classes: "onyx-light"}
            ]
        },
        {
            kind: "GrabberToolbar",
            //style: "position: absolute; bottom: 0; width: 100%;",
            style: "position: relative;",
            components: [
                {name: "InstallButton", kind: "onyx.Button", showing: false, content: "Install", ontap: "installTapped"},
                {name: "UpdateButton", kind: "onyx.Button", showing: false, content: "Update", ontap: "updateTapped"},
                {name: "RemoveButton", kind: "onyx.Button", showing: false, content: "Remove", ontap: "removeTapped"},
                {name: "LaunchButton", kind: "onyx.Button", showing: false, content: "Launch", ontap: "launchTapped"}
            ]
        }
    ],


    //handlers:
    launchTapped: function () {
        this.currentPackage.launch();
    },
    installTapped: function () {
        this.currentPackage.doInstall();
    },
    updateTapped: function () {
        this.currentPackage.doUpdate();
    },
    removeTapped: function () {
        this.currentPackage.doRemove();
    },
    
    /** Opens every maintainer URL found. Realistically, will there ever be more than one? */
    maintainerTap: function () {
    	var i;
    	for (i=0; i<this.currentPackage.maintainer.length; ++i) {
    		if (this.currentPackage.maintainer[i].url) {
                var mailToTarget = 'mailto:' + this.currentPackage.maintainer[i].url + '?subject=' + this.currentPackage.title;
    			this.$.openService.send({target: mailToTarget});
    		}
    	}
    },
    homepageTap: function () {
		if (this.currentPackage.homepage) {
			this.$.openService.send({target: this.currentPackage.homepage});
		}
    },
    openError: function (inSender, inError) {
    	this.error(inError);
    },
    
    handlePackageRefresh: function () {
        if (this.currentPackage && this.currentPackage.title) {
            this.updateCurrentPackage(this.currentPackage.title);
            this.refreshPackageDisplay();
        }
    },

    //handlers for messages:
    processSimpleMessage: function (inSender, inEvent) {
        this.displaySimpleMessage(inEvent.message.message ? inEvent.message.message : inEvent.message);
    },
    displaySimpleMessage: function (inMessage) {
        this.hideProgressMessage();
        this.hideActionMessage();

        this.$.SimpleMessageContent.setContent(inMessage);
        if (this.$.SimpleMessage.value !== this.$.SimpleMessage.min) {
            this.$.SimpleMessage.animateToMin();
        }
    },
    hideSimpleMessage: function () {
        this.$.SimpleMessage.animateToMax();
    },
    processProgressMessage: function (inSender, inEvent) {
        this.displayProgressMessage(inEvent);
    },
    displayProgressMessage: function (inEvent) {
        this.hideSimpleMessage();
        this.hideActionMessage();

        this.$.ProgressMessageContent.setContent(inEvent.message);
        if (this.$.ProgressMessage.value !== this.$.ProgressMessage.min) {
            this.$.ProgressMessage.animateToMin();
        }
    },
    hideProgressMessage: function () {
        this.$.ProgressMessage.animateToMax();
    },
    displayActionMessage: function (inEvent) {
        this.hideSimpleMessage();
        this.hideProgressMessage();

        this.$.ActionMessageContent.setContent(inEvent.message);
        if (this.$.ActionMessage.value !== this.$.ActionMessage.min) {
            this.$.ActionMessage.animateToMin();
        }
    },
    hideActionMessage: function () {
        this.$.ActionMessage.animateToMax();
    },
    currentPackageChanged: function () {
        this.refreshPackageDisplay();
    },
    hideMessages: function() {
        this.hideSimpleMessage();
        this.hideActionMessage();
        this.hideProgressMessage();    
    },

    //public functions:
    selectPackage: function (title) {
        this.updateCurrentPackage(title);
        this.refreshPackageDisplay();
    },

    //auxillary functions:
    updateCurrentPackage: function (inTitle) {
        var i, pkg;
        for (i = 0; i < preware.PackagesModel.packages.length; i += 1) {
            pkg = preware.PackagesModel.packages[i];
            if (pkg.title === inTitle) {
                this.currentPackage = pkg;
                break;
            }
        }
    },
    refreshPackageDisplay: function () {
		this.$.PackageTitle.setContent(this.currentPackage.title);
        this.$.PackageIcon.setSrc(this.currentPackage.icon);
        this.$.PackageDescription.setContent(this.currentPackage.description);
        this.$.PackageHomepage.setContent(this.currentPackage.homepage);
        
        this.$.PackageMaintainer.setContent(this.currentPackage.maintainer.map(function (currentValue) {
        	return currentValue.url ? currentValue.name + ' (' + currentValue.url + ')': currentValue.name;
        }).join('<br><br>'));
        
        this.$.PackageVersion.setContent(this.currentPackage.version ? this.currentPackage.version : this.currentPackage.Version);
        
        var updateDate = $L("Unknown");
        if (this.currentPackage.date)
        {
            updateDate = new Date(parseInt(this.currentPackage.date + "000")).toDateString();
        }
        else if (this.currentPackage.Source && this.currentPackage.Source !== "")
        {
            updateDate = new Date(parseInt(JSON.parse(this.currentPackage.Source).LastUpdated + "000")).toDateString();
        }
        this.$.PackageLastUpdated.setContent(updateDate);
        this.$.PackageDownloadSize.setContent(this.humanFileSize(this.currentPackage.size, true));
        
        if (this.currentPackage.versionInstalled != undefined)
        {
        	this.$.PackageInstalledVersionGroupbox.show();
			this.$.PackageInstalledVersion.setContent(this.currentPackage.versionInstalled);
        }
        else
        {
           	this.$.PackageInstalledVersionGroupbox.hide();
        }
        
        if (this.currentPackage.dateInstalled)
        {
        	this.$.PackageInstalledDateGroupbox.show();
			this.$.PackageInstalledDate.setContent(new Date(parseInt(this.currentPackage.dateInstalled + "000")).toDateString());
        }
        else
        {
        	this.$.PackageInstalledDateGroupbox.hide();
        }
        
        if (this.currentPackage.sizeInstalled)
        {
           	this.$.PackageInstalledSizeGroupbox.show();
			this.$.PackageInstalledSize.setContent(this.humanFileSize(this.currentPackage.sizeInstalled * 1000, true));
        }
        else
        {
       		this.$.PackageInstalledSizeGroupbox.hide();
        }
        
        
        this.$.PackageID.setContent(this.currentPackage.pkg);
        this.$.PackageLicense.setContent(this.currentPackage.license);
        this.$.PackageType.setContent(this.currentPackage.type);
        this.$.PackageCategory.setContent(this.currentPackage.category);
        this.$.PackageFeed.setContent(this.currentPackage.feedString);

		this.buttonManger();
    },
    
    buttonManger: function() {
    	if ( this.currentPackage.isInstalled === true){
    		this.$.InstallButton.hide();
    		this.$.UpdateButton.hide();
       		this.$.RemoveButton.show();
			this.$.LaunchButton.show();
    	}else{
    		this.$.InstallButton.show();
    		this.$.UpdateButton.hide();
    		this.$.RemoveButton.hide();
			this.$.LaunchButton.hide();
    	}
    	
    	if(this.currentPackage.hasUpdate){
    		this.$.UpdateButton.show();
    	}
    },
    
    humanFileSize: function(bytes, si) {
    	var thresh = si ? 1000 : 1024;
    	if(bytes < thresh) return bytes + ' B';
    	var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    	var u = -1;
    	do {
        	bytes /= thresh;
        	++u;
    	} while(bytes >= thresh);
    	return bytes.toFixed(1)+' '+units[u];
	},
});
