
//Show Alert và ẩn phần tử đó đi

const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const clodeAlert = showAlert.querySelector("[close-alert]");
    // console.log(showAlert);
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
    clodeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}
//end

// Detect browser or tab closing
window.addEventListener("beforeunload", function (e) {
    socket.emit("CLIENT_CLOSE_WEB", "user close web");
})
// End Detect browser or tab closing