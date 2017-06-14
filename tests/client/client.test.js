import test from 'ava'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
import * as sinon from 'sinon'

import './helpers/setup-dom'
import App from '../../client/components/App'

test('faking passing test', t=>{
  t.pass()

test("testing that I can use Sinon", function (){
  var callback = sinon.stub().returns(215)
  var proxy = once(callback)

  assert.equals(proxy(), 215)
