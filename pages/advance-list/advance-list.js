
import moment from '../../util/moment.min'


Page({
  data: {
    itemWidth: 0,
    height: 0,
    inkBar: 0,
    currentTabIndex: 0,
    page: 1,
    list: [],
    isLoading: false,
    noData: false
  },
  onLoad() {
    this.loadData();
  },
  onReady() {
    dd.createSelectorQuery()
      .selectViewport().boundingClientRect()
      .exec((ret) => {
        var width = ret[0].width / 2;

        this.setData({ itemWidth: width, height: ret[0].height });
      });
  },
  onReachBottom() {
    // console.log('加载更多...')

    // if (this.data.currentTabIndex == 0) {
    //   this.data.page += 1;
    //   this.loadData();
    // }
  },
  loadData() {
    if (this.data.noData) return;

    let store = dd.getStorageSync({ key: "access_token" });
    this.setData({ isLoading: true });
    dd.httpRequest({
      headers: { "Authorization": store.data },
      url: `http://192.168.1.187:3000/workflowmanagement/tasks/handsign?page=${this.data.page}&size=10`,
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        console.log(res)
        if (res.status === 200 && res.data) {
          let newPage = res.data.content.map(item => {
            return {
              id: item.id,
              processTitle: item.processTitle,
              date: moment.format(item.createdDate, 'YYYY-MM-DD'),
              status: item.status
            };
          });

          let list = this.data.list.concat(newPage);

          let noMore = false;
          if (res.data.numberOfElements < 10) {
            noMore = true;
          }

          this.setData({ list, noData: noMore });
        }
      },
      fail: function (res) {
        console.log('请求出错')
        console.log(res)
      },
      complete: (res) => {
        setTimeout(() => {
          this.setData({ isLoading: false });
        })
      }
    });
  },
  onSelectTab(e) {
    var index = e.target.dataset.index;
    var bar = index * this.data.itemWidth;
    this.setData({ currentTabIndex: index, inkBar: bar });
  },
  lower() {
    console.log('加载更多...')

    if (this.data.currentTabIndex == 0) {
      this.data.page += 1;
      this.loadData();
    }
  },
});
