/**
 * External dependencies
 */
import React from 'react';
import { map } from 'lodash';
import { render, cleanup, wait, waitForElement, getByTestId } from 'react-testing-library';
import 'jest-dom/extend-expect';

/**
 * Internal dependencies
 */
import { Chain, ChainContext, InnerChain } from '../src';

describe( 'Chain component', () => {
    afterEach( cleanup );
    const Context = () => (
        <ChainContext.Consumer>
            { context => (
                <React.Fragment>
                    <p className="id">{ context.id }</p>
                    <p className="state">{ context.state }</p>
                </React.Fragment>
            ) }
        </ChainContext.Consumer>
    );

    it( 'mounts and transition to \'entered\' state in 450ms', async () => {
        const { container } = render(
            <Chain id="test1" timeout={ 450 } in>
                <Context />
            </Chain>
        );

        expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'test1' );
        await wait( () => expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entered' ) );
    } );

    it(
        `mounts and transition to 'entered' state in 375ms and then transition to
            'exited' state in 220ms when 'in' prop is set to 'false'`,
        async () => {
            const { container, rerender } = render(
                <Chain id="test2" timeout={ { enter: 375, exit: 220 } } in>
                    <Context />
                </Chain>
            );

            expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'test2' );
            await wait( () => expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'entered' ) );

            rerender(
                <Chain id="test2" timeout={ { enter: 375, exit: 220 } } in={ false }>
                    <Context />
                </Chain>
            )

            expect( container.querySelector( '.id' ).innerHTML ).toEqual( 'test2' );
            await wait( () => expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'exiting' ) );
            await wait( () => expect( container.querySelector( '.state' ).innerHTML ).toEqual( 'exited' ) );
        }
    );

} );

describe( 'InnerChain component', () => {
    afterEach( cleanup );
    const Context = () => (
        <ChainContext.Consumer>
            { context => (
                <React.Fragment>
                    <p className={ `${ context.id }-id` }>{ context.id }</p>
                    <p className={ `${ context.id }-state` }>{ context.state }</p>
                    <p className={ `${ context.id }-parent-state` }>{ context.parentState || 'null' }</p>
                    { map( context.innerChains, ( state, id ) => (
                        <div id={ `inner-${ id }` } key={ id }>
                            <p className="inner-chain-state">{ state }</p>
                        </div>
                    ) ) }
                </React.Fragment>
            ) }
        </ChainContext.Consumer>
    );

    it( 'Enters parent-first and exits parent-first', async () => {
        const { container, rerender } = render(
            <Chain id="test3" in timeout={ 500 }>
                <Context />
                <InnerChain id="test4" timeout={ 1000 }>
                    <Context />
                </InnerChain>
            </Chain>
        );

        const parentState = container.querySelector( '.test3-state' );
        const childState = container.querySelector( '.test4-state' );
        expect( parentState && childState ).toBeTruthy();
        await wait( () => expect( parentState.innerHTML ).toMatch( /entered/ ) );
        expect( childState.innerHTML ).toMatch( /exited|entering/ );

        rerender(
            <Chain id="test3" timeout={ 500 }>
                <Context />
                <InnerChain id="test4" timeout={ 1000 }>
                    <Context />
                </InnerChain>
            </Chain>
        );

        await( () => expect( parentState.innerHTML ).toMatch( /exited/ ) );
        expect( childState.innerHTML ).toMatch( /entering/ );
    } );

    it( 'Enters parent-first and exits parent-last', async () => {
        const { container, rerender } = render(
            <Chain id="test3" order="filo" in timeout={ 500 }>
                <Context />
                <InnerChain id="test4" timeout={ 1000 }>
                    <Context />
                </InnerChain>
            </Chain>
        );

        const parentState = container.querySelector( '.test3-state' );
        const childState = container.querySelector( '.test4-state' );
        expect( parentState && childState ).toBeTruthy();
        await wait( () => expect( parentState.innerHTML ).toMatch( /entering|entered/ ) );
        expect( childState.innerHTML ).toMatch( /exited/ );
        await wait( () => expect( childState.innerHTML ).toMatch( /entered/ ) );

        rerender(
            <Chain id="test3" order="filo" timeout={ 500 }>
                <Context />
                <InnerChain id="test4" timeout={ 1000 }>
                    <Context />
                </InnerChain>
            </Chain>
        );

        expect( childState.innerHTML ).toMatch( /exiting/ );
        expect( parentState.innerHTML ).toMatch( /entered/ );
    } );

    it( 'Enters parent-last and exits parent-first', async () => {
        const { container, rerender } = render(
            <Chain id="test3" order="lifo" in timeout={ 1000 }>
                <Context />
                <InnerChain id="test4" timeout={ 500 }>
                    <Context />
                </InnerChain>
            </Chain>
        );

        const parentState = container.querySelector( '.test3-state' );
        const childState = container.querySelector( '.test4-state' );
        expect( parentState && childState ).toBeTruthy();
        expect( childState.innerHTML ).toMatch( /entering/ );
        expect( parentState.innerHTML ).toMatch( /exiting|exited/ );
        await wait( () => expect( parentState.innerHTML ).toMatch( /entered/ ) );

        rerender(
            <Chain id="test3" order="lifo" timeout={ 1000 }>
                <Context />
                <InnerChain id="test4" timeout={ 500 }>
                    <Context />
                </InnerChain>
            </Chain>
        );

        expect( parentState.innerHTML ).toMatch( /exiting/ );
        expect( childState.innerHTML ).toMatch( /entered|exiting/ );
    } );

    it( 'Enters parent-last and exits parent-last', async () => {
        const { container, rerender } = render(
            <Chain id="test3" order="lilo" in timeout={ 1000 }>
                <Context />
                <InnerChain id="test4" timeout={ 500 }>
                    <Context />
                </InnerChain>
            </Chain>
        );

        const parentState = container.querySelector( '.test3-state' );
        const childState = container.querySelector( '.test4-state' );
        expect( parentState && childState ).toBeTruthy();
        expect( childState.innerHTML ).toMatch( /entering/ );
        expect( parentState.innerHTML ).toMatch( /exiting/ );
        await wait( () => expect( parentState.innerHTML ).toMatch( /entered/ ) );

        rerender(
            <Chain id="test3" order="lilo" timeout={ 1000 }>
                <Context />
                <InnerChain id="test4" timeout={ 500 }>
                    <Context />
                </InnerChain>
            </Chain>
        );

        expect( childState.innerHTML ).toMatch( /exiting/ );
        expect( parentState.innerHTML ).toMatch( /entered/ );
    } );
} );