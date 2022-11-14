import React from 'react';
import {TextInput} from 'react-native';
import {hp, wp} from '../utils/dimensions';
import Bg_view from './Bg_view';
import Icon from './Icon';

const Search_input = ({
  search_value,
  no_autofocus,
  placeholder,
  set_search_value,
  clear_search,
  style,
}) => {
  return (
    <Bg_view
      style={{
        borderRadius: wp(2.8),
        height: hp(7.5),
        marginHorizontal: wp(5.6),
        alignItems: 'center',
        paddingHorizontal: wp(2.8),
        elevation: 10,
        shadowColor: '#000',
        marginBottom: hp(2.8),
        ...style,
      }}
      horizontal>
      <TextInput
        onChangeText={set_search_value}
        value={search_value}
        style={{flex: 1, paddingRight: wp(2.8), color: '#000'}}
        autoFocus={!no_autofocus}
        placeholder={placeholder || 'Search...'}
      />
      <Icon
        icon={search_value ? 'close_icon.png' : 'search_icon.png'}
        action={clear_search}
      />
    </Bg_view>
  );
};

export default Search_input;
