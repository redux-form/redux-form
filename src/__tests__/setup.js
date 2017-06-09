import { JSDOM } from 'jsdom'

global.window = new JSDOM('<!doctype html><html><body></body></html>').window
global.document = global.window.document
global.navigator = global.window.navigator
