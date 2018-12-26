// chain.jsx
/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

/**
 * Internal dependencies
 */
import { chainInitialState, ChainContext } from './context';

class Chain extends React.Component {
    constructor() {
        super( ...arguments );
        this.state = chainInitialState
    };

    static getDerivedStateFromProps( props, state ) {
        if( props.id !== state.id ) {
            return state.init( props.id );
        }
        
        return null;
    }

    render() {
        const { id, children, ...rest } = this.props;
        return (
            <Transition
                timeout={ this.state.timeout() }
                { ...rest }
            >
                { state => (
                    <ChainContext.Provider value={ { ...this.state, state } }>
                    { children }
                    </ChainContext.Provider>
                ) }
            </Transition>
        );
    }
}

Chain.propTypes = {
    id: PropTypes.oneOfType( [
        PropTypes.string,
        PropTypes.number,
    ] ).isRequired,
};

const InnerChain = ( { inOnEntering, reverse, ...r } ) => (
    <ChainContext.Consumer>
        { ( { state } ) => {
            let show;
            if ( inOnEntering ) {
                show = reverse ?
                    state === 'exiting' || state === 'exited' :
                    state === 'entering' || state === 'entered';
            } else {
                show = reverse ? state === 'exited' : state === 'entered';
            }

            return (
                <Chain { ...r } in={ show } />
            )
        } }
    </ChainContext.Consumer>
);

InnerChain.propTypes = {
    id: PropTypes.oneOfType( [
        PropTypes.string,
        PropTypes.number,
    ] ).isRequired,
    inOnEntering: PropTypes.bool,
    reverse: PropTypes.bool,
};

InnerChain.defaultProps = {
    inOnEntering: false,
    reverse: false,
}

export { Chain, InnerChain };
