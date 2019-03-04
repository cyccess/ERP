Page({
  data: {
    url: ''
  },
  onLoad(options) {
    console.log(options)
    this.setData({ url: options.url });
  },
});
