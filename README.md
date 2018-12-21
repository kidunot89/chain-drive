# ChainDrive
[![Build Status](https://travis-ci.org/kidunot89/chain-drive.svg?branch=develop)](https://travis-ci.org/kidunot89/chain-drive)
[![Coverage Status](https://coveralls.io/repos/github/kidunot89/chain-drive/badge.svg?branch=develop)](https://coveralls.io/github/kidunot89/chain-drive?branch=develop)

ChainDrive is a **[React.js](https://reactjs.org)** component library dedicated to creating complex transitions without adding noise in your code. **[React Transition Group](https://github.com/reactjs/react-transition-group)**'s [`Transition`](https://reactcommunity.org/react-transition-group/transition) component is the core workhorse of this library, so it's a basic understanding of it is necessary there use.

###### *Inspired by* **[Anime.js + React Transition Group](https://itnext.io/anime-js-react-transition-group-5f6d0055a3a0)** by *[Uday Hiwarale](https://github.com/thatisuday)*

## Features
- **AnimeJs HOC**
- **Timeout calculation** 

## Getting Started
To install the library in you project run `npm install chain-drive` or `yarn add chain-drive`. 

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
            initial={ { opacity: 0 } }
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
        >
    </Chain>
)

render( <App />, document.getByElementId( 'app' ) );
```

## Transition Components
### Chain
#### Props
- **id** `string|number` *required* - Chained component unique identifier
#### Notes & Examples
Functions as a relay for the transition and a wrapper to **[React Transition Group](https://github.com/reactjs/react-transition-group)**'s [`Transition`]() component. It stores the `state` of Transition component and passes it to the `ChainContext` context using `React.js`' [Context API](https://reactjs.org/docs/context.html) for use by all child components. All props for the Transition component are passed through and work like normal, except `timeout`. The `timeout` prop defaults to the highest enter and exit timeouts of all mounted child `InnerChain` `animationHOC( component )`.

```
<Chain id="app" in={ true }>
    ...
</Chain>
```

### InnerChain
#### Props
- **id** `string|number` *required* - Chained component unique identifier
- **inOnEntering** `boolean` - toggle Transition `in` prop on `entering` or `exiting` states
- **reverse** `boolean` - `in` prop set to *true* on `exiting` states and *false* on `entering` states
#### Notes & Examples
Functions as a middleman of sorts by retrieving the `state` of the closest parent `Chain` or `InnerChain` component through context and passing it down to its children.
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
- **id** `string|number` *required* - Chained component unique identifier
- **initial** `object|object[]` - AnimeJs initial state parameters
- **entering** `object|object[]` - AnimeJs entering parameters
- **exiting** `object|object[]` - AnimeJs exiting parameters
- **processTimeout** `function` - callback used to calculate parent Chain/InnerChain timeout
#### Notes & Examples
A HOC that wraps and executes a series of **[Anime.js](http://animejs.com)** calls on children. Anime.js manipulates DOM and doesn't interact with the VirtualDOM React uses meaning for it to properly target element the `ref` prop must be set on the wrapped component, like example below.
```
const Container = withAnimeJs( 
    React.forwardRef( ( { animeRef, context, ...r }, ref ) => (
        <div ref={ ref } { ...r }></div>
    )
) );
```
The resulting component will take some additional props `entering`, `exiting`, and `initial`, and `processTimeout`. The first three are parameters for Anime.js each applied at different states in the transition's cycle. Consult **Anime.js**' [documentation](http://animejs.com/documentation/) for more info. `processTimeout` is callback used to calculate the `timeout` prop used for the parent `Chain` or `InnerChain` component. The default callback is pretty robust so you'll rarely ever have to set this.
```
<Chain id="app" in={ true }>
    <Container
        id="section"
        initial={ { opacity: 0 } } // No duration
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
    >
</Chain>
```

## Coming Soon
- Demo

## Potential Ideas
- More animated HOCs using other animation libraries

## Caveats
- `React.js` Context API is relied on heavily throughout this library so any version before `16.3` is incompatible. 
