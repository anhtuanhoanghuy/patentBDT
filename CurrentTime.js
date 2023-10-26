const current_time = document.getElementById('currentTime');

function updateTime() {
    const currentDate = new Date();
    var currentSeconds;
    var currentMinutes;
    var currentHours;
    var currentDay;

    if (currentDate.getSeconds() < 10) {
        currentSeconds = "0" + currentDate.getSeconds();
    } else {
        currentSeconds = currentDate.getSeconds();
    }

    if (currentDate.getMinutes() < 10) {
        currentMinutes = "0" + currentDate.getMinutes();
    } else {
        currentMinutes = currentDate.getMinutes();
    }

    if (currentDate.getHours() < 10) {
        currentHours = "0" + currentDate.getHours();
    } else {
        currentHours = currentDate.getHours();
    }

    if ((currentDate.getDay()) == 0) {
        currentDay = "Chủ Nhật";
    } else {
        currentDay = "Thứ " + (currentDate.getDay() + 1);
    }

    current_time.innerHTML = currentHours + ":" + currentMinutes + ":" + currentSeconds + " | " + currentDay + " - " + currentDate.getDate() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getFullYear();

    requestAnimationFrame(updateTime);
}

requestAnimationFrame(updateTime);