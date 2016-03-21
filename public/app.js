var Helper = {
  api: axios.create({
    baseURL: 'http://192.168.99.100:7000/api/dapps/4754919274057023019/api/'
  })
};

riot.mixin('Helper', Helper);
riot.mount('app');
riot.route.start(true);