
const numeral = require('../../util/numeral');
import moment from '../../util/moment.min';


Page({
  data: {
    tasks: [],
    proccessInfo: {},
    model: {},
    taskId: '',
    currentTask: {}
  },
  onShow() {
    // 页面显示
    console.log('show');
  },
  onLoad(options) {
    dd.setNavigationBar({ title: '垫付签批' });

    // options.id = 'ded74d9b-4a28-11e9-8cbb-30b49e2c7c0f';
    this.data.taskId = options.id;

    this.loadData();
  },

  loadData() {
    let { taskId } = this.data;
    const store = dd.getStorageSync({ key: "access_token" });
    dd.httpRequest({
      url: `http://192.168.1.187:3000/workflowmanagement/tasks/${this.data.taskId}`,
      headers: { "Authorization": store.data },
      method: 'GET',
      dataType: 'json',
      success: (res) => {
        console.log(res)
        if (res.status === 200 && res.data) {
          let tasks = res.data.tasks;
          // tasks = [...tasks, ...tasks, ...tasks];
          tasks.forEach(item => {

            // item.complatedDate = "2019-03-14T11:27:38.000+0000";
            // item.variables = [
            //   {
            //     name: 'taskInfo',
            //     value: {
            //       comment: '同意',
            //       userName: '成仁平'
            //     }
            //   }
            // ];
            item.createdDate = moment.format(item.createdDate, 'MM.DD hh:mm') || '';

            item.complatedDate = moment.format(item.completedDate, 'MM.DD hh:mm') || '';

            if (res.data.variables) {
              item.taskInfo = res.data.variables.find(v => v.name === 'taskInfo');
            }

            if (item.taskInfo) {
              let name = item.taskInfo.value.fullName;
              item.taskInfo.value.name = name.length > 3 ? name.substring(name.length - 2) : name;
            }
          });

          let currentTask = res.data.tasks.find(item => item.id === taskId);

          let proccessInfo = res.data.variables[0].value;

          if (proccessInfo.realName) {
            let name = proccessInfo.realName;
            proccessInfo.name = name.length > 3 ? name.substring(name.length - 2) : name;
          }

          const model = JSON.parse(proccessInfo.variables.recordApply);

          model.addTime = moment.format(model.addTime, 'YYYY-MM-DD hh:mm') || '';

          // 浙商垫付金额
          model.applyEscrowAmount = numeral(model.applyEscrowCapital + model.applyEscrowInterest).format('0,0.00');
          // 第三方垫付金额
          model.applyThirdAmount = numeral(model.applyThirdCapital + model.applyThirdInterest).format('0,0.00');
          // 垫付总金额
          model.totalPayAmount = numeral(model.applyEscrowCapital + model.applyEscrowInterest + model.applyThirdCapital + model.applyThirdInterest).format('0,0.00');

          // 浙商应还本息
          model.totalEscrowAmount = numeral(model.totalEscrowCapital + model.totalEscrowInterest).format('0,0.00');
          // 第三方应还本息
          model.totalThirdAmount = numeral(model.totalThirdCapital + model.totalThirdInterest).format('0,0.00');

          this.setData({ currentTask, tasks, model, proccessInfo });
        }
      },
      fail: function (res) {

      }
    });
  },

  refuseTap() {
    dd.confirm({
      title: '温馨提示',
      content: '您确定拒绝该垫付申请吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          dd.showToast({
            content: '下载成功',
          });
        }
      },
    });
  },
  previewPdf() {
    dd.navigateTo({
      url: '/pages/preview-pdf/preview-pdf?http://www.ddxlong.com/static/images/disclosure/%E5%90%88%E8%A7%84%E7%BB%8F%E8%90%A5%E5%AE%A1%E6%9F%A5%E6%8A%A5%E5%91%8A.pdf'
    })
  }
});
