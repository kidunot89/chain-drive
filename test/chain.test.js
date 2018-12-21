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

describe( 'Chain component', () => {
    afterEach( cleanup );
    const Context = () => (
        <ChainContext.Consumer>
            { context => (
                <React.Fragment>
                    <p className={ `${ context.id }-id` }>{ context.id }</p>
                    <p className={ `${ context.id }-state` }>{ context.state }</p>
                </React.Fragment>
            ) }
        </ChainContext.Consumer>
    );

    it( 'transitions to \'exited\' on the Outer chain but transitions to \'entered\' state on InnerChain', async () => {
        const { container, rerender } = render(
            <Chain id="test1" timeout={ 45 } appear in={ false }>
                <Context />
                <InnerChain reverse id="test2">
                    <Context />
                </InnerChain>
            </Chain>
        );

        expect( container.querySelector( '.test1-id' ).innerHTML ).toEqual( 'test1' );
        await wait( () => expect( container.querySelector( '.test1-state' ).innerHTML ).toEqual( 'exited' ) );
        expect( container.querySelector( '.test2-id' ).innerHTML ).toEqual( 'test2' );
        await wait( () => expect( container.querySelector( '.test2-state' ).innerHTML ).toEqual( 'entered' ) );

        rerender(
            <Chain id="test1" timeout={ 45 } appear in>
                <Context />
                <InnerChain inOnEntering reverse id="test2">
                    <Context />
                </InnerChain>
            </Chain>
        );
        await wait( () => expect( container.querySelector( '.test1-state' ).innerHTML ).toEqual( 'entering' ) );
        expect( container.querySelector( '.test2-state' ).innerHTML ).toMatch( /exiting|exited/ );

        rerender(
            <Chain id="test1" timeout={ 45 } appear in={ false }>
                <Context />
                <InnerChain inOnEntering reverse id="test2">
                    <Context />
                </InnerChain>
            </Chain>
        );
        await wait( () => expect( container.querySelector( '.test1-state' ).innerHTML ).toEqual( 'exiting' ) );
        expect( container.querySelector( '.test2-state' ).innerHTML ).toMatch( /entering|entered/ );
    } );
} );