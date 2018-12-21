// chained.jsx
/**
 * External dependencies
 */
import React from 'react';
import { omit, reduce, each } from 'lodash';
import PropTypes from 'prop-types';
import anime from 'animejs';

/**
 * Internal dependencies
 */
import { chainedConsumer } from './context';

/**
 * Returns formatted Anime.js targets parameter
 * 
 * @param { HTMLElement } rootEl - root element
 * @param { string|string[]|null } selectors - targetted css selectors
 * 
 * @returns { HTMLElement|HTMLElement[]|object }
 */
const formatTargets = ( rootEl, selectors ) => {
    if ( !selectors ) {
        return rootEl;
    }

    if ( Array.isArray( selectors ) ) {
        return rootEl.querySelectorAll( selectors.join( ', ' ) );
    }

    if ( typeof selectors === 'object' ) {
        return selectors;
    }

    return rootEl.querySelectorAll( selectors );
};

/**
 * Return formatted animation parameter object for use in Anime.js functions
 * 
 * @param { object } params - unformatted params
 * @param { HTMLElement } rootEl - root element
 * 
 * @returns { object }
 */
const formatParams = ( params, rootEl ) => {
    const {
        targets: selector,
        update,
        begin,
        run,
        complete,
        ...rest
    } = params;
    const targets = formatTargets( rootEl, selector );

    return {
        targets,
        ...rest,
        update: update ? ( anim ) => update( anim, targets ) : undefined,
        begin: begin ? ( anim ) => begin( anim, targets ) : undefined,
        run: run ? ( anim ) => run( anim, targets ) : undefined,
        complete: complete ? ( anim ) => complete( anim, targets ) : undefined,
    }
};

/**
 * Returns calculated timeout by add duration and delay properties in the params object
 * 
 * @param { HTMLElement } rootEl - root element 
 * @param { object } params - unformatted parameter
 * 
 * @returns { number }
 */
const calculate = ( rootEl, params ) => {
    const { duration = 0, delay = 0, targets: t } = params;
    
    if ( typeof delay === 'function' ) {
        const targets = formatTargets( rootEl, t );
        
        if ( Array.isArray( targets ) ) {
            return duration + reduce( targets, ( highestDelay, nextTarget, index, list ) => {
                const nextDelay = delay( nextTarget, index, list.length );
                return highestDelay < nextDelay ? nextDelay : highestDelay;
            }, 0 );
        } else {
            return duration + delay( targets, 0, 1 );
        }
    }
    
    return duration + delay;
};

/**
 * Returns processed timeout value for provided Anime.js params
 * 
 * @param { HTMLElement } rootEl - root element 
 * @param { object } params - unformatted Anime.js params
 * 
 * @return { number }
 */
const processTimeout = ( rootEl, params ) => {
    if ( params ) {
        if ( Array.isArray( params ) ) {
            return reduce(
                params,
                ( highestTimeout, nextParams ) => {
                    const nextTimeout = calculate( rootEl, nextParams );
                    return highestTimeout < nextTimeout ? nextTimeout : highestTimeout;
                },                    
                0
            );
        } else {
            return calculate( rootEl, params );
        }
    }
    
    return 0;
};

/**
 * Returns a component to be animated by Anime.js
 * 
 * @param { React.Component } BaseComponent - wrapped component
 * 
 * @returns { React.Component }
 */
export default BaseComponent => {
    class AnimeJs extends React.Component {
        constructor() {
            super( ...arguments );
            this.ref = React.createRef();
            this.animeRef = null;
            this.linkToChain = this.linkToChain.bind( this );
            this.timeout = this.timeout.bind( this );
            this.animate = this.animate.bind( this );
            this.animateTimeline = this.animateTimeline.bind( this );
        }

        componentDidMount() {
            this.linkToChain();
            this.animate( 'initial' );
        }

        componentDidUpdate( prevProps ) {
            const { state } = this.props;

            if ( prevProps.state !== state ) {
                if ( state === 'entering' || state === 'exiting' ) {
                    this.animate( state );
                }
            }
        }

        linkToChain() {
            const { id } = this.props;
            if ( !this.props.context.exists( id ) ) {
                this.props.context.add( id, this.timeout() );
            }
        }

        timeout() {
            const { entering, exiting, processTimeout } = this.props;
            const rootEl = this.ref.current;
            
            return {
                enter: processTimeout( rootEl, entering ),
                exit: processTimeout( rootEl, exiting ),
            };
        }

        animate( state ) {
            const params = this.props[ state ];
            if ( Array.isArray( params ) ) {
                return this.animateTimeline( state );
            }

            if ( params ) {
                this.animeRef = anime( {
                    loop: false,
                    ...formatParams( params, this.ref.current ),
                } );
            }
        }

        animateTimeline( status ) {
            this.animeRef = anime.timeline( { loop: false } );
            const rootEl = this.ref.current;
            each( this.props[ status ], params => this.animeRef.add( formatParams( params, rootEl ) ) );
        }

        render() {
            const props = omit( this.props, [ 'initial', 'entering', 'exiting', 'processTimeout' ] );
            
            return (<BaseComponent ref={ this.ref } animeRef={ this.animeRef } { ...props } />);
        }
    }

    AnimeJs.propTypes = {
        id: PropTypes.oneOfType( [
            PropTypes.string,
            PropTypes.number,
        ] ).isRequired,
        context: PropTypes.shape( {
            status: PropTypes.func,
            updateTimeout: PropTypes.func,
        } ).isRequired,
        state: PropTypes.string.isRequired,
        initial: PropTypes.oneOfType( [
            PropTypes.shape( {} ),
            PropTypes.arrayOf( PropTypes.shape( {} ) ),
        ] ),
        entering: PropTypes.oneOfType( [
            PropTypes.shape( {} ),
            PropTypes.arrayOf( PropTypes.shape( {} ) ),
        ] ),
        exiting: PropTypes.oneOfType( [
            PropTypes.shape( {} ),
            PropTypes.arrayOf( PropTypes.shape( {} ) ),
        ] ),
        processTimeout: PropTypes.func,
    };

    AnimeJs.defaultProps = {
        processTimeout,
    };

    return chainedConsumer( AnimeJs );
};
