# react-shut

[![npm](https://img.shields.io/npm/v/react-shut.svg?style=flat-square)](https://www.npmjs.com/package/react-shut)
[![npm](https://img.shields.io/npm/dm/react-shut.svg?style=flat-square)](https://www.npmjs.com/package/react-shut)
[![Travis](https://img.shields.io/travis/kthjm/react-shut.svg?style=flat-square)](https://travis-ci.org/kthjm/react-shut)
[![Codecov](https://img.shields.io/codecov/c/github/kthjm/react-shut.svg?style=flat-square)](https://codecov.io/gh/kthjm/react-shut)
[![cdn](https://img.shields.io/badge/jsdelivr-latest-e84d3c.svg?style=flat-square)](https://cdn.jsdelivr.net/npm/react-shut/dist/react-shut.min.js)

easy covering layer that moved by touching.
[**demo**](https://react-shut.netlify.com/)

## Installation

```shell
yarn add react-shut
```

## Usage

```js
import { ShutFromRight as Shut } from 'react-shut'

export default props => (
  <Shut
    {...{
      mountWithShut: true,
      Quit: props => <div onClick={props.fn} />,
      onComeEnd: () => {},
      onQuitEnd: () => {},
      background: '#485736',
      duration: 2,
      touchRatio: 0.2,
      quitRatio: 0.8,
      notScroll: true,
      hiddenBar: true
    }}
  >
    {props.children}
  </Shut>
)
```

## Components

* `ShutFromTop`
* `ShutFromBottom`
* `ShutFromLeft`
* `ShutFromRight`

## Props

##### `mountWithShut: boolean`

##### `Quit: React$Component`

##### `onComeEnd: (SyntheticTransitionEvent<HTMLDivElement>)`

##### `onQuitEnd: (SyntheticTransitionEvent<HTMLDivElement>)`

##### `background: string`

##### `duration: number`

##### `touchRatio: number`

##### `quitRatio: number`

##### `notScroll: boolean`

##### `hiddenBar: boolean`

## License

MIT (http://opensource.org/licenses/MIT)
