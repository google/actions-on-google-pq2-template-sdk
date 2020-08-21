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

/**
 * Interactive Canvas response template slide types.
 * @readonly
 */
const Template = {
  /** Question and answer slide */
  QUESTION: 'template.question',
  /** Intro slide */
  INTRO: 'template.intro',
  /** Outcome slide */
  OUTCOME: 'template.outcome',
  /** Only say the ssml, no displayed slide */
  SAY: 'template.say',
  /** Tell the ssml, and close the session */
  TELL: 'template.tell',
};

/**
 * Interactive Canvas response template render actions.
 * @readonly
 */
const TemplateAction = {
  /** Reset the UI state */
  RESET: 'template.action.reset',
  /** Freeze UI controls */
  FREEZE: 'template.action.freeze',
  /** Set button 1 to active */
  ACTIVE_0: 'template.action.positive',
  /** Set button 2 to active */
  ACTIVE_1: 'template.action.negative',
};

/**
 * SSML TTS status marks from Interactive Canvas API.
 * @readonly
 */
const TtsMark = {
  START: 'START',
  END: 'END',
  ERROR: 'ERROR',
  FLIP: 'FLIP',
};

export {Template, TemplateAction, TtsMark};
