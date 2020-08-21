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

export const Slide = {
  ADD: 'SLIDE_ADD',
};

export const Config = {
  SET: 'CONFIG_SET',
};

export const SSML = {
  SET: 'SSML_SET',
  UNSET: 'SSML_UNSET',
};

export const Progress = {
  SET: 'PROGRESS_SET',
};

export const Transition = {
  SET: 'TRANSITION_SET',
};

export const Frozen = {
  SET: 'FREEZE_SET',
};

export const Option = {
  ACTIVATE: 'OPTION_ACTIVATE',
  DEACTIVATE: 'OPTION_DEACTIVATE',
};

let slideKey = 0;

export const addSlide = (fields) => ({
  type: Slide.ADD,
  id: ++slideKey,
  fields,
});

export const setConfig = (fields) => ({
  type: Config.SET,
  fields,
});

export const setSSML = (id) => ({
  type: SSML.SET,
  id,
});

export const unsetSSML = () => ({
  type: SSML.UNSET,
  id: null,
});

export const setProgress = (id) => ({
  type: Progress.SET,
  id,
});

export const setTransition = (component) => ({
  type: Transition.SET,
  component,
});

export const setFrozen = (frozen) => ({
  type: Frozen.SET,
  frozen,
});

export const setOptionActive = (option) => ({
  type: Option.ACTIVATE,
  option,
});

export const setOptionDeactive = (option) => ({
  type: Option.DEACTIVATE,
  option,
});
