import { host } from './config';

App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');

    dd.getAuthCode({
      success: function (res) {
        console.log(JSON.stringify(res));
        dd.httpRequest({
          url: `${host}/dingtalk/gettoken?code=${res.authCode}&app=erp`,
          method: 'GET',
          dataType: 'json',
          success: function (res) {
            // console.log(JSON.stringify(res));
            dd.setStorage({
              key: 'access_token',
              data: 'Bearer ' + res.data.data.KeycloakToken
            });
          },
          fail: function (res) {
            dd.alert({
              content: 'accessToken获取失败'
            })
          }
        });
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
