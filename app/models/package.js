/* *** Info ***
 * Size:			  package size in kb
 * Status:      	  installed/not-installed, and other stuff we don't use
 * Architecture:	  
 * Section:			  the category when there is no source data
 * Package:			  package name in reverse-dns style
 * Filename:		  of the ipk file
 * Depends:			  package name of packages required for this (comma-space seperated ignore anything inside () at the end)
 * Maintainer:		 
 * Version:			  x.y.z or w.x.y.z
 * Description:		  title of the package
 * MD5Sum:			  md5sub of package to verify downloaded file
 * Installed-Time:	  timestamp of installation
 * Installed-Size:	  size of installed package
 * Source:
 *   Title:			  actual title of the package
 *   Source:		  where to get the source code
 *   LastUpdated:	  timestamp
 *   Feed:			  that this package comes from
 *   Type:			  Application, Service, Plugin, Patch
 *   Category:		 
 *   Homepage:		  url 
 *   Icon:			  url to image (assumed to be 64x64)
 *   FullDescription: actual description of package (includes html?)
 *   Screenshots:	  array of urls
 */


// initialize function which loads all the data from the info object
function packageModel(info)
{
	try
	{
		// save the info sent to us
		this.info = info;
		
		// load up some default items incase the package has no sourceObj (like installed applications not in any feeds)
		this.pkg =		   this.info.Package;
		this.type =		   'Unknown';
		this.category =	   this.info.Section;
		this.version =	   this.info.Version;
		this.maintainer =  this.info.Maintainer;
		this.title =	   this.info.Description;
		this.size =		   this.info.Size;
		this.hasUpdate =   false;
		this.icon =		   false;
		this.date =		   false;
		this.feeds =	   ['Unknown'];
		this.feedString =  'Unknown';
		this.homepage =	   false;
		this.description = false;
		this.screenshots = [];
		this.depends =	   [];
		this.flags =	   {install: {RestartLuna:false, RestartJava:false},
							remove: {RestartLuna:false, RestartJava:false}};
		
		if ((this.info.Status.include('not-installed') && this.info.Status != '') || this.info.Status == '')
		{
			this.isInstalled =   false;
			this.dateInstalled = false;
			this.sizeInstalled = false;
			//this.versionInstalled = false;
		}
		else
		{
			this.isInstalled =   true;
			this.dateInstalled = this.info['Installed-Time'];
			this.sizeInstalled = this.info['Installed-Size'];
			//this.versionInstalled = this.version;
		}
		this.versionInstalled = false;
		
		if (this.info.Depends)
		{
			//alert(this.info.Depends);
			var dSplit = this.info.Depends.split(',');
			for (var d = 0; d < dSplit.length; d++)
			{
				//var r = new RegExp(/(.*)\((.*)\)/); // this regex sucks
				var r = new RegExp("^([^\(]*)[\s]*[\(]?([^0-9]*)[\s]*([0-9.]*)[\)]?"); // this one is win
				var match = dSplit[d].match(r);
				if (match)
				{
					//for(var m = 0; m < match.length; m++) alert(m + ' [' + match[m] + ']');
					if (match[2]) match[2] = trim(match[2]); else match[2] = false;
					if (match[3]) match[3] = trim(match[3]); else match[3] = false;
					
					this.depends.push({pkg: trim(match[1]), match: match[2], version: match[3]});
				}
			}
		}
		
		// check if Source is json object
		// basically, if it has a { in it, we'll assume its json data
		if (this.info.Source && this.info.Source.include('{')) 
		{
			// parse json to object
			this.sourceJson = JSON.parse(this.info.Source);

			// check if the object has data we can load or overwrite the defaults with
			if (this.sourceJson.Type)			 this.type =		 this.sourceJson.Type;
			if (this.sourceJson.Category)		 this.category =	 this.sourceJson.Category;
			if (this.sourceJson.Title)			 this.title =		 this.sourceJson.Title;
			if (this.sourceJson.Icon)			 this.icon =		 this.sourceJson.Icon;
			if (this.sourceJson.LastUpdated)	 this.date =		 this.sourceJson.LastUpdated;
			if (this.sourceJson.Homepage)		 this.homepage =	 this.sourceJson.Homepage;
			if (this.sourceJson.FullDescription) this.description =	 this.sourceJson.FullDescription;
			if (this.sourceJson.Screenshots)	 this.screenshots =	 this.sourceJson.Screenshots;
			
			if (this.sourceJson.Feed) 
			{
				this.feeds = [this.sourceJson.Feed];
				this.feedString = this.sourceJson.Feed;
			}
			
			if (this.sourceJson.PostInstallFlags) 
			{
				//alert('PostInstallFlags: ' + this.sourceJson.PostInstallFlags);
				if (this.sourceJson.PostInstallFlags.include('RestartLuna')) this.flags.install.RestartLuna = true;
				if (this.sourceJson.PostInstallFlags.include('RestartJava')) this.flags.install.RestartJava = true;
			}
			if (this.sourceJson.PostRemoveFlags) 
			{
				//alert('PostRemoveFlags: ' + this.sourceJson.PostRemoveFlags);
				if (this.sourceJson.PostRemoveFlags.include('RestartLuna')) this.flags.remove.RestartLuna = true;
				if (this.sourceJson.PostRemoveFlags.include('RestartJava')) this.flags.remove.RestartJava = true;
			}
			
		}
		
		// check up on what we've loaded to make sure it makes sense
		if (!this.category || this.category == 'misc')
		{
			this.category = 'Unsorted';
		}
		if (!this.type || this.type == 'Unknown')
		{
			this.type = 'Application';
		}
		
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'packageModel#initialize');
	}
}

// this function is called when loading info and it finds another package
// its for updating the current package with new info if we should
packageModel.prototype.infoUpdate = function(newPackage)
{
	try
	{
		// check if its newer
		var newer = packages.versionNewer(this.version, newPackage.version);
		
		
		if (!newPackage.isInstalled && !this.isInstalled && newer)
		{
			//alert(1);
			newPackage.infoLoadMissing(this);
			return newPackage;
		}
		
		if (newPackage.isInstalled && !this.isInstalled && !newer)
		{
			//alert(2);
			this.isInstalled = true;
			this.hasUpdate = true;
			this.versionInstalled = newPackage.version;
			this.infoLoadMissing(newPackage);
			return false;
		}
		
		
		if (!newPackage.isInstalled && this.isInstalled && !newer)
		{
			//alert(3);
			this.isInstalled = true;
			this.hasUpdate = false;
			this.versionInstalled = newPackage.version;
			this.infoLoadMissing(newPackage);
			return false;
		}
		
		if (newPackage.isInstalled && !this.isInstalled && newer)
		{
			//alert(4);
			newPackage.isInstalled = true;
			newPackage.hasUpdate = false;
			newPackage.versionInstalled = this.version;
			newPackage.infoLoadMissing(this);
			return newPackage;
		}
		
		if (!newPackage.isInstalled && this.isInstalled && newer)
		{
			//alert(5);
			newPackage.isInstalled = true;
			newPackage.hasUpdate = true;
			newPackage.versionInstalled = this.version;
			newPackage.infoLoadMissing(this);
			return newPackage;
		}
		
		//alert(6);
		this.infoLoadMissing(newPackage);
		return false;
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'packageModel#infoUpdate');
		return false;
	}
}

// this function tries to load missing info in this package from the new one
packageModel.prototype.infoLoadMissing = function(pkg)
{
	try
	{
		if (this.type == 'Unknown' || this.type == 'Application') this.type = pkg.type;
		if (this.category == 'Unsorted') this.category =		pkg.category;
		if (!this.maintainer)			 this.maintainer =		pkg.Maintainer;
		if (!this.title)				 this.title =			pkg.title;
		if (!this.size)					 this.size =			pkg.size;
		if (!this.icon)					 this.icon =			pkg.icon;
		if (!this.date)					 this.date =			pkg.date;
		if (!this.homepage)				 this.homepage =		pkg.homepage;
		if (!this.description)			 this.description =		pkg.description;
		if (!this.isInstalled)			 this.isInstalled =		pkg.isInstalled;
		if (!this.dateInstalled)		 this.dateInstalled =	pkg.dateInstalled;
		if (!this.sizeInstalled)		 this.sizeInstalled =	pkg.sizeInstalled;
		
		// join feeds
		if (this.feeds[0] == 'Unknown') 
		{
			this.feeds = pkg.feeds;
			this.feedString = pkg.feedString;
		}
		else if (pkg.feeds[0] != 'Unknown')
		{
			for (var f = 0; f < pkg.feeds.length; f++) 
			{
				if (!this.inFeed(pkg.feeds[f])) 
				{
					this.feeds.push(pkg.feeds[f]);
					this.feedString += ', ' + pkg.feeds[f];
				}
			}
		}
		
		// join deps
		if (this.depends.length == 0 && pkg.depends.length > 0) 
		{
			this.depends = pkg.depends;
		}
		else if (this.depends.length > 0 && pkg.depends.length > 0) 
		{
			for (var pd = 0; pd < pkg.depends.length; pd++) 
			{
				var depFound = false;
				for (var td = 0; td < this.depends.length; td++) 
				{
					if (pkg.depends[pd].pkg == this.depends[td].pkg)
					{
						depFound = true;
					}
				}
				
				if (!depFound) 
				{
					this.depends.push(pkg.depends[pd]);
				}
			}
		}
		
		// join screenshots
		if (this.screenshots.length == 0 && pkg.screenshots.length > 0)
		{
			this.screenshots = pkg.screenshots;
		}
		else if (this.screenshots.length > 0 && pkg.screenshots.length > 0)
		{
			for (var ps = 0; ps < pkg.screenshots.length; ps++) 
			{
				var ssFound = false;
				for (var ts = 0; ts < this.screenshots.length; ts++) 
				{
					if (pkg.screenshots[ps] == this.screenshots[ts])
					{
						ssFound = true;
					}
				}
				if (!ssFound)
				{
					this.screenshots.push(pkg.screenshots[ps]);
				}
			}
		}
		
		// get flags
		if (!this.flags.install.RestartLuna && pkg.flags.install.RestartLuna) this.flags.install.RestartLuna = true;
		if (!this.flags.install.RestartJava && pkg.flags.install.RestartJava) this.flags.install.RestartJava = true;
		if (!this.flags.remove.RestartLuna  && pkg.flags.remove.RestartLuna)  this.flags.remove.RestartLuna  = true;
		if (!this.flags.remove.RestartJava  && pkg.flags.remove.RestartJava)  this.flags.remove.RestartJava  = true;
		
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'packageModel#infoLoadMissing');
	}
}

// checks if this package is in the feed
packageModel.prototype.inFeed = function(feed)
{
	for (var f = 0; f < this.feeds.length; f++)
	{
		if (this.feeds[f] == feed)
		{
			return true;
		}
	}
	return false;
}

// this function will return an object ready for inclusion in the list widget
packageModel.prototype.getForList = function(item)
{
	var listObj = {};
	
	try
	{
		listObj.title = this.title;
		listObj.date = this.date;
		listObj.pkg = this.pkg;
		
		listObj.pkgNum = packages.packageInList(this.pkg);
		
		listObj.rowClass = '';
		
		if (this.icon)
		{
			listObj.rowClass += ' img';
			listObj.icon = '<img src="' + this.icon + '" />';
		}
		
		if (item) 
		{
			if (this.isInstalled && !this.hasUpdate &&
				item.pkgValue != 'updates' &&
				item.pkgValue != 'installed')
			{
				listObj.rowClass += ' installed';
			}
			if (this.hasUpdate && item.pkgValue != 'updates')
			{
				listObj.rowClass += ' update';
			}
		}
		else
		{
			if (this.isInstalled && !this.hasUpdate)
			{
				listObj.rowClass += ' installed';
			}
			if (this.hasUpdate)
			{
				listObj.rowClass += ' update';
			}
		}
	}
	catch (e)
	{
		Mojo.Log.logException(e, 'packageModel#getForList');
	}
	
	return listObj;
}

// this function will return a list of packages this package depends on (in the form of a list of indexes from the packages list)
packageModel.prototype.getDependencies = function(justNeeded)
{
	var returnArray = [];
	
	if (this.depends.length > 0)
	{
		for (var d = 0; d < this.depends.length; d++)
		{
			
			if (packages.packages.length > 0) 
			{
				for (var p = 0; p < packages.packages.length; p++) 
				{
					if (packages.packages[p].pkg == this.depends[d].pkg) 
					{
						//alert(packages.packages[p].title);
						//for (var t in this.depends[d]) alert(t + ': ' + this.depends[d][t]);
						
						if (!justNeeded) 
						{
							returnArray.push(p);
						}
						// if we want just whats needed, check the version numbers etc
						else
						{
							if (packages.packages[p].isInstalled)
							{
								// if it doesn't have dependent version information, being installed is all we need
								if (this.depends[d].match && this.depends[d].version) 
								{
									// if it doesn't have an update, we'll just assume the installed version is ok because its all they're going to get
									if (packages.packages[p].hasUpdate)
									{
										// there really should always be an installed version number if there is an update...
										if (packages.packages[p].versionInstalled) 
										{
											// first we check against the installed version
											// eval seems like the best way to do these tests? (in simple tests while writing this, it seemed to work)
											eval('var versionTest = (packages.packages[p].versionInstalled ' + this.depends[d].match + ' this.depends[d].version);');
											if (!versionTest) 
											{
												// if the installed version didn't pass the thest, check the update version
												eval('var versionTest = (packages.packages[p].version ' + this.depends[d].match + ' this.depends[d].version);');
												if (versionTest) 
												{
													// if the update passes the test, this package is "needed"
													returnArray.push(p);
												}
											}
										}
										// really, this shouldn't happen... but if it does, this will test against the "version" field
										else
										{
											eval('var versionTest = (packages.packages[p].version ' + this.depends[d].match + ' this.depends[d].version);');
											if (versionTest) 
											{
												returnArray.push(p);
											}
										}
									}
								}
							}
							// if its not installed then we'll assume we need it nomatter what
							else
							{
								returnArray.push(p);
							}
						}
					}
				}
			}
			
		}
	}
	
	return returnArray;
}

// this function will return a list of packages dependent on the current package (in the form of a list of indexes from the packages list)
packageModel.prototype.getDependent = function()
{
	var returnArray = [];
	
	if (packages.packages.length > 0)
	{
		for (var p = 0; p < packages.packages.length; p++)
		{
			
			// this is for real
			if (packages.packages[p].depends.length > 0)
			{
				for (var d = 0; d < packages.packages[p].depends.length; d++)
				{
					if (packages.packages[p].depends[d].pkg == this.pkg)
					{
						//alert(packages.packages[p].title);
						returnArray.push(p);
					}
				}
			}
			
			// this is for testing
			/*
			if (packages.packages[p].pkg == 'ws.junk.blocked')
			{
				returnArray.push(p);
			}
			if (p > 150 && p <= 155)
			{
				returnArray.push(p);
			}
			*/
			
		}
	}
	
	return returnArray;
}
