 (function() {
     // 創建並注入 script 以獲取變數 code 值
     var script = document.createElement('script');
     script.textContent = `
         (function() {
             window.postMessage({ codeValue: window.code }, "*");
         })();
     `;
     document.documentElement.appendChild(script);
     script.remove();

     // 設置事件監聽器，監聽來自 window 的消息
     window.addEventListener("message", function(event) {
         if (event.source !== window) return;
         if (event.data && typeof event.data.codeValue !== 'undefined') {
             console.log("Code value is: ", event.data.codeValue);
             window.codeValue = event.data.codeValue; // 儲存 codeValue 到 window
             setCodeValueToInput(); // 當接收到 codeValue 後立即設置
         }
     });

     // 監聽來自 popup.js 的消息
     chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
         if (message.checkboxState !== undefined) {
             console.log("AutoLogin switch state: ", message.checkboxState);
             if (message.checkboxState) {
                 // 如果自動登入被啟用，則執行填寫帳號密碼的函數
                 fill_username_password();
             }
         }
     });

     function setCodeValueToInput() {
         var portalVadElement = document.querySelector('[name="inputCode"]');
         if (portalVadElement) {
             portalVadElement.value = window.codeValue || ''; // 從 window 取值
         } else {
             console.error("Input element not found.");
         }
     }

     function fill_username_password() {
         var userIdInput = document.querySelector('input[name="Ecom_User_ID"]');
         var userPasswordInput = document.querySelector('input[name="Ecom_Password"]');
         var loginButton = document.querySelector('#heading5');

         if (userIdInput && userPasswordInput) {
             // 從 storage 讀取帳號和密碼
             chrome.storage.local.get(['userId', 'userPassword'], function(data) {
                 const userId = data.userId || '';
                 const userPassword = data.userPassword || '';

                 // 填寫帳號和密碼
                 userIdInput.value = userId;
                 userPasswordInput.value = userPassword;

                 // 觸發輸入框的事件，以確保變更被儲存
                 userIdInput.dispatchEvent(new Event('input', { bubbles: true }));
                 userPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));

                 // 等待驗證碼設置完成後再點擊登入
                 var checkCodeValueInterval = setInterval(function() {
                     var codeInput = document.querySelector('[name="inputCode"]');
                     if (codeInput && codeInput.value !== '') {
                         clearInterval(checkCodeValueInterval); // 停止檢查
                         if (loginButton) {
                             loginButton.click(); // 自動點擊登入按鈕
                         } else {
                             console.error("Login button not found.");
                         }
                     }
                 }, 100); // 每 100 毫秒檢查一次
             });
         } else {
             console.error("User ID input or password input not found.");
         }
     }

     // 檢查 autoLogin 狀態
     function checkAutoLoginStatus() {
         chrome.storage.local.get('autoLogin', function(data) {
             const autoLogin = data.autoLogin || false;
             if (autoLogin) {
                 // 等待網頁完全加載後自動填寫帳號密碼並登入
                 setTimeout(fill_username_password); // 延遲 1000 毫秒再執行
             }
         });
     }

     // 初次加載時檢查狀態
     checkAutoLoginStatus();
 })();
