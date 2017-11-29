# react-shut
> WIP for publish

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status]()]()
[![Coverage Status]()]()

~~直近のrelativeはoverflowXをhiddenにしないと変になる~~
=> 解消した

## Installation
```shell
```
## Usage
```js
```
## API
## License
MIT (http://opensource.org/licenses/MIT)

## Old

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
```
