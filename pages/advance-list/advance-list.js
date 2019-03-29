
import moment from '../../util/moment.min'
import { host } from '../../config';

Page({
  data: {
    itemWidth: 0,
    height: 0,
    inkBar: 0,
    currentTabIndex: 0,
    list: [],
    page: 1,
    isLoading: false,
    noData: ''
  },
  onShow() {
    let { data } = dd.getStorageSync({ key: 'signed' });
    // 如果有已签批的，刷新列表数据
    if (data) {
      let index = this.data.list.findIndex(item => { return item.taskId == data.taskId })
      if (index > -1) {
        this.data.list.splice(index, 1);
      }

      if (this.data.list.length === 0) {
        this.setData({ noData: '没有审批单' });
      }

      dd.removeStorage({ key: 'signed' });
      this.setData({ list: this.data.list });
    }
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
    if (this.data.noData) return;

    this.data.page += 1;
    this.loadData(this.data.currentTabIndex);
  },
  loadData(type = 0) {
    this.setData({ isLoading: true });

    let store = dd.getStorageSync({ key: "access_token" });
    let url = `${host}/workflowmanagement/tasks/handsign/dianfu?page=${this.data.page}&size=10`;

    // 已签批
    if (type == 1) {
      url = `${host}/handsign/dianfu/complete?page=${this.data.page}&size=10`;
    }

    dd.httpRequest({
      headers: { "Authorization": store.data },
      url: url,
      success: (res) => {
        setTimeout(() => {
          this.setData({ isLoading: false });
          if (res.status === 200 && res.data.code === 0 && res.data.data) {
            let newPage = res.data.data.content.map(item => {
              let dateStr = type == 0 ? item.createdDate : item.addTime;
              return {
                taskId: item.taskId,
                processTitle: item.processTitle || item.name,
                date: moment.formatDate(dateStr, 'YYYY-MM-DD'),
                status: item.status
              };
            });

            if (newPage.length > 0) {
              let list = this.data.list.concat(newPage);
              this.setData({ list });
            }

            if (newPage.length < 10) {
              this.setData({ noData: 'noMoreData' });
            }

            if (this.data.list.length === 0)
              this.setData({ noData: '没有审批单' });
          }
        }, 500)
      },
      fail: (res) => {
        this.setData({ isLoading: false, noData: '请求出错' });
        console.log('请求出错:' + JSON.stringify(res));
      }
    });
  },
  onSelectTab(e) {
    var index = e.target.dataset.index;
    if (this.data.currentTabIndex == index) return;
    var bar = index * this.data.itemWidth;
    this.setData({ currentTabIndex: index, inkBar: bar, page: 1, noData: '', list: [] });
    this.loadData(index);
  }
});
