export const getMaxPoints = (housePoints, playerPoints) => {
  let arr1 = [...housePoints].sort((a,b)=>b-a);
  let arr2 = [...playerPoints].sort((a,b)=>b-a);
  let reducer = (accum, num) => {
    if (num !== 'A') accum += num;
    else {
      accum = (accum + 10 > 21) ? accum + 1 : accum + 10;
    }
    return accum;
  }
  return [arr1.reduce(reducer, 0), arr2.reduce(reducer, 0)];
};

export const suitePoints = (card) => {
  if ( card === 'ACE') return 'A';
  else if ( card === 'KING' || card === 'QUEEN' || card === 'JACK') return 10;
  else return Number(card);
}

export const gameStatus = {
  fresh: 0,
  dealt: 1,
  win: 2,
  lose: 3,
};