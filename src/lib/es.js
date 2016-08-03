/*
  * Licensed Materials - Property of IBM
  * (C) Copyright IBM Corp. 2016. All Rights Reserved.
  * US Government Users Restricted Rights - Use, duplication or
  * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
  */
'use strict';

const elasticsearch = require('elasticsearch');
const url = require('url');
const env = require('./env');

let esHost;
let esClient;

const AUDIT_ENDPOINT = env.endpoint;

const groupId = process.env.group_id || 'DEFAULT_GROUP';

module.exports = {
	getClient: function(robot) {
		if (!esClient) {
			// Pull elastic search endpoint from environment variable
			esHost = AUDIT_ENDPOINT;
			if (esHost) {
				const esUrl = url.parse(esHost);
				esClient = new elasticsearch.Client({
					maxSockets: 1000,
					requestTimeout: 60000,
					host: {
						protocol: 'https',
						host: esUrl.hostname,
						port: 443,
						headers: {
							'X-HUBOT-AUTH-TOKEN': groupId
						}
					}
				});
			}
			else {
				if (robot) robot.logger.warning('Unable to capture usage information because HUBOT_AUDIT_ENDPOINT environment variable is not set.');
			}
		}
		return esClient;
	},

	clearClient: function() {
		esClient = undefined;
	}
};

// --------------------------------------------------------------
// i18n (internationalization)
// It will read from a peer messages.json file.  Later, these
// messages can be referenced throughout the module.
// --------------------------------------------------------------
const i18n = require('i18n');
i18n.configure({
	// Add more languages to the list of locales when the files are created.
	directory: __dirname + '/../messages',
	defaultLocale: 'en',
	// Prevent messages file from being overwritten in error conditions (like poor JSON).
	updateFiles: false
});
// At some point we need to toggle this setting based on some user input.
i18n.setLocale('en');
