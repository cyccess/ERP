Page({
  data: {
    url: ''
  },
  onLoad(options) {
    console.log(options)

    //options.url = 'http://www.ddxlong.com/static/images/disclosure/%E5%90%88%E8%A7%84%E7%BB%8F%E8%90%A5%E5%AE%A1%E6%9F%A5%E6%8A%A5%E5%91%8A.pdf'
    this.setData({ url: options.url });
  },
});
