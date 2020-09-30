import React from 'react';
import { connect } from 'react-redux';
import { gameStatus } from '../Redux/gameLogic';

import { Player } from './Player';
import { Choices } from './Choices';

const Component = ({house, player, status}) =>
  <div className="table">
    {status !== gameStatus.fresh && <Player title={'House'} cards={house}/>}

    <h1>
      { status === gameStatus.win && 'You Win' }
      { status === gameStatus.lose && 'You Lose' }
    </h1>
    <Choices status={status}/>
    {status !== gameStatus.fresh && <Player title={'Player'} cards={player}/>}
  </div>

const mapStateToProps = (state) => ({
  house: state.houseCards,
  player: state.playerCards,
  status: state.gameStatus
});


export const Table = connect(mapStateToProps)(Component);