// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const autoLoginSwitch = document.getElementById('autoLoginSwitch');
    const saveButton = document.getElementById('saveButton');
    const userIdInput = document.getElementById('UserID');
    const userPasswordInput = document.getElementById('UserPassword');
    
    if (autoLoginSwitch && saveButton) {
        // 設置 checkbox 的初始狀態
        chrome.storage.local.get(['autoLogin', 'userId', 'userPassword'], function(data) {
            autoLoginSwitch.checked = data.autoLogin || false;
            userIdInput.value = data.userId || '';
            userPasswordInput.value = data.userPassword || '';
        });
        
        // 監聽 checkbox 的狀態變化
        autoLoginSwitch.addEventListener('change', function() {
            const isChecked = autoLoginSwitch.checked;
            
            // 發送消息到內容腳本
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { checkboxState: isChecked });
            });
            
            // 將 checkbox 的狀態存儲到 localStorage
            chrome.storage.local.set({ 'autoLogin': isChecked });
        });
        
        // 監聽保存按鈕的點擊事件
        saveButton.addEventListener('click', function() {
            const userId = userIdInput.value;
            const userPassword = userPasswordInput.value;
            
            // 將用戶輸入的 ID 和密碼存儲到 localStorage
            chrome.storage.local.set({ 'userId': userId, 'userPassword': userPassword }, function() {
                console.log('User ID and Password saved');
            });
        });
    } else {
        console.error('Required elements not found');
    }
});
