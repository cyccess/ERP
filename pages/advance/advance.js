
Page({
  data: {

  },
  onLoad() {
    dd.setNavigationBar({ title: '垫付签批' });
  },
  agreeTap() {
    dd.confirm({
      title: '温馨提示',
      content: '您确定同意该垫付申请吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          dd.showToast({
            content: '申请已同意',
          });
        }
      },
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
