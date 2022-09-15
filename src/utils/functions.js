const charset =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const combinations = {
  alnum: charset,
  num: '01234556789',
  alpha: 'abcdefghijklmnopqrstuvwxyz',
};

const gen_random_int = (max_int, min_int = 0) =>
  min_int + Math.floor(Math.random() * max_int);

const generate_random_string = (len = 6, combination = 'num') => {
  let string = '';
  combination = combinations[combination];
  for (let i = 0; i < len; i++)
    string += combination[gen_random_int(combination.length)];

  return string;
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

const format_quick_time = timestamp => {
  let time = new Date(timestamp);
  let this_time = new Date();

  let minute = 60 * 1000,
    hour = minute * 60,
    days = hour * 24;

  let time_diff = this_time - time;
  if (time_diff >= days) return `${Math.floor(time_diff / days)} days ago`;
  else if (time_diff >= hour)
    return `${Math.floor(time_diff / hour)} hours ago`;
  else if (time_diff >= minute)
    return `${Math.floor(time_diff / minute)} minutes ago`;
  else return 'Just now';
};

let phone_regex =
  /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;

let email_regex =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const validate_phone = phone => phone_regex.test(phone);

const validate_email = email => email_regex.test(email);

export {
  zero_padd_figure,
  format_date,
  format_time,
  phone_regex,
  email_regex,
  sentence,
  capitalise,
  validate_email,
  validate_phone,
  format_quick_time,
  generate_random_string,
};
