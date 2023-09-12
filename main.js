let notPassedInterval;
let passedInterval;

const loginTimeEle = document.getElementById("loginTime");
const shiftHourEle = document.getElementById("shiftHour");
const shiftMinutesEle = document.getElementById("shiftMinute");
const resetEle = document.getElementById("reset");
const loginTimeFormattedEle = document.getElementById("loginTimeFormatted");
const logoutTimeFormattedEle = document.getElementById("logoutTimeFormatted");
const pendingEle = document.getElementById("pending");
const doneEle = document.getElementById("passedTimeMsg");

loginTimeEle.addEventListener("click", checkTime);
loginTimeEle.addEventListener("change", checkTime);

resetAll();

function checkTime() {
    resetOnClick();

    const loginTime = loginTimeEle.value;

    if (loginTime) {
        const shiftHour = shiftHourEle.value || 8;
        const shiftMinute = shiftMinutesEle.value || 30;

        const login = moment(loginTime, "H:mm");
        const end = moment(loginTime, "H:mm").add(shiftHour, "h").add(shiftMinute, "m");

        loginTimeFormattedEle.value = login.format("YYYY-MM-DD hh:mm A");
        logoutTimeFormattedEle.value = end.format("YYYY-MM-DD hh:mm A");

        let differenceSeconds = end.diff(moment(), "seconds");
        let isPassed = false;

        if (differenceSeconds < 0) {
            isPassed = true;
        }

        if (isPassed) {
            startPassedInterval(differenceSeconds);
        } else {
            const { hours, minutes, seconds } = secondsToHms(differenceSeconds);

            pendingEle.classList.add("show");
            pendingEle.innerText = "Time Remaning " + hours + " hours " + minutes + " minutes " + seconds + " seconds";

            startNotPassedInterval(differenceSeconds);
        }
    }
}

function startNotPassedInterval(timer) {
    doneEle.style.display = "none";
    pendingEle.style.display = "block";
    pendingEle.classList.add("show");

    notPassedInterval = setInterval(() => {
        if (timer <= 0) {
            clearInterval(notPassedInterval);
            notPassedInterval = undefined;

            startPassedInterval(1);
        } else {
            timer -= 1;

            const { hours, minutes, seconds } = secondsToHms(timer);

            pendingEle.innerText = "Time Remaning " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
        }
    }, 1000);
}

function startPassedInterval(timer) {
    pendingEle.style.display = "none";
    doneEle.style.display = "block";
    doneEle.classList.add("show");

    if (timer === 1) {
        doneEle.innerText = "Time Passed " + 0 + " hours " + 0 + " minutes " + 1 + " seconds ago.";
    }

    if (timer < 0) {
        timer = -timer;
    }

    passedInterval = setInterval(() => {
        timer++;

        const { hours, minutes, seconds } = secondsToHms(timer);

        doneEle.classList.add("show");
        doneEle.innerText = "Time Passed " + hours + " hours " + minutes + " minutes " + seconds + " seconds ago.";
    }, 1000);
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
    if (notPassedInterval) {
        clearInterval(notPassedInterval);
        notPassedInterval = undefined;
    }

    if (passedInterval) {
        clearInterval(passedInterval);
        passedInterval = undefined;
    }

    pendingEle.style.display = "none";
    doneEle.style.display = "none";
}

function resetAll() {
    loginTimeEle.value = "09:30";

    resetOnClick();
}
