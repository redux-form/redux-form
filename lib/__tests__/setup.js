'use strict';

var _jsdom = require('jsdom');

global.document = (0, _jsdom.jsdom)('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
global.File = global.window.File;