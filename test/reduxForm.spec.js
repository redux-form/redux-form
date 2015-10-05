import expect from 'expect';
import jsdom from 'mocha-jsdom';
import React, {Component, PropTypes, Children} from 'react';
import TestUtils from 'react-addons-test-utils';

describe('reduxForm', () => {
  jsdom();

  it('should create untouch action', () => {
    expect(untouch('foo', 'bar')).toEqual({
      type: UNTOUCH,
      fields: ['foo', 'bar']
    });
    expect(untouch('cat', 'dog', 'pig')).toEqual({
      type: UNTOUCH,
      fields: ['cat', 'dog', 'pig']
    });
  });

});
