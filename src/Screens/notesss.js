<Bg_view no_bg>
  <Fr_text accent bold size={wp(5.6)} style={{fontFamily: 'font2.ttf'}}>
    Buy/Sell Currency
  </Fr_text>
  <Bg_view
    no_bg
    style={{
      justifyContent: 'space-evenly',
      marginVertical: hp(4),
    }}
    horizontal>
    {this.payment_types.map(payment_type => (
      <Bg_view
        key={payment_type.title}
        style={{
          paddingLeft: wp(4),
          paddingRight: wp(5.6),
          paddingVertical: hp(1.4),
          alignItems: 'flex-start',
          borderRadius: wp(4),
          minWidth: wp(24),
          elevation: 10,
          shadowColor: '#000',
        }}>
        <Icon icon={payment_type.icon} style={{height: wp(7), width: wp(7)}} />
        <Fr_text capitalise size={wp(4)} style={{marginVertical: hp(0.7)}}>
          {payment_type.title}
        </Fr_text>
      </Bg_view>
    ))}
  </Bg_view>
  <Bg_view
    style={{
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: hp(1.4),
      borderRadius: wp(4),
      elevation: 10,
      shadowColor: '#000',
    }}
    horizontal>
    <Bg_view no_bg />
    <Fr_text size={wp(4)}>All payment methods</Fr_text>
    <Icon icon="forward_arrow_icon.png" style={{marginLeft: wp(2.8)}} />
  </Bg_view>
</Bg_view>;

// Market stuff
