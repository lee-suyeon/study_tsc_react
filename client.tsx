import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';

import GuGuDan from './GuGuDan';
import WordRelay from './webgame/WordRelay/WordRelay';
import WordRelayClass from './webgame/WordRelay/WordRelayClass';
import NumberBaseball from './webgame/numberBaseball/NumberBaseball';
import NumberBaseballClass from './webgame/numberBaseball/NumberBaseballClass';
import ResponseCheck from './webgame/ResponseCheck/ResponseCheck';
import ResponseCheckClass from './webgame/ResponseCheck/ResponseCheckClass';

const Hot = hot(ResponseCheckClass); // HOC

ReactDOM.render(<Hot />, document.querySelector('#root'));