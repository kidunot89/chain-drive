# ChainDrive
[![Build Status](https://travis-ci.org/kidunot89/chain-drive.svg?branch=develop)](https://travis-ci.org/kidunot89/chain-drive)
[![Coverage Status](https://coveralls.io/repos/github/kidunot89/chain-drive/badge.svg?branch=develop)](https://coveralls.io/github/kidunot89/chain-drive?branch=develop)

ChainDrive is a **[React.js](https://reactjs.org)** component library dedicated to creating complex transitions without adding noise in your code. **[React Transition Group](https://github.com/reactjs/react-transition-group)**'s [`Transition`](https://reactcommunity.org/react-transition-group/transition) component is the core workhorse of this library, so it's a basic understanding of it is necessary there use.
###### *Inspired by* **[Anime.js + React Transition Group](https://itnext.io/anime-js-react-transition-group-5f6d0055a3a0)** by *[Uday Hiwarale](https://github.com/thatisuday)*

## Features
- **AnimeJs HOC**
- **Timeout calculation** 

## Getting Started
To install the library in you project run `npm install animejs react-transition-group chain-drive` or `yarn add animejs react-transition-group chain-drive`. 

## Usage
Using the library is quite simple.
```
import React from 'react;
import { render } from 'react-dom';
import { Chain, withAnimeJs } from 'chain-drive';

const Container = withAnimeJs( 
    React.forwardRef( ( { animeRef, context, ...r }, ref ) => (
        <div ref={ ref } { ...r }></div>
    )
) );

const App = () => (
    <Chain id="app" in={ true }>
        <Container
            id="section"
            entering={ {
                opacity: 1,
                translateX: [ '-100%', 0 ],
                duration: 600,
            } }
            exiting={ {
                opacity: 0,
                translateX: [ 0, '+100%' ],
                duration: 450,
            } }
            exited={ { opacity: 0 } }
        >
    </Chain>
)

render( <App />, document.getByElementId( 'app' ) );
```

## Transition Components
### Chain
#### Props
- **id** `string|number` *required* - ChainContext unique identifier
- **order** `string` - Chain transition order used for **Chain** and immediate child **InnerChain** component. Valid options are `fifo` *first-in first-out*, `filo` *first-in last-out*, `lifo` *last-in first-out*, and `lilo` *last-in last-out*. Defaults to `fifo`.
#### Notes
Functions as a relay for the transition and a wrapper to **[React Transition Group](https://github.com/reactjs/react-transition-group)**'s [`Transition`]() component. It stores the `state` of Transition component and passes it to the `ChainContext` context using `React.js`' [Context API](https://reactjs.org/docs/context.html) for use by all child components. All props for the Transition component are passed through and work like normal, except `timeout`. The `timeout` prop defaults to the highest enter and exit timeouts of all mounted direct child **withAnimeJs( component )**s.

```
<Chain id="app" in={ true }>
    ...
</Chain>
```

### InnerChain
#### Props
- **id** `string|number` *required* - ChainContext unique identifier
- **in** `boolean` - extra conditional used to determine `in` prop **Chain** component
#### Notes
Functions as a middleman of sorts by retrieving the `state` of the closest parent **Chain** or **InnerChain** component through context and passing it down to its children.
```
<Chain id="app" in={ true }>
    <InnerChain>
        ...
    </InnerChain>
</Chain>
```

## Animation HOCs
### withAnimeJs
#### Props
- **id** `string|number` *required* - ChainContext unique identifier
- **state** `string` - component's current state
- **processTimeout** `function` - callback used to calculate parent Chain/InnerChain timeout
#### Notes
A HOC that wraps and executes a series of **[Anime.js](http://animejs.com)** calls on its children. Anime.js manipulates DOM and doesn't interact with the VirtualDOM React uses, meaning for it to properly target elements the `ref` prop must be set somewhere on the wrapped component, like example below.
```
const Container = withAnimeJs( 
    React.forwardRef( ( { animeRef, context, children, ...r }, ref ) => (
        <div ref={ ref } { ...r }>
            <span>Wrapped</span>
            { children }
        </div>
    )
) );
```
The resulting component can be animated by state. This is done by providing anime.js parameters as a prop named after the corresponding state. You can see an example of this in the following example. Consult **Anime.js**' [documentation](http://animejs.com/documentation/) for more info. `processTimeout` is a callback used to calculate the `timeout` prop used for a parenting **Chain** or **InnerChain** component. The default callback is pretty robust and isn't used during stand-alone use so you'll rarely ever have to set this.
```
    <Container
        id="section"
        state="hello"
        hello={ {
            opacity: 1,
            translateX: [ '-100%', 0 ],
            duration: 600,
        } }
        goodbye={ {
            opacity: 0,
            translateX: [ 0, '+100%' ],
            duration: 450,
        } }
    >
        ...
    </Container>
```
When no `state` prop is provided, it's set to that of the nearest parent `ChainContext`. If none is found, it uses the default which is `unmounted`. Using in conjournment with the **Chain** and **InnerChain** components can allow for centralized state-management and complex transitions without much effort. 

## Examples

### Flashy Text
A recreation of couple of [Tobias Ahlin](http://tobiasahlin.com)'s [Moving Letters](http://tobiasahlin.com/moving-letters/#) examples. [Styled Components](https://www.styled-components.com/) are used for the base styling, but this can easily be replace with plain css.
[![Edit ChainDrive Example-1](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/00rv90712v)

### Order Test
A simple test to demonstrate the use of the `order` on the Chain Component.
[![Edit Order Test](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/k14roo7q9r)

### Overlay Menu
A simple overlay menu created using from both the previous Examples.
[![Edit Overlay Menu](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/l25z6k2vlz)

## Coming Soon
- More Examples

## Potential Ideas
- More animated HOCs using other animation libraries

## Caveats
- `React.js` Context API is relied on heavily throughout this library so any version before `16.3` is incompatible. 
