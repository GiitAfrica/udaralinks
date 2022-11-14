import React from 'react';
import {wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Fr_text from './Fr_text';

const List_empty = ({text, style, data}) => (
  <Bg_view no_bg style={{...style}}>
    <Fr_text italic centralise size={wp(5)} style={{margin: wp(7.5)}}>
      {text || 'Nothing'}
    </Fr_text>
    {data}
  </Bg_view>
);

export default List_empty;
