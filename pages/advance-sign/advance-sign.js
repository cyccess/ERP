// canvas 全局配置
var context = null;// 使用 wx.createContext 获取绘图上下文 context
var points = [];

Page({
  data: {
    pageWidth: 0,
    pageHeight: 0,
    canvasWidth: 0,
    canvasHeight: 300,
    pixelRatio: 0,
    isSign: false, //是否已签字
    taskId: 'ded74d9b-4a28-11e9-8cbb-30b49e2c7c0f',
    comment: '同意', // 审批意见
    approve: true // 是否同意
  },
  onLoad(options) {

    // this.data.taskId = options.task_id
  },
  onReady() {
    dd.createSelectorQuery()
      .selectViewport()
      .boundingClientRect()
      .exec((ret) => {
        this.data.canvasWidth = ret[0].width;
        this.data.canvasHeight = ret[0].height;
      });


    context = dd.createCanvasContext('canvas');
    context.beginPath()
    context.setStrokeStyle('#000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.setShadow(0, 0, 0.1, '#000');
  },
  canvasStart(event) {
    let point = { x: event.changedTouches[0].x, y: event.changedTouches[0].y };
    points.push(point);

    this.data.isSign = true;
  },
  canvasMove(e) {
    let point = { x: e.touches[0].x, y: e.touches[0].y };
    points.push(point);
    if (points.length >= 2) {
      this.draw(points);
    }
  },
  canvasEnd(event) {
    //清空轨迹数组
    for (let i in points) {
      points.pop();
    }
  },

  draw: function (points) {
    let point1 = points[0];
    let point2 = points[1];
    points.shift();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);

    context.stroke();
    context.draw(true);
  },
  cleardraw() {
    //清除画布
    context.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
    context.beginPath();
    context.draw();
    this.data.isSign = false;
  },
  submit() {
    if (!this.data.isSign) {
      dd.showToast({ content: '请签字' });
      return;
    }

    let { taskId, comment, approve } = this.data;

    let store = dd.getStorageSync({ key: "access_token" });

    this.uploadFile().then((res) => {
      console.log(res);
      dd.httpRequest({
        url: `http://192.168.1.187:3000/handsign/handsign/${taskId}/complete`,
        method: 'POST',
        headers: {
          "Authorization": store.data,
          'Content-Type': 'application/json'
        },
        data: { taskId, comment, approve },
        dataType: 'json',
        success: function (res) {
          console.log('签批已提交');
          dd.navigateBack();
        },
        fail: function (res) {
          console.log(res)
        }
      });
    }).catch((res) => {
      console.log(res);
    });
  },
  uploadFile() {
    return new Promise((resolve, reject) => {
      let { taskId } = this.data;
      context.toTempFilePath({
        success(res) {
          console.log(res);
          let store = dd.getStorageSync({ key: "access_token" });
          dd.uploadFile({
            url: `http://192.168.1.187:3000/handsign/handsign/${taskId}/attachment`,
            fileType: 'image',
            fileName: 'file',
            filePath: res.apFilePath,
            headers: {
              "Authorization": store.data,
            },
            success: (res) => {
              resolve(res);
              console.log('success');
            },
            fail: (res) => {
              reject('上传失败');
              console.log("fail:");
            },
          });
        }
      });
    });
  },
  getComment(e) {
    var val = e.detail.value;
    this.setData({ comment: val });
  }
});