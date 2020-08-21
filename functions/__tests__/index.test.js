// Copyright 2020, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const chai = require('chai');
const {expect} = chai;

const functionHandler = require('../index.js');
const {FUNCTION_NAME, FUNCTION_VERSION} = require('../config.js');

describe('index', function() {
  it('exports function name with current version from config', function() {
    expect(functionHandler).to.have.ownProperty(`${FUNCTION_NAME}_${FUNCTION_VERSION}`);
  });
});
