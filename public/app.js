var Helper = {
  api: axios.create({
    baseURL: 'http://192.168.99.100:7000/api/dapps/11911635833721108503/api/'
  }),
  address: {},
  login: {}
};

riot.mixin('Helper', Helper);
riot.mount('app');
riot.route.start(true);