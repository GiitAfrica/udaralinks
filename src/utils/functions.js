const charset =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const combinations = {
  alnum: charset,
  num: '01234556789',
  alpha: 'abcdefghijklmnopqrstuvwxyz',
};

const zero_padd_figure = figure =>
  figure < 10 && figure > -1 ? `0${figure}` : figure;

const format_date = date => {
  let _date = new Date(date);
  return `Date: ${zero_padd_figure(_date.getDate())}-${zero_padd_figure(
    _date.getMonth() + 1,
  )}-${zero_padd_figure(_date.getUTCFullYear())}`;
};

const format_time = time => {
  let _time = new Date(time);
  return `Time: ${zero_padd_figure(_time.getHours())} : ${zero_padd_figure(
    _time.getMinutes(),
  )}`;
};

const email_regex = email => {
  return !!email;
};

const sentence = text => {
  let index;
  for (let t = 0; t < text.length; t++) {
    if (combinations.alpha.includes(text[t].toLowerCase())) {
      index = t;
      break;
    }
  }
  text = text.split('');
  text[index] = text[index].toUpperCase();

  return text.join('');
};

const capitalise = text => {
  if (!text || typeof text !== 'string') return text;

  let text_split = text.split(' ');
  for (let t = 0; t < text_split.length; t++)
    text_split[t] = sentence(text_split[t]);

  return text_split.join(' ');
};

export {
  zero_padd_figure,
  format_date,
  format_time,
  email_regex,
  sentence,
  capitalise,
};
