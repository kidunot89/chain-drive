# Changelog
## [0.0.5]
### Added
- **order** prop added to `Chain` component. Accepts `fifo`, `filo`, `lifo`, and `lilo` as valid options and defaults to `fifo`.
- **in** prop added to `InnerChain` component. Defaults to `true`.
- **prepublish** script added to package.json.

### Removed
- **inOnEntering and reverse** props removed from `InnerChain` component.

### Changes
- **ChainContext functions moved** to `Chain` component.   
- **AnimeJs, Chain and InnerChain** components extend `PureComponent` and `memo`.
- **animejs, react, react-transition-group, and react-dom** removed from dependencies and moved to devDependencies and peerDependencies.

## [0.0.4]
### Removed
- **Unnecessary debug code** removed from context.js and chain.js.

## [0.0.3]
### Changes
- **withAnimeJs** wrapped component can be used stand-alone without a parent `Chain` component.
- **entering, exiting, and initial** props removed from `withAnimeJs`' `propTypes` definition.
- **README.md** updated.
- **with-anime.test.js** updated.
### Fixes
- **processTimeout** `withAnimeJs`' default timeout calculation fixed for states with multiple steps.