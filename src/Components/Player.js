import React from 'react';
import { Card } from './Card';

export const Player = ({cards, title}) =>
<div className="player">
  <h2 className="title">{title}</h2>
  <div className="area">
    { cards.map((card, i)=> <Card key={i} src={card}/>) }
  </div>
</div>