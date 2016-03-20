var Helper = {
  api: axios.create({
    baseURL: 'http://192.168.99.100:7000/api/dapps/14987880747134810888/api/'
  })
};

riot.mixin('Helper', Helper);
riot.mount('app');
riot.route.start(true);