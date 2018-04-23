// Library Imports
import * as React from 'react';
import { Progress, SemanticCOLORS } from 'semantic-ui-react';

/**
 * Colors to fill progress bar with, 0 = 100%, 1 = 99-80%, etc.
 */
const colors: SemanticCOLORS[] = ['red', 'orange', 'yellow', 'olive', 'green', 'green'];

export default class ProgressColor extends Progress {
  public render() {
    // Calculate percentage. Typecast to numbers
    const percent = +this.props.percent || +this.props.value / +this.props.total;
    // Calculate if full. Percents can go below 0% in rare cases (rounding)
    const full = percent <= 0;
    // Floor multiples of 20% so full is green, 99% - 80% is olive, etc.
    // Full bars are grey (disabled)
    const color = full ? 'grey' : colors[Math.floor(percent / 0.2)];
    return <Progress color={color} {...this.props} />;
  }
}
