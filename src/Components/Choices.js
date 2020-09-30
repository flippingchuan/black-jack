import React from 'react';
import { connect } from 'react-redux';
import { newRound, hit, stand } from '../Redux/ducks';
import { gameStatus } from '../Redux/gameLogic';

export const Component = ({status, newRound, hit, stand}) => {
  return <div className="choices">
    {
      status === gameStatus.fresh &&
        <> 
          <h1>Start Game</h1>
          <button onClick={newRound}>Start</button>
        </>
    }
    {
      (status === gameStatus.win || status === gameStatus.lose) &&
      <button onClick={newRound}>Deal</button>
    }
    {status === gameStatus.dealt && <button onClick={hit}>Hit</button>}
    {status === gameStatus.dealt && <button onClick={stand}>Stand</button>}
  </div>;
}

const mapDispatchToProps = dispatch => ({
  newRound: () => dispatch(newRound()),
  hit: () => dispatch(hit()),
  stand: () => dispatch(stand())
});

export const Choices = connect( props => props, 
  mapDispatchToProps)(Component
);