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
const parentDisplayEle = document.getElementById("parentDisplay");

loginTimeEle.addEventListener("click", checkTime);
loginTimeEle.addEventListener("change", checkTime);
shiftHourEle.addEventListener("click", checkTime);
shiftHourEle.addEventListener("change", checkTime);
shiftMinutesEle.addEventListener("click", checkTime);
shiftMinutesEle.addEventListener("change", checkTime);

resetAll();

function checkTime() {
    localStorage.setItem("clickedByUser", true);

    clearAllIntervals();

    const loginTime = loginTimeEle.value;

    if (loginTime) {
        const shiftHour = shiftHourEle.value || 8;
        const shiftMinute = shiftMinutesEle.value || 30;

        localStorage.setItem("shiftHour", shiftHour);
        localStorage.setItem("shiftMinute", shiftMinute);
        localStorage.setItem("loginTime", loginTime);

        const login = moment(loginTime, "H:mm");
        const end = moment(loginTime, "H:mm").add(shiftHour, "h").add(shiftMinute, "m");

        parentDisplayEle.style.display = "block";
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

    if (timer === 1) {
        doneEle.style.display = "block";
        doneEle.classList.add("show");
    
        doneEle.innerText = "Time Passed " + 0 + " hours " + 0 + " minutes " + 1 + " seconds ago.";
    }

    if (timer < 0) {
        timer = -timer;
    }

    passedInterval = setInterval(() => {
        timer++;

        const { hours, minutes, seconds } = secondsToHms(timer);

        doneEle.style.display = "block";
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
    localStorage.clear();
    resetAll();
});

function clearAllIntervals() {
    if (notPassedInterval) {
        clearInterval(notPassedInterval);
        notPassedInterval = undefined;
    }

    if (passedInterval) {
        clearInterval(passedInterval);
        passedInterval = undefined;
    }
}

function resetAll() {
    loginTimeEle.value = localStorage.getItem("loginTime") || "09:30";
    shiftHourEle.value = localStorage.getItem("shiftHour") || 8;
    shiftMinutesEle.value = localStorage.getItem("shiftMinute") || 30;

    if (localStorage.getItem("clickedByUser")) {
        loginTimeEle.click();
    } else {
        parentDisplayEle.style.display = "none";
        pendingEle.style.display = "none";
        doneEle.style.display = "none";
    }

    clearAllIntervals();
}
