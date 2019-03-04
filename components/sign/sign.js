// canvas 全局配置
var context = null;// 使用 wx.createContext 获取绘图上下文 context
var points = [];

Component({
  mixins: [],
  data: {
    context: '',
    points: [],
    canvasWidth: 0,
    canvasHeight: 200,
  },
  props: {},
  didMount() {

    dd.getSystemInfo({
      success: (res) => {
        this.setData({
          canvasWidth: res.windowWidth - 30
        })
      }
    });

    context = dd.createCanvasContext('canvas');
    context.beginPath()
    context.setStrokeStyle('#333333');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
  },
  didUpdate() { },
  didUnmount() { },
  methods: {
    canvasStart(event) {
      let point = { x: event.changedTouches[0].x, y: event.changedTouches[0].y };
      points.push(point);
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
    },
  },
});
