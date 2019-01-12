/**
 * External dependencies
 */
import React from 'react';
import { map } from 'lodash';
import { render, cleanup, wait, waitForElement } from 'react-testing-library';
import 'jest-dom/extend-expect';

/**
 * Internal dependencies
 */
import { chainInitialState, ChainContext } from '../src';

describe( 'ChainContext', () => {
    let chainContext;
    beforeEach( () => chainContext = chainInitialState() );
    afterEach( cleanup );

    const Context = () => (
        <ChainContext.Consumer>
            { context => (
                <React.Fragment>
                    <p className="id">{ context.id }</p>
                    <p className="state">{ context.state }</p>
                    { map( context.animations, ( { enter, exit }, id ) => (
                        <div id={ id } key={ id }>
                            <p className="animation-enter-timeout">{ enter }</p>
                            <p className="animation-exit-timeout">{ exit }</p>
                        </div>
                    ) ) }
                    { map( context.innerChains, ( state, id ) => (
                        <div id={ id } key={ id }>
                            <p className="inner-chain-state">{ state }</p>
                        </div>
                    ) ) }
                </React.Fragment>
            ) }
        </ChainContext.Consumer>
    );
    it( 'initializes context', async () => {
        chainContext = chainInitialState( "state-test-1" );
        const { container } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'state-test-1' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'unmounted' );
    } );

    it( 'updates context state', async () => {
        chainContext = chainInitialState( "state-test-2" );
        chainContext.state = 'entering';

        const { container } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'state-test-2' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entering' );
    } );

    it( 'add an animation to context', async () => {
        chainContext = chainInitialState( "animation-test-1" );
        chainContext.state = 'entered';
        chainContext.animations[ 'animation-1' ] = { enter: 100, exit: 150 };

        const { container } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'animation-test-1' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entered' );

        const animation1 = await waitForElement( () => container.querySelector( '#animation-1' ) );
        expect( animation1 ).toBeTruthy();
        expect( animation1.querySelector( '.animation-enter-timeout' ).innerHTML ).toEqual( '100' );
        expect( animation1.querySelector( '.animation-exit-timeout' ).innerHTML ).toEqual( '150' );
    } );

    it( 'add multiple animations to context', async () => {
        chainContext = chainInitialState( "animation-test-2" );
        chainContext.state = 'entered';
        chainContext.animations[ 'animation-1' ] = { enter: 100, exit: 150 };
        chainContext.animations[ 'animation-2' ] = { enter: 300, exit: 45 };

        const { container } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'animation-test-2' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entered' );

        const animation1 = await waitForElement( () => container.querySelector( '#animation-1' ) );
        expect( animation1 ).toBeTruthy();
        expect( animation1.querySelector( '.animation-enter-timeout' ).innerHTML ).toEqual( '100' );
        expect( animation1.querySelector( '.animation-exit-timeout' ).innerHTML ).toEqual( '150' );

        const animation2 = await waitForElement( () => container.querySelector( '#animation-2' ) );
        expect( animation2 ).toBeTruthy();
        expect( animation2.querySelector( '.animation-enter-timeout' ).innerHTML ).toEqual( '300' );
        expect( animation2.querySelector( '.animation-exit-timeout' ).innerHTML ).toEqual( '45' );
    } );

    it( 'updates animation context', async () => {
        chainContext = chainInitialState( "animation-test-3" );
        chainContext.state = 'entered';
        chainContext.animations[ 'animation-1' ] = { enter: 100, exit: 150 };

        const { container, rerender } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'animation-test-3' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entered' );

        const animation1 = await waitForElement( () => container.querySelector( '#animation-1' ) );
        expect( animation1 ).toBeTruthy();
        expect( animation1.querySelector( '.animation-enter-timeout' ).innerHTML ).toEqual( '100' );
        expect( animation1.querySelector( '.animation-exit-timeout' ).innerHTML ).toEqual( '150' );
        
        chainContext.animations[ 'animation-1' ] = { enter: 200 };

        rerender(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( animation1.querySelector( '.animation-enter-timeout' ).innerHTML ).toEqual( '200' ) );

        chainContext.animations[ 'animation-1' ] = { exit: 400 };

        rerender(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );
        await wait( () => expect( animation1.querySelector( '.animation-exit-timeout' ).innerHTML ).toEqual( '400' ) );
    } );

    it( 'add innerChains to context', async () => {
        chainContext = chainInitialState( "inner-chain-test-1" );
        chainContext.state = 'exited';
        chainContext.innerChains[ 'chain-1' ] = 'unmounted';

        const { container } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'inner-chain-test-1' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'exited' );

        const chain1 = await waitForElement( () => container.querySelector( '#chain-1' ) );
        expect( chain1 ).toBeTruthy();
        expect( chain1.querySelector( '.inner-chain-state' ).innerHTML ).toEqual( 'unmounted' );

    } );


    it( 'updates innerChains\' state', async () => {
        chainContext = chainInitialState( "inner-chain-test-2" );
        chainContext.state = 'entering';
        chainContext.innerChains[ 'chain-1' ] = 'unmounted';

        const { container, rerender } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'inner-chain-test-2' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entering' );

        const chain1 = await waitForElement( () => container.querySelector( '#chain-1' ) );
        expect( chain1 ).toBeTruthy();
        expect( chain1.querySelector( '.inner-chain-state' ).innerHTML ).toEqual( 'unmounted' );

        chainContext.innerChains[ 'chain-1' ] = 'entering';
        rerender(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( chain1.querySelector( '.inner-chain-state' ).innerHTML ).toEqual( 'entering' ) );

        chainContext.innerChains[ 'chain-1' ] = 'entered';
        rerender(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( chain1.querySelector( '.inner-chain-state' ).innerHTML ).toEqual( 'entered' ) );
    } );

    it( 'adds multiple innerChains to context', async () => {
        chainContext = chainInitialState( "inner-chain-test-3" );
        chainContext.state = 'entered';
        chainContext.innerChains = { 
            'chain-1': 'unmounted',
            'chain-2': 'unmounted',
        };

        const { container, rerender } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'inner-chain-test-3' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entered' );

        const chain1 = await waitForElement( () => container.querySelector( '#chain-1' ) );
        expect( chain1 ).toBeTruthy();
        expect( chain1.querySelector( '.inner-chain-state' ).innerHTML ).toEqual( 'unmounted' );

        const chain2 = await waitForElement( () => container.querySelector( '#chain-2' ) );
        expect( chain2 ).toBeTruthy();
        expect( chain2.querySelector( '.inner-chain-state' ).innerHTML ).toEqual( 'unmounted' );

        chainContext.innerChains = { ...chainContext.innerChains, ...{ 'chain-1': 'entering' } };
        rerender(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( chain1.querySelector( '.inner-chain-state' ).innerHTML ).toEqual( 'entering' ) );

        chainContext.innerChains = { ...chainContext.innerChains, ...{ 'chain-2': 'exited' } };
        rerender(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( chain2.querySelector( '.inner-chain-state' ).innerHTML ).toEqual( 'exited' ) );
    } );
} );

describe( 'ChainContext.UpdatingProvider', () => {
    afterEach( cleanup );
    const Context = () => (
        <ChainContext.Consumer>
            { context => (
                <div id={ context.id }>
                    <p className="state">{ context.state }</p>
                    { map( context.innerChains, ( state, id ) => (
                        <div id={ `inner-chain-${ id }` } key={ id }>
                            <p className="inner-chain-state">{ state }</p>
                        </div>
                    ) ) }
                </div>
            ) }
        </ChainContext.Consumer>
    );

    it( 'updates parent ChainContext\'s innerChains with child ChainContext\'s state', async () => {
        const parentContext = chainInitialState( 'parent' );
        parentContext.setState = state => parentContext.state = state;
        parentContext.setState( 'entered' );
        parentContext.updateInnerChain = ( id, state ) => parentContext.innerChains[ id ] = state;
        
        const childContext = chainInitialState( 'child' );
        childContext.setState = state => { 
            childContext.state = state;
            parentContext.updateInnerChain( childContext.id, state );
        };

        const { container, rerender } = render(
            <ChainContext.Provider value={ parentContext }>
                <Context />
                <ChainContext.UpdatingProvider
                    context={ childContext }
                    state="entering"
                >
                    <Context />
                </ChainContext.UpdatingProvider>
            </ChainContext.Provider>
        );

        rerender(
            <ChainContext.Provider value={ parentContext }>
                <Context />
                <ChainContext.UpdatingProvider
                    context={ childContext }
                    state="entering"
                >
                    <Context />
                </ChainContext.UpdatingProvider>
            </ChainContext.Provider>
        );
        const parent = await waitForElement( () => container.querySelector( '#parent' ) );
        expect( parent ).toBeTruthy();
        expect( parent.querySelector( 'p.state' ).innerHTML ).toEqual( 'entered' );

        const child = await waitForElement( () => container.querySelector( '#child' ) );
        expect( child ).toBeTruthy();
        await wait( () => expect( child.querySelector( 'p.state' ).innerHTML ).toEqual( 'entering' ) );

        rerender(
            <ChainContext.Provider value={ parentContext }>
                <Context />
                <ChainContext.UpdatingProvider
                    context={ childContext }
                    state="entering"
                >
                    <Context />
                </ChainContext.UpdatingProvider>
            </ChainContext.Provider>
        );
        expect( parent.querySelector( '#inner-chain-child .inner-chain-state' ).innerHTML ).toEqual( 'entering' );

        rerender(
            <ChainContext.Provider value={ parentContext }>
                <Context />
                <ChainContext.UpdatingProvider
                    context={ childContext }
                    state="entered"
                >
                    <Context />
                </ChainContext.UpdatingProvider>
            </ChainContext.Provider>
        );
        rerender(
            <ChainContext.Provider value={ parentContext }>
                <Context />
                <ChainContext.UpdatingProvider
                    context={ childContext }
                    state="entered"
                >
                    <Context />
                </ChainContext.UpdatingProvider>
            </ChainContext.Provider>
        );
        await wait( () => expect( child.querySelector( 'p.state' ).innerHTML ).toEqual( 'entered' ) );

        rerender(
            <ChainContext.Provider value={ parentContext }>
                <Context />
                <ChainContext.UpdatingProvider
                    context={ childContext }
                    state="entered"
                >
                    <Context />
                </ChainContext.UpdatingProvider>
            </ChainContext.Provider>
        );
        expect( parent.querySelector( '#inner-chain-child .inner-chain-state' ).innerHTML ).toEqual( 'entered' );
    } );
} );