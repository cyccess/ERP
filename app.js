App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');

    dd.getAuthCode({
      success: function (res) {
        console.log(res);
        dd.httpRequest({
          url: `http://192.168.1.187:3000/opentalk/gettoken?code=${res.authCode}&app=erp`,
          method: 'GET',
          dataType: 'json',
          success: function (res) {
            console.log(res)
            dd.setStorage({
              key: 'access_token',
              data: 'Bearer ' + res.data.KeycloakToken
            });
          },
          fail: function (res) {
            dd.alert("accessToken获取失败")
          }
        });
      },
      fail: function (err) {
        console.log(err);
        dd.alert("免登授权码获取失败")
      }
    });
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
