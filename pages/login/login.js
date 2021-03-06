const { http } = require('../../lib/http.js')
const { app_id, app_secret } = getApp().globalData

Page({
  data: {

  },
  // 实现步骤：点击登录按钮 => 调用小程序原生的 wx.login => http.post => 返回 user 
  // => 保存 user => 返回首页
  // 处理一下 login 函数
  /* login 接口
  url: /sign_in/mini_program_user
  data: { code, iv, encrypted_data, app_id, app_secret }
  method: post */
  login(event) {
    let encrypted_data = event.detail.encryptedData
    let iv = event.detail.iv
    this.wxLogin(iv, encrypted_data)
  },
  wxLogin(iv, encrypted_data){
    wx.login({
      success:(res) =>{ this.loginMe(res.code, iv, encrypted_data)}
    })
  },
  loginMe(code, iv, encrypted_data){
    // 登录发送请求
    http.post('/sign_in/mini_program_user', {
      code,
      iv,
      encrypted_data,
      app_id,
      app_secret
    })
      .then(response => {
        this.saveMessage(response)
        wx.reLaunch({url: '/pages/home/home'})
      })
  },
  saveMessage(response){
    wx.setStorageSync('me', response.data.resource)
    wx.setStorageSync('X-token', response.header['X-token'])
  }
})