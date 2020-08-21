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

import React from 'react';
import PropTypes from 'prop-types';

/**
 * @fileoverview Loads a typeface from Google's font api and sets it as the
 * default typeface for the entire project.
 */

const Typeface = ({src}) =>
  src ? (
    <div>
      <link href={src} rel="stylesheet" />
      <style
        dangerouslySetInnerHTML={{
          __html: `* { font-family: "${src.substring(
            src.indexOf('=') + 1
          )}", 'Google Sans', Helvetica, sans-serif; }`,
        }}
      />
    </div>
  ) : null;

Typeface.propTypes = {
  src: PropTypes.string,
};

export default Typeface;
