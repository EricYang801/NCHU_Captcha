(function () {
    var script = document.createElement('script');
    var injectScriptUrl = chrome.runtime.getURL('inject.js');
    
    // 檢查 injectScriptUrl 是否有效
    if (injectScriptUrl) {
        script.src = injectScriptUrl;
        script.onload = function () {
            console.log('inject.js 已加載');
            script.remove(); // 確保在腳本加載後才移除
        };
        script.onerror = function () {
            console.error('inject.js 加載錯誤');
        };
        document.documentElement.appendChild(script);
    } else {
        console.error('無法獲取 inject.js 的 URL');
    }
    
    // 監聽來自 background.js 的消息
    chrome.runtime.onMessage.addListener(function (message) {
        if (message.checkboxState !== undefined) {
            console.log("AutoLogin switch state: ", message.checkboxState);
            if (message.checkboxState) {
                // 如果自動登入被啟用，則執行填寫帳號密碼的函數
                fillUsernamePassword();
            }
        }
    });
    
    function fillUsernamePassword() {
        var userIdInput = document.querySelector('input[name="Ecom_User_ID"]');
        var userPasswordInput = document.querySelector('input[name="Ecom_Password"]');
        var loginButton = document.querySelector('#heading5');
        
        if (userIdInput && userPasswordInput) {
            // 從 storage 讀取帳號和密碼
            chrome.storage.local.get(['userId', 'userPassword'], function (data) {
                const userId = data.userId || '';
                const userPassword = data.userPassword || '';
                
                // 填寫帳號和密碼
                userIdInput.value = userId;
                userPasswordInput.value = userPassword;
                
                // 觸發輸入框的事件，以確保變更被儲存
                userIdInput.dispatchEvent(new Event('input', { bubbles: true }));
                userPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                // 等待驗證碼設置完成後再點擊登入
                var checkCodeValueInterval = setInterval(function () {
                    var codeInput = document.querySelector('[name="inputCode"]');
                    if (codeInput && codeInput.value !== '') {
                        clearInterval(checkCodeValueInterval); // 停止檢查
                        if (loginButton) {
                            monitorPageReload(); // 監聽頁面重新加載事件
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
    
    function monitorPageReload() {
        if (window.location.href === "https://idp.nchu.edu.tw/nidp/idff/sso?sid=0&sid=0") {
            alert("登入失敗，請檢查帳號密碼是否正確");
            throw new Error("登入失敗，終止所有進程");
        }
    }
    
    // 檢查 autoLogin 狀態
    function checkAutoLoginStatus() {
        chrome.storage.local.get('autoLogin', function (data) {
            const autoLogin = data.autoLogin || false;
            if (autoLogin) {
                // 等待網頁完全加載後自動填寫帳號密碼並登入
                fillUsernamePassword();
                //setTimeout(fillUsernamePassword, 1000); // 延遲 1000 毫秒再執行
            }
        });
    }
    
    // 初次加載時檢查狀態
    checkAutoLoginStatus();
})();
