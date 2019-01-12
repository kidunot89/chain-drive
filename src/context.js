// context.js
/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Chain initial state
 */
const chainInitialState = ( id ) => ( {
    id,
    state: 'unmounted',
    animations: {},
    innerChains: {},
} );

/**
 * Reusable React Context for Chain
 */
const ChainContext = React.createContext( chainInitialState() );

/**
 * @class UpdatingProvider
 * 
 * @description acts as middleman for ChainContext and Transition from 
 * the 'react-transition-group'. It's job is to update the 'state' state
 * variable in the wrapping 'Chain' component and calls the 'updateParent'
 * prop to provide the updated 'state' to the parent 'Chain' of the wrapping 
 * 'Chain'
 */
class UpdatingProvider extends React.PureComponent{
    constructor() {
        super( ...arguments );
        this.update = this.update.bind( this );
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate( prevProps ) {
        if ( prevProps.state !== this.props.state ) {
            this.update();
        }
    }

    update() {
        const { context, state } = this.props;
        context.setState( state );
    }

    render() {
        return (
            <ChainContext.Provider value={ { ...this.props.context } }>
                { this.props.children }
            </ChainContext.Provider>
        );
    }
}

UpdatingProvider.propTypes = {
    context: PropTypes.shape( {
        id: PropTypes.string.isRequired,
    } ).isRequired,
    state: PropTypes.string.isRequired,
};

UpdatingProvider.defaultProps = {
    parentUpdate: () => {},
};

ChainContext.UpdatingProvider = UpdatingProvider;

/**
 * Reusable wrapper for passing Chain context and state
 * 
 * @param { React.Component } BaseComponent 
 */
const chainedConsumer = BaseComponent => ( { id, state, ...rest } ) => (
    <ChainContext.Consumer>
        { context => (
            <BaseComponent
                context={ !context.id ? chainInitialState( id ): context }
                id={ id }
                state={ state || context.state }
                { ...rest }
            />
        ) }
    </ChainContext.Consumer>
);

export { chainInitialState, ChainContext, chainedConsumer };