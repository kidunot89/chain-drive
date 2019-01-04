# Changelog
## [0.0.5]
### Added
- **prepublish** script added

### Changes
- **Chain and InnerChain** extend `PureComponent` and `memo`
- **react and react-dom** removed from dependencies and moved to devDependencies and peerDependencies

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