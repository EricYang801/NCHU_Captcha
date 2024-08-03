// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const autoLoginSwitch = document.getElementById('autoLoginSwitch');

    if (autoLoginSwitch) {
        // 設置 checkbox 的初始狀態
        chrome.storage.local.get('autoLogin', function(data) {
            autoLoginSwitch.checked = data.autoLogin || false;
        });

        // 監聽 checkbox 的狀態變化
        autoLoginSwitch.addEventListener('change', function() {
            const isChecked = autoLoginSwitch.checked;
            
            // 發送消息到內容腳本
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {checkboxState: isChecked});
            });

            // 將 checkbox 的狀態存儲到 localStorage
            chrome.storage.local.set({ 'autoLogin': isChecked });
        });
    } else {
        console.error('Checkbox with id "autoLoginSwitch" not found');
    }
});
