let domain = `http://${false ? '192.168.43.243' : '10.0.2.2'}:3600`;

const flip_domain = () =>
  domain === 'http://192.168.43.243:3600'
    ? 'http://10.0.2.2:3600'
    : 'http://192.168.43.243:3600';

const get_request = async path => {
  console.log(path);
  if (path && path.startsWith('/')) path = path.slice(1);
  try {
    let ftch = await fetch(`${domain}/${path}`);
    let res;
    try {
      res = await ftch.json();
    } catch (e) {
      return {_$not_sent: true};
    }

    return res && res.data;
  } catch (e) {
    console.log(e, domain);
    domain = flip_domain();
    return get_request(path);
  }
};

const post_request = async (path, data) => {
  console.log(path);
  if (path && path.startsWith('/')) path = path.slice(1);
  try {
    let ftch = await fetch(`${domain}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: data && JSON.stringify(data),
    });

    let res;
    try {
      res = await ftch.json();
    } catch (e) {
      return {_$not_sent: true};
    }

    return res && res.data;
  } catch (e) {
    console.log(e, domain);
    domain = flip_domain();
    return post_request(path, data);
  }
};

export {post_request, get_request, domain};
