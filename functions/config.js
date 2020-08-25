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

/**
 * Project configuration settings
 */
const config = {
  // Webhook config
  FUNCTION_NAME: 'personalityQuiz',
  FUNCTION_VERSION: 'v1',
  FUNCTION_MEMORY: '1GB',
  FUNCTION_REGION: 'us-central1',
  FUNCTION_TIMEOUT: 60, // seconds
  IMMERSIVE_URL: `https://${process.env.GCLOUD_PROJECT}.web.app/`,
  ENABLE_DEBUG: true,
  DEBUG_KEY: 'DedicatedDebugInfo',
  SSML_BREAK_TIME: 750, // milliseconds
  MAX_QUESTIONS_PER_QUIZ: 10,

  // Default values for Quiz settings in the data sheet
  PLAY_INTRO_CONFIRMATION_DEFAULT: false,
  QUESTIONS_PER_QUIZ_DEFAULT: 3,
  INTRO_TITLE_DEFAULT: '',
  INTRO_SUBTITLE_DEFAULT: '',
  INTRO_TITLE_COLOR_DEFAULT: '#fff',
  INTRO_SUBTITLE_COLOR_DEFAULT: '#fff',
  START_BUTTON_TEXT_DEFAULT: 'Start',
  RESTART_BUTTON_TEXT_DEFAULT: 'Play Again',
  TEXT_COLOR_DEFAULT: '#fff',
  FONT_DEFAULT: '',
  BUTTON_NORMAL_TEXT_COLOR_DEFAULT: '#202124',
  BUTTON_NORMAL_BACKGROUND_COLOR_DEFAULT: '#fff',
  BUTTON_SELECTED_TEXT_COLOR_DEFAULT: '#fff',
  BUTTON_SELECTED_BACKGROUND_COLOR_DEFAULT: '#4285f4',
  PROGRESS_BAR_BACKGROUND_COLOR_DEFAULT: '#fff',
  PROGRESS_BAR_FILL_COLOR_DEFAULT: '#f24738',
};

module.exports = config;
