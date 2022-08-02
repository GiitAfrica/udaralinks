import React from 'react';
import {wp} from '../utils/dimensions';
import Fr_text from './Fr_text';

const List_empty = ({text}) => (
  <Fr_text centralise size={wp(5)} color={'#aaa'} style={{margin: wp(6.2)}}>
    {text}
  </Fr_text>
);

export default List_empty;
