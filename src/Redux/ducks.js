import { produce } from 'immer';
import { getMaxPoints, suitePoints, gameStatus } from './gameLogic';

/********************************
 *Actions 
 */
const NEW_ROUND = 'NEW_ROUND';
const HIT = 'HIT';
const STAND = 'STAND';


/********************************
 *Dispatchers
 */
export const newRound = () => (dispatch, getState) => {
  let { deckId } = getState();
  if (!deckId) {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then(res => res.json())
    .then((result) => newRoundDraw(dispatch, result.deck_id));
  }
  else newRoundDraw(dispatch, deckId);
};

const newRoundDraw = (dispatch, deckID) => {
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`)
  .then(res => res.json())
  .then((result) => {
    let { cards, deck_id } = result;
    let housePoints = [];
    let houseCards = [];
    let playerPoints = [];
    let playerCards = [];
    for (let i = 0; i < 2; i++) {
      housePoints.push(suitePoints(cards[i].value));
      houseCards.push(cards[i].image);
    }
    for (let i = 2; i < 4; i++) {
      playerPoints.push(suitePoints(cards[i].value));
      playerCards.push(cards[i].image);
    }
  
    dispatch({
      type: NEW_ROUND,
      deckId: deck_id,
      housePoints,
      houseCards,
      playerPoints,
      playerCards,
      gameStatus: gameStatus.dealt
    });
  });
} 

export const hit = () => (dispatch, getState) => {
  let { deckID } = getState();
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
  .then(res => res.json())
  .then((result) => {
    let { cards } = result;
    dispatch({type: HIT, card: cards[0]});
  });
};
export const stand = () => ({type: STAND});


/********************************
 *Reducers
 */
const reducers = {
  [NEW_ROUND]:(draft, {deckId, houseCards, playerCards, housePoints, playerPoints, gameStatus})=> {
    if (!draft.deckID) draft.deckID = deckId;
    draft.houseCards = houseCards;
    draft.playerCards = playerCards;
    draft.housePoints = housePoints;
    draft.playerCards = playerCards;
    draft.playerPoints = playerPoints;
    draft.gameStatus = gameStatus;
  },
  [HIT]: (draft, {card}) => {
    draft.playerCards.push(card.image);
    draft.playerPoints.push(suitePoints(card.value));
    let [house, player] = getMaxPoints(draft.housePoints, draft.playerPoints);
    if (player > 21) {
      draft.gameStatus = gameStatus.lose;
    }
    else if (player === 21 || player >= house)
      draft.gameStatus = gameStatus.win;
  },
  [STAND]: (draft) => {
    let [house, player] = getMaxPoints(draft.housePoints, draft.playerPoints);
    draft.gameStatus = player >= house ? gameStatus.win : gameStatus.lose;
  }
}

const defaultState = {
  houseCards: [],
  playerCards: [],
  housePoints: [],
  playerPoints: [],
  deckId: undefined,
  gameStatus: gameStatus.fresh,
};

export const reducer = (state= defaultState, action) => {
  let { type } = action;
  return reducers[type] ? produce(state, draft => {
      reducers[type](draft, action);
    }) : state;
}