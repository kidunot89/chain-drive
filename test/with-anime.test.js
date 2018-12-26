/**
 * External dependencies
 */
import React from 'react';
import { map } from 'lodash';
import { cleanup, render, waitForElement, wait } from 'react-testing-library';

/**
 * Internal dependencies
 */
import { Chain, ChainContext, withAnimeJs } from '../src';

describe( 'withAnimeJs Higher-Order-Component', async () => {
    afterEach( cleanup );

    it( 'runs animation based off "state" prop', async () => {
        const Test = withAnimeJs(
            React.forwardRef(
                ( { animeRef, context: c, ...r }, ref ) => ( <p ref={ ref } { ...r } /> )
            )
        );

        const { getByText, rerender } = render(
            <Test
                id="test"
                state="enter"
                enter={ {
                    opacity: 1,
                    duration: 1000,
                } }
                exit={ {
                    opacity: 0,
                    duration: 1500,
                } }
            >
                Hello World!!
            </Test>
        );

        const element = getByText( /Hello World!!/ );
        expect( element ).toBeTruthy();
        await wait( () => expect( element.getAttribute( 'style' ) ).toEqual( 'opacity: 1;') );

        rerender(
            <Test
                id="test"
                state="exit"
                enter={ {
                    opacity: 1,
                    duration: 1000,
                } }
                exit={ {
                    opacity: 0,
                    duration: 1500,
                } }
            >
                Hello World!!
            </Test>
        );
        await wait( () => expect( element.getAttribute( 'style' ) ).toEqual( 'opacity: 0;') );
    } )

    it( 'runs animations with "state" prop being managed by parent Chain component', async() => {
        const Test = withAnimeJs(
            React.forwardRef( 
                ( { animeRef, context: c, ...r }, ref ) => ( <p ref={ ref } { ...r} /> )
            )
        );

        const { getByText, rerender } = render(
            <Chain id="test-unit" appear in>
                <Test
                    id="test"
                    entering={ {
                        opacity: 1,
                        duration: 1000,
                    } }
                    exiting={ {
                        opacity: 0,
                        duration: 1500,
                    } }
                    exited={ { opacity: 0 } }
                >
                    Hello World!!
                </Test>
            </Chain>
        );
        const element = getByText( /Hello World!!/ );
        expect( element ).toBeTruthy();
        await wait( () => expect( element.getAttribute( 'style' ) ).toEqual( 'opacity: 1;') );

        rerender( 
            <Chain id="test-unit" appear in={ false }>
                <Test
                    id="test"
                    entering={ {
                        opacity: 1,
                        duration: 1000,
                    } }
                    exiting={ {
                        opacity: 0,
                        duration: 1500,
                    } }
                    exited={ { opacity: 0 } }
                >
                    Hello World!!
                </Test>
            </Chain> 
        );
        await wait( () => expect( element.getAttribute( 'style' ) ).toEqual( 'opacity: 0;') );
    } );

    it( `animates element targeted upon mounting TestChain component 
    then exits without any changes to component`, async () => {
        const TestChain = withAnimeJs(
            React.forwardRef( ( { animeRef, context, id, ...r }, ref ) => (
                <h1 ref={ ref } { ...r}>
                    Test progress <span data-testid="progress" className="progress">0%</span>
                </h1>
            )
        ) );

        const { getByTestId, rerender } = render(
            <Chain id="test-unit" appear in>
                <TestChain
                    id="test-h1"
                    entering={ {
                        targets: ".progress",
                        duration: 600,
                        easing: "easeOutExpo",
                        update: ( { progress }, target ) => {
                            target[ 0 ].innerHTML = `${ Math.round( progress ) }%`;
                        },
                    } }
                />
            </Chain>
        );
        const progress = await waitForElement( () => getByTestId( /progress/ ) );
        expect( progress ).toBeTruthy();
        expect( progress.innerHTML ).toEqual( '0%' );
        await wait( () => expect( progress.innerHTML ).toEqual( '100%' ) );

        rerender(
            <Chain id="test-unit" appear in={ false }>
                <TestChain
                    id="test-h1"
                    entering={ {
                        targets: ".progress",
                        duration: 600,
                        easing: "easeOutExpo",
                        update: ( { progress }, target ) => {
                            target.innerHTML = `${ Math.round( progress ) }%`;
                        },
                    } }
                />
            </Chain>
        );

        expect( progress.innerHTML ).toEqual( '100%' );
    } );

    it( 'animates multiple elements', async () => {
        const TestChain = withAnimeJs(
            React.forwardRef(
                ( { animeRef, context, state, children, ...r }, ref ) => (
                    <p ref={ ref } { ...r }>
                        { state === 'exited' ?
                            children :
                            map( children, ( char, i ) => {
                                return /\S/g.test( char ) ? 
                                    ( <span key={ `letter-${ i }` } className="letter">{ char }</span> ):
                                    char; 
                            } ) }
                    </p>
                )
            )
        );
    
        const { getByText, rerender } = render(
            <Chain id="test-unit" appear in>
                <TestChain
                    id="test-phrase"
                    entering={ [
                        { opacity: 1 },
                        {
                            targets: '.letter',
                            opacity: 1,
                            duration: 1000,
                            elasticity: 600,
                            delay: ( _, i ) => 45 * ( i + 1 ),
                        }
                    ] }
                    exiting={ {
                        targets: '.letter',
                        opacity: 0,
                        duration: 650,
                        delay: ( _, i, len ) => 45 * ( len - i ),
                    } }
                    exited={ { opacity: 0 } }
                >Test</TestChain>
            </Chain>
        );
    
        await wait( () => expect( getByText( /^T$/ ) ).toBeTruthy() );
        await wait( () => expect( getByText( /^e$/ ) ).toBeTruthy() );
        await wait( () => expect( getByText( /^s$/ ) ).toBeTruthy() );
        await wait( () => expect( getByText( /^t$/ ) ).toBeTruthy() );
        wait( () => expect( getByText( /^t$/ ).getAttribute( 'style' ) ).toEqual( 'opacity: 1;' ) );
        
        rerender( 
            <Chain id="test-unit" appear in={ false }>
                <TestChain
                    id="test-phrase"
                    entering={ [
                        { opacity: 1 },
                        {
                            targets: '.letter',
                            opacity: 1,
                            duration: 1000,
                            elasticity: 600,
                            delay: ( _, i ) => 45 * ( i + 1 ),
                        }
                    ] }
                    exiting={ {
                        targets: '.letter',
                        opacity: 0,
                        duration: 650,
                        delay: ( _, i, len ) => 45 * ( len - i ),
                    } }
                    exited={ { opacity: 0 } }
                >Test</TestChain>
            </Chain>
        );
    
        await wait( () => expect( getByText( /Test/ ) ).toBeTruthy() );
        await wait( () => expect( getByText( /Test/ ).getAttribute( 'style' ) ).toEqual( 'opacity: 0;' ) );
    } );
} );
