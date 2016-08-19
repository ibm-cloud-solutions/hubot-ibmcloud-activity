// Description:
//	Middleware that waits for the bluemix service instance to be initialized before accepting requests
//
// Configuration:
//
// Commands:
//
//
// Author:
//	@nbarker
//  @nsandona
//

/*
  * Licensed Materials - Property of IBM
  * (C) Copyright IBM Corp. 2016. All Rights Reserved.
  * US Government Users Restricted Rights - Use, duplication or
  * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
  */
'use strict';

const path = require('path');
const consumer = require(path.resolve(__dirname, '..', 'lib', 'activity.consumer'));

module.exports = (robot) => {
	robot.receiveMiddleware((context, next, done) => {
		if (consumer.auditDisabled(robot) || consumer.getClient()){
			next(done);
		}
		else {
			consumer.init(robot).then(() => {
				next(done);
			}, (err) => {
				throw err;
			});
		}
	});
};

// --------------------------------------------------------------
// i18n (internationalization)
// It will read from a peer messages.json file.  Later, these
// messages can be referenced throughout the module.
// --------------------------------------------------------------
var i18n = new (require('i18n-2'))({
	locales: ['en'],
	extension: '.json',
	// Add more languages to the list of locales when the files are created.
	directory: __dirname + '/../messages',
	defaultLocale: 'en',
	// Prevent messages file from being overwritten in error conditions (like poor JSON).
	updateFiles: false
});
// At some point we need to toggle this setting based on some user input.
i18n.setLocale('en');
