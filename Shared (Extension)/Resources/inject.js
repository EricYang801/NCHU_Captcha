//
//  inject.js
//  NCHU_Captcha
//
//  Created by Eric Yang on 8/19/24.
//

(function () {
    // 設置驗證碼的全局變量
    code = 'ABCD';

    // 更新驗證碼顯示
    var codeShow = document.getElementById('codeShow');
    var cxt = codeShow.getContext('2d');
    cxt.fillStyle = '#8dd5e7';
    cxt.fillRect(0, 0, 100, 30);
    cxt.fillStyle = '#fff';
    cxt.font = 'bold 20px Arial';
    cxt.fillText(code, 16, 24);

    // 手動設置輸入框的值為驗證碼
    document.getElementById('inputCode').value = code;
    // // 獲取變數 code 值並發送消息到 content script
    // window.postMessage({ codeValue: window.code }, "*");
})();
