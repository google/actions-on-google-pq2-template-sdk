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

import orientation from './orientation';
import preloadImage from './preloadImage';

/**
 * @fileoverview Returns a random background of the default set of backgrounds.
 * Returns a shape of { portrait:string; landscape:string; }, so it can
 * accommodate either orientation when implemented.
 */

const backgrounds = [
  {
    portrait: '/image/defaults/quiz_portrait_1@2x.png',
    landscape: '/image/defaults/quiz_landscape_1@2x.png',
  },
  {
    portrait: '/image/defaults/quiz_portrait_2@2x.png',
    landscape: '/image/defaults/quiz_landscape_2@2x.png',
  },
  {
    portrait: '/image/defaults/quiz_portrait_3@2x.png',
    landscape: '/image/defaults/quiz_landscape_3@2x.png',
  },
  {
    portrait: '/image/defaults/quiz_portrait_4@2x.png',
    landscape: '/image/defaults/quiz_landscape_4@2x.png',
  },
];

const randomBackground = () => {
  return backgrounds[Math.floor(Math.random() * backgrounds.length)];
};

const validateBackground = async (background) => {
  let url;
  try {
    url = background[orientation()];
    await preloadImage(url);
  } catch (e) {
    url = randomBackground()[orientation()];
  }
  return url;
};

export {randomBackground, backgrounds, validateBackground};
