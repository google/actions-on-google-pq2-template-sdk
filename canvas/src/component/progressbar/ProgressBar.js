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
import {connect} from 'react-redux';
import style from './ProgressBar.css';

/**
 * @fileoverview Renders a progress-bar, with a dynamic width.
 */

const ProgressBar = ({progress, config}) => {
  const total = parseInt(config.questionsPerQuiz, 10);
  return (
    <div
      className={[style.container, progress >= 0 && progress < total ? style.show : null].join(' ')}
      style={{backgroundColor: config.progressBarBackgroundColor}}
    >
      <div
        className={style.bar}
        style={{
          width: `${(progress / total) * 100}%`,
          backgroundColor: config.progressBarFillColor,
        }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number,
};
ProgressBar.defaultProps = {
  progress: -1,
};

export default connect((state) => ({
  config: state.config,
}))(ProgressBar);
