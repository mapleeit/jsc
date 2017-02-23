'use strict';

App({
	onLaunch: function() {
		console.log('App Launch');
		this.global.Promise = require('common/promise.js');
		this.global.mta = require('common/mta_analysis.js');
		this.global.mta.initLaunch();
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	global: {
		navData: {}
	}
});