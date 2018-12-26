// context.js
/**
 * External dependencies
 */
import React from 'react';
import { reduce } from 'lodash';

/**
 * Chain initial state
 */
const chainInitialState = {
    init ( id, state = 'unmounted' ) {
        this.id = id;
        this.state = state;
        this.children = {};

        return this;
    },

    add( childId, { enter, exit } ) {
        this.children[ childId ] = { enter, exit };
    },

    remove( childId ) {
        delete this.children[ childId ];
    },

    exists( childId ) {
        return !!this.children[ childId ];
    },

    update( childId, state = {} ) {
        const oldState = this.children[ childId ];
        if ( oldState ) {
            this.children[ childId ] = { ...oldState, ...state };
        } else {
            console.warn( `${ childId } is not a child of ${ this.id }` );
        }
    },

    timeout() {
        return reduce(
            this.children,
            ( result, { enter, exit } ) => {
                if ( enter > result.enter ) {
                    result.enter = enter;
                }

                if ( exit > result.exit ) {
                    result.exit = exit;
                }

                return result;
            },
            { enter: 0, exit: 0 },
        )
    },
};

/**
 * Reusable React Context for Chain
 */
const ChainContext = React.createContext( chainInitialState );

/**
 * Reusable wrapper for passing Chain context and state
 * 
 * @param { React.Component } BaseComponent 
 */
const chainedConsumer = BaseComponent => ( { id, state, ...rest } ) => (
    <ChainContext.Consumer>
        { context => (
            <BaseComponent
                context={ 
                    !context.id ?
                        context.init( id ):
                        context
                }
                id={ id }
                state={ state || context.state }
                { ...rest }
            />
        ) }
    </ChainContext.Consumer>
);

export { chainInitialState, ChainContext, chainedConsumer };