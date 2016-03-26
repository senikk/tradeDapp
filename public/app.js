var Helper = {
  api: axios.create({
    baseURL: 'http://192.168.99.100:7000/api/dapps/11911635833721108503/api/'
  }),
  event: riot.observable(),
  modal: function (element) {
  	var self = this;
    this.isModal = true;
    $(element).openModal({
        dismissible: true,
        opacity: .65,
        in_duration: 250,
        out_duration: 250,
        complete: function () { 
            $('.lean-overlay').remove(); 
            self.isModal = false;
            self.update();
        }
    });
  },
  setAddress: function (address) {
  	Object.assign(this.address, address);
  	this.update();
  },
  clearAddress: function () {
  	for (var field in this.address) delete this.address[field];
  	this.update();
  },
  address: {},
  login: {},
  isModal: false
};

riot.mixin('Helper', Helper);
riot.mount('app');
riot.route.start(true);