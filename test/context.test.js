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
    const chainContext = chainInitialState;
    const Context = () => (
        <ChainContext.Consumer>
            { context => (
                <React.Fragment>
                    <p className="id">{ context.id }</p>
                    <p className="state">{ context.state }</p>
                    <p className="enter-timeout">{ context.timeout().enter }</p>
                    <p className="exit-timeout">{ context.timeout().exit }</p>
                    { map( context.children, ( { state, enter, exit }, id ) => (
                        <div id={ id } key={ id }>
                            <p className="child-enter-timeout">{ enter }</p>
                            <p className="child-exit-timeout">{ exit }</p>
                        </div>
                    ) ) }
                </React.Fragment>
            ) }
        </ChainContext.Consumer>
    );

    afterEach( cleanup );
    it( 'initializes context', async () => {
        chainContext.init( "test" );
        const { container } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'test' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'unmounted' );
    } );

    it( 'updates context state', async () => {
        chainContext.init( "test2" );
        chainContext.state = 'entering';
        const { container } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'test2' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entering' );
    } );

    it( 'add a child to context', async () => {
        chainContext.init( "test3" );
        chainContext.state = 'entered';
        chainContext.add( 'test-child-1', { enter: 100, exit: 150 } );
        const { container } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'test3' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entered' );
        const testChild1 = await waitForElement( () => container.querySelector( '#test-child-1' ) );
        expect( testChild1 ).toBeTruthy();
        expect( testChild1.querySelector( '.child-enter-timeout' ).innerHTML ).toEqual( '100' );
        expect( testChild1.querySelector( '.child-exit-timeout' ).innerHTML ).toEqual( '150' );
    } );

    it( 'add multiple children to context and confirms context timeout', async () => {
        chainContext.init( "test4" );
        chainContext.state = 'entered';
        chainContext.add( 'test-child-1', { enter: 100, exit: 150 } );
        chainContext.add( 'test-child-2', { enter: 300, exit: 45 } );
        const { container } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'test4' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entered' );
        await wait( () => expect( container.querySelector( '.enter-timeout' ).innerHTML ).toEqual( '300' ) );
        await wait( () => expect( container.querySelector( '.exit-timeout' ).innerHTML ).toEqual( '150' ) );
        const testChild1 = await waitForElement( () => container.querySelector( '#test-child-1' ) );
        expect( testChild1 ).toBeTruthy();
        expect( testChild1.querySelector( '.child-enter-timeout' ).innerHTML ).toEqual( '100' );
        expect( testChild1.querySelector( '.child-exit-timeout' ).innerHTML ).toEqual( '150' );
        const testChild2 = await waitForElement( () => container.querySelector( '#test-child-2' ) );
        expect( testChild2 ).toBeTruthy();
        expect( testChild2.querySelector( '.child-enter-timeout' ).innerHTML ).toEqual( '300' );
        expect( testChild2.querySelector( '.child-exit-timeout' ).innerHTML ).toEqual( '45' );
    } );

    it( 'updates child context', async () => {
        chainContext.init( "test5" );
        chainContext.state = 'entered';
        chainContext.add( 'test-child-1', { enter: 100, exit: 150 } );
        const { container, rerender } = render(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );

        await wait( () => expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'test5' ) );
        expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entered' );
        const testChild1 = await waitForElement( () => container.querySelector( '#test-child-1' ) );
        expect( testChild1 ).toBeTruthy();
        expect( testChild1.querySelector( '.child-enter-timeout' ).innerHTML ).toEqual( '100' );
        expect( testChild1.querySelector( '.child-exit-timeout' ).innerHTML ).toEqual( '150' );
        
        chainContext.update( 'test-child-1', { enter: 200 } );
        rerender(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );
        await wait( () => expect( testChild1.querySelector( '.child-enter-timeout' ).innerHTML ).toEqual( '200' ) );

        chainContext.update( 'test-child-1', { exit: 400 } );
        rerender(
            <ChainContext.Provider value={ chainContext }>
                <Context />
            </ChainContext.Provider>
        );
        await wait( () => expect( testChild1.querySelector( '.child-exit-timeout' ).innerHTML ).toEqual( '400' ) );
    } );
} );