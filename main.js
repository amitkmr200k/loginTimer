let intervalCheck;

const loginTimeEle = document.getElementById("loginTime");
const shiftHourEle = document.getElementById("shiftHour");
const shiftMinutesEle = document.getElementById("shiftMinute");
const countdownTimerEle = document.getElementById("countdownTimer");
const resetEle = document.getElementById("reset");

loginTimeEle.addEventListener("click", checkTime);
loginTimeEle.addEventListener("change", checkTime);

resetAll();

function checkTime() {
    resetOnClick();

    const loginTime = loginTimeEle.value;

    if (loginTime) {
        const shiftHour = shiftHourEle.value || 8;
        const shifttMinute = shiftMinutesEle.value || 30;

        const end = moment(loginTime, "H:mm").add(shiftHour, "h").add(shifttMinute, "m");

        let differenceSeconds = end.diff(moment(), "seconds");

        // differenceSeconds = differenceSeconds > 0 ? differenceSeconds : -differenceSeconds;

        let isPassed = false;

        if (differenceSeconds < 0) {
            differenceSeconds = -differenceSeconds;
            isPassed = true;
        }

        const { hours, minutes, seconds } = secondsToHms(differenceSeconds);
        if (!isPassed) {
            countdownTimerEle.textContent =
                "Time Remaning " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
        } else {
            countdownTimerEle.textContent =
                "Time Passed " + hours + " hours " + minutes + " minutes " + seconds + " seconds ago.";
        }

        intervalCheck = setInterval(() => {
            if (differenceSeconds < 0) {
                differenceSeconds = -differenceSeconds;
                isPassed = true;
            }

            differenceSeconds -= 1;

            const { hours, minutes, seconds } = secondsToHms(differenceSeconds);

            if (!isPassed) {
                countdownTimerEle.textContent =
                    "Time Remaning " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
            } else {
                countdownTimerEle.textContent =
                "Time Passed " + hours + " hours " + minutes + " minutes " + seconds + " seconds ago.";
            }
        }, 1000);

        if (isPassed) {
            countdownTimerEle.style.color = "red";
        }
    }
}

function secondsToHms(d) {
    d = Number(d);

    const hours = Math.floor(d / 3600);
    const minutes = Math.floor((d % 3600) / 60);
    const seconds = Math.floor((d % 3600) % 60);

    return {
        hours,
        minutes,
        seconds,
    };
}

resetEle.addEventListener("click", () => {
    resetAll();
});

function resetOnClick() {
    countdownTimerEle.style.color = "black";
    countdownTimerEle.textContent = "";
    if (intervalCheck) {
        clearInterval(intervalCheck);
        intervalCheck = undefined;
    }
}

function resetAll() {
    loginTimeEle.value = "09:30";

    resetOnClick();
}
