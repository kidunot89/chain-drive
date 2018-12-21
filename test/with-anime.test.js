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

describe( 'chained Higher-Order-Component', async () => {
    afterEach( cleanup );

    it( 'runs the animation upon mounting TestChain component', async() => {
        const TestChain = withAnimeJs( React.forwardRef( ( { animeRef, context: c, id, ...r }, ref ) => (
            <h1 ref={ ref } { ...r} data-testid="test">
                <ChainContext.Consumer>
                    { context => (
                        <React.Fragment>
                            <p className="state">{ context.state }</p>
                            <p className="enter-timeout">{ context.timeout().enter }</p>
                            <p className="exit-timeout">{ context.timeout().exit }</p>
                        </React.Fragment>
                    ) }
                </ChainContext.Consumer>
            </h1>
        ) ) );

        const { getByText, getByTestId, rerender, container } = render(
            <Chain id="test-unit" in>
                <TestChain
                    id="test-h1"
                    initial={ { opacity: 0 } }
                    entering={ {
                        opacity: 1,
                        duration: 50,
                    } }
                    exiting={ {
                        opacity: 0,
                        duration: 100,
                    } }
                />
            </Chain>
        );
        await wait( () => expect( getByTestId( /test/ ).getAttribute( 'style' ) ).toEqual( 'opacity: 0;' ) );
        await wait( () => expect( getByText( /entering|entered/ ) ).toBeTruthy() );

        rerender( 
            <Chain id="test-unit" in>
                <TestChain
                    id="test-h1"
                    initial={ { opacity: 0 } }
                    entering={ {
                        opacity: 1,
                        duration: 50,
                    } }
                    exiting={ {
                        opacity: 0,
                        duration: 100,
                    } }
                />
            </Chain> 
        );
        await wait( () => expect( getByText( /50/ ) ).toBeTruthy() );
        await wait( () => expect( getByText( /100/ ) ).toBeTruthy() );
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
            React.forwardRef( ( { animeRef, context, children, ...r }, ref ) => {
                if ( context.state === 'entered' || context.state === 'exited' ) {
                    return <p ref={ ref } { ...r }>{ children }</p>
                }
        
                return (
                    <p ref={ ref } { ...r }>
                        { map( children, ( letter, i ) => {
                            return /\S/g.test( letter ) ? 
                                ( <span key={ `letter-${ i }` } className="letter">{ letter }</span> ):
                                letter; 
                        } ) }
                    </p> 
                );  
            }
        ) );
    
        const { getByText, rerender } = render(
            <Chain id="test-unit" appear in>
                <TestChain
                    id="test-phrase"
                    entering={ [
                        {
                            opacity: [ 0, 1 ],
                            duration: 550,
                        },
                        {
                            targets: '.letter',
                            opacity: [ 0, 1 ],
                            duration: 1000,
                            elasticity: 600,
                            delay: ( _, i ) => 45 * ( i + 1 ),
                        }
                    ] }
                    exiting={ [
                        {
                            opacity: [ 0 ],
                            duration: 350,
                            delay: 650,
                        },
                        {
                            targets: '.letter',
                            opacity: [ 1, 0 ],
                            duration: 650,
                            delay: ( _, i, len ) => 45 * ( len - i ),
                        }
                    ] }
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
                        {
                            opacity: [ 0, 1 ],
                            duration: 550,
                        },
                        {
                            targets: '.letter',
                            opacity: [ 0, 1 ],
                            duration: 1000,
                            elasticity: 600,
                            delay: ( _, i ) => 45 * ( i + 1 ),
                        }
                    ] }
                    exiting={ [
                        {
                            opacity: [ 0 ],
                            duration: 350,
                            delay: 650,
                        },
                        {
                            targets: '.letter',
                            opacity: [ 1, 0 ],
                            duration: 650,
                            delay: ( _, i, len ) => 45 * ( len - i ),
                        }
                    ] }
                >Test</TestChain>
            </Chain>
        );
    
        await wait( () => expect( getByText( /Test/ ) ).toBeTruthy() );
        expect( getByText( /Test/ ).getAttribute( 'style' ) ).toEqual( 'opacity: 0;' );
    } );
} );
