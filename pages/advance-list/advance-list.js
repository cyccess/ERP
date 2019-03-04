Page({
  data: {
    itemWidth: 0,
    inkBar: 0,
    currentTabIndex: 0,
    list: [
      {
        name: "小成时光提交的垫付",
        date: "2019-02-12",
        status: "待签批"
      },
      {
        name: "小成时光提交的垫付",
        date: "2019-02-12",
        status: "待签批"
      }, {
        name: "小成时光提交的垫付",
        date: "2019-02-12",
        status: "待签批"
      }, {
        name: "小成时光提交的垫付",
        date: "2019-02-12",
        status: "待签批"
      }, {
        name: "小成时光提交的垫付",
        date: "2019-02-12",
        status: "待签批"
      }, {
        name: "小成时光提交的垫付",
        date: "2019-02-12",
        status: "待签批"
      }, {
        name: "小成时光提交的垫付",
        date: "2019-02-12",
        status: "待签批"
      }, {
        name: "小成时光提交的垫付",
        date: "2019-02-12",
        status: "待签批"
      }, {
        name: "小成时光提交的垫付",
        date: "2019-02-12",
        status: "待签批"
      }, {
        name: "小成时光提交的垫付",
        date: "2019-02-12",
        status: "待签批"
      }
    ]
  },
  onLoad() {

  },
  onReady() {
    dd.createSelectorQuery()
      .select('.m-tabs').boundingClientRect()
      .exec((ret) => {
        var width = ret[0].width / 2;
        this.setData({ itemWidth: width });
      });
  },
  onReachBottom() {

    console.log('加载更多...')

  },
  onSelectTab(e) {
    var index = e.target.dataset.index;
    var bar = index * this.data.itemWidth;
    this.setData({ currentTabIndex: index, inkBar: bar });
  }
});
