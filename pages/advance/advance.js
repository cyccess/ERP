
const numeral = require('../../util/numeral');
import moment from '../../util/moment.min';
import { host } from '../../config';
import animModal from '/util/modal';

Page({
  ...animModal.animOp,
  data: {
    ...animModal.data,
    hidden: true,
    tasks: [],
    proccessInfo: {},
    model: {},
    taskId: '',
    currentTask: {},
    comment: '',
    loading: false,
    submitting: false,
  },
  onShow() {
    // 页面显示
    let { data } = dd.getStorageSync({ key: 'signed' });
    console.log(data)
    if (data) {
      this.loadData();
    }
  },
  onLoad(options) {
    dd.setNavigationBar({ title: '垫付审批' });
    this.data.taskId = options.id;
    this.loadData();
  },

  loadData() {
    this.setData({ loading: !this.data.loading });
    let { taskId } = this.data;
    const store = dd.getStorageSync({ key: "access_token" });
    dd.httpRequest({
      url: `${host}/workflowmanagement/tasks/${this.data.taskId}`,
      headers: { "Authorization": store.data },
      success: (res) => {
        console.log(res)
        if (res.status === 200 && res.data.code === 0) {
          let data = res.data.data;
          let tasks = data.tasks;
          tasks.forEach(item => {

            item.createdDate = moment.formatDate(item.createdDate, 'MM.DD hh:mm') || '';

            item.complatedDate = moment.formatDate(item.completedDate, 'MM.DD hh:mm') || '';

            if (data.variables) {
              item.taskInfo = data.variables.find(v => v.name === 'taskInfo');
            }

            if (item.taskInfo) {
              let name = item.taskInfo.value.fullName;
              item.taskInfo.value.name = name.length > 3 ? name.substring(name.length - 2) : name;
            }
          });

          let currentTask = data.tasks.find(item => item.id === taskId);

          let proccessInfo = data.variables[0].value;

          var a = { "title": "重庆兴农鑫电子商务有限公司还款业务申请表", "addTime": "2019-03-28T04:10:09.000+0000", "path": "/advance/dianfu/2019-03-28/3585.pdf" };
          proccessInfo.attachments = [a, a]


          if (proccessInfo.realName) {
            let name = proccessInfo.realName;
            proccessInfo.name = name.length > 3 ? name.substring(name.length - 2) : name;
          }

          const model = JSON.parse(proccessInfo.variables.recordApply);

          model.addTime = moment.formatDate(model.addTime, 'YYYY-MM-DD hh:mm') || '';

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
      fail: (res) => {
        dd.showToast({ type: 'fail', content: '数据加载失败' });
      },
      complete: () => {
        this.setData({ loading: !this.data.loading });
      }
    });
  },
  onOpenModalTap() {
    this.setData({ hidden: !this.data.hidden });
    this.createMaskShowAnim();
    this.createContentShowAnim();
  },
  onModalCloseTap() {
    this.createMaskHideAnim();
    this.createContentHideAnim();
    setTimeout(() => {
      this.setData({ hidden: true });
    }, 210);
  },
  onConfirmTap() {
    this.setData({ submitting: true });
    let store = dd.getStorageSync({ key: "access_token" });
    let { taskId, comment } = this.data;
    dd.httpRequest({
      url: `${host}/handsign/dianfu/${taskId}/complete`,
      method: 'POST',
      headers: {
        "Authorization": store.data,
        "Content-Type": 'application/json;charset=utf-8'
      },
      data: { taskId, comment, approve: false },
      dataType: 'json',
      success: (res) => {
        console.log('签批已提交:' + JSON.stringify(res));
        this.onModalCloseTap();
        dd.setStorageSync({
          key: 'signed',
          data: { taskId: taskId }
        });
        this.loadData();
      },
      fail: (res) => {
        this.setData({ submitting: false });
        dd.showToast({ type: 'exception', content: '提交失败' });
        console.log(JSON.stringify(res));
      }
    });
  },
  onCommentInput(e) {
    this.setData({ comment: e.detail.value });
  },
  previewPdf(e) {
    let attachment = e.target.dataset.attachment;
    dd.navigateTo({
      url: '/pages/preview-pdf/preview-pdf?url=' + decodeURI(attachment.path)
    });
  }
});
