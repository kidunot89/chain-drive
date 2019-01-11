// chain.jsx
/**
 * External dependencies
 */
import React from 'react';
import { every, omit, reduce } from 'lodash';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

/**
 * Internal dependencies
 */
import { chainInitialState, ChainContext } from './context';

class Chain extends React.PureComponent {
    constructor() {
        super( ...arguments );
        this.state = {
            setState: this.setTransitionState.bind( this ),
            updateAnimation: this.updateAnimation.bind( this ),
            removeAnimation: this.removeAnimation.bind( this ),
            updateInnerChain: this.updateInnerChain.bind( this ),
            removeInnerChain: this.removeInnerChain.bind( this ),
        };
        this.timeout = this.timeout.bind( this );
        this.isReady = this.isReady.bind( this );
    };

    static getDerivedStateFromProps( props, state ) {
        let newState = null;
        if ( props.id !== state.id ) {
            newState = chainInitialState( props.id );
        }

        if ( props.parentState !== state.parentState ) {
            newState = newState || {};
            newState.parentState = props.parentState;
        }

        if ( props.order !== state.order ) {
            newState = newState || {};
            newState.order = props.order;
        }

        if ( props.in !== state.in ) {
            newState = newState || {};
            newState.in = props.in;
        }
        
        return newState;
    }

    setTransitionState( state ) {
        this.setState( { state }, () => this.props.updateParent( this.props.id, state ) );
    }

    updateAnimation( id, timeout ) {
        const oldAnimation = Object.assign( {}, this.state.animations[ id ] );
        const updatedAnimation = Object.assign( oldAnimation, timeout );
        this.setState( { animations: { ...this.state.animations, ...{ [ id ]: updatedAnimation } } } );
    }

    removeAnimation( id ) {
        const animations = Object.assign( {}, this.state.animations );
        delete animations[ id ];
        this.setState( { animations } );
    }

    updateInnerChain( id, state ) {
        this.setState( { innerChains: { ...this.state.innerChains, ...{ [ id ]: state } } } );
    }

    removeInnerChain( id ) {
        const innerChains = Object.assign( {}, this.state.innerChains );
        delete innerChains[ id ];
        this.setState( { innerChains } );
    }

    timeout() {
        return reduce(
            this.state.animations,
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
    }

    isReady() {
        if ( this.state.state === 'unmounted' ) {
            return;
        }

        const { parentOrder, parentState } = this.props;
        let ready;
        let parentReady;

        if ( this.state.in ) {
            switch ( parentOrder.substring( 0, 2 ) ) {
                case 'li':
                    parentReady = this.state.in;
                    break;
                default:
                    parentReady = !parentState || parentState === 'entered';
            }

            switch ( this.state.order.substring( 0, 2 ) ) {
                case 'li':
                    ready = every( this.state.innerChains, state => state === 'entered' );
                    break;
                default:
                    ready = this.state.in;
            }

            return ready && parentReady;

        } else {
            switch ( parentOrder.substring( 2 ) ) {
                case 'lo':
                    parentReady = true;
                    break;
                default:
                    parentReady = !parentState || parentState === 'exited';
            }

            switch ( this.state.order.substring( 2 ) ) {
                case 'lo':
                    ready = every( this.state.innerChains, state => state === 'exited' ) ?
                        this.state.in :
                        true;
                    return ready;
                default:
                    ready = parentReady ?
                        this.state.in :
                        true;
                    return ready;
            }
            
        }
    }

    render() {
        const transProps = omit(
            this.props,
            [
                'id',
                'children',
                'updateParent',
                'parentState',
                'parentOrder',
                'order',
                'in',
            ],
        );

        return (
            <Transition
                timeout={ this.timeout() }
                { ...transProps }
                in={ this.isReady() }
            >
                { state => (
                    <ChainContext.UpdatingProvider
                        context={ this.state }
                        state={ state }
                    >
                        { this.props.children }
                    </ChainContext.UpdatingProvider>
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
    parentState: PropTypes.string,
    updateParent: PropTypes.func,
    order: PropTypes.oneOf( [
        'fifo', 
        'filo',
        'lifo',
        'lilo',
    ] ),
    parentOrder: PropTypes.oneOf( [
        'fifo', 
        'filo',
        'lifo',
        'lilo',
    ] ),
};

Chain.defaultProps = {
    updateParent: () => {},
    parentState: undefined,
    order: 'fifo',
    parentOrder: 'fifo'
};

const InnerChain = React.memo( ( { in: show, ...rest } ) => (
    <ChainContext.Consumer>
        { context => (
            <Chain
                { ...rest }
                parentState={ context.state }
                parentOrder={ context.order }
                updateParent={ context.updateInnerChain }
                in={ show && context.in }
            />
        ) }
    </ChainContext.Consumer>
) );

InnerChain.propTypes = {
    id: PropTypes.oneOfType( [
        PropTypes.string,
        PropTypes.number,
    ] ).isRequired,
    in: PropTypes.bool,
};

InnerChain.defaultProps = { in: true };

export { Chain, InnerChain };
