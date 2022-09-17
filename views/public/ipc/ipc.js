window.electronAPI.sendMessage((event, value) => {
    console.log("sendMessage front");
    console.log(value);
    document.getElementById("message-btn").click();
});