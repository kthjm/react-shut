# react-shut

[![npm](https://img.shields.io/npm/v/react-shut.svg?style=flat-square)](https://www.npmjs.com/package/react-shut)
[![npm](https://img.shields.io/npm/dm/react-shut.svg?style=flat-square)](https://www.npmjs.com/package/react-shut)
[![CircleCI](https://img.shields.io/circleci/project/github/kthjm/react-shut.svg?style=flat-square)](https://circleci.com/gh/kthjm/react-shut)
[![Codecov](https://img.shields.io/codecov/c/github/kthjm/react-shut.svg?style=flat-square)](https://codecov.io/gh/kthjm/react-shut)
<!-- [![cdn](https://img.shields.io/badge/jsdelivr-latest-e84d3c.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/react-shut/dist/react-shut.min.js) -->
[![cdn](https://img.shields.io/badge/jsdelivr-invalid-a1a1a1.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/react-shut/dist/react-shut.min.js)

## Installation
```shell
```
## Usage
```js
import { ShutFromRight } from 'react-shut'
import Quit from "./Quit.js"

export default (props) =>
  <ShutFromRight {...{
    mountWithShut: true,
    Quit: Quit,
    onCome: () => {},
    onQuit: () => {},
    background: "#485736",
    duration: "2s",
    touchRatio: 0.2,
    quitRatio: 0.8
  }}>
    {props.children}
  </ShutFromRight>
```
## API
#### `mountWithShut`
#### `Quit`
#### `onCome`
#### `onQuit`
#### `background`
#### `duration`
#### `touchRatio`
#### `quitRatio`
## License
MIT (http://opensource.org/licenses/MIT)

<!-- ## Old

`already` => `rash`

```javascript
import Layout from "react-layup";

export default ({children}) => (
    <Layup {...{
        Quit, // Component recieve {f} as props
        quit, // : boolean
        rash, // start view from still come
        widthRatio, // default is 0.4
        mobile: {
            transition, // default: "0.4s"
            background // default: "rgb(251, 251, 251)"
        },
        callbacks: {
            first, // if not rash, and first come time callback (e.g. process rash === true)
            come, // onTransitionEnd (e.g. i dont know)
            quit // onTransitionEnd (e.g. process for return false)
        },
        lifecycles: {/*same name, same time*/}
    }}>
        {children}
    </Layup>
);
``` -->
