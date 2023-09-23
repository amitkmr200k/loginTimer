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
const nowEle = document.getElementById("now");

loginTimeEle.addEventListener("click", calculateTime);
loginTimeEle.addEventListener("change", calculateTime);
shiftHourEle.addEventListener("click", calculateTime);
shiftHourEle.addEventListener("change", calculateTime);
shiftMinutesEle.addEventListener("click", calculateTime);
shiftMinutesEle.addEventListener("change", calculateTime);
nowEle.addEventListener("click", clickedNowBtton);
nowEle.addEventListener("change", clickedNowBtton);

resetAll();

function clickedNowBtton() {
    loginTimeStr = moment().format("H:mm");

    loginTimeEle.value = loginTimeStr;

    loginTimeEle.click();
}

async function calculateTime() {
    localStorage.setItem("clickedByUser", true);

    await clearAllIntervals();

    let loginTimeStr = loginTimeEle.value;

    if (loginTimeStr) {
        const shiftHour = shiftHourEle.value || 8;
        const shiftMinute = shiftMinutesEle.value || 30;

        localStorage.setItem("shiftHour", shiftHour);
        localStorage.setItem("shiftMinute", shiftMinute);
        localStorage.setItem("loginTimeStr", loginTimeStr);

        const defaultLoginTimeStr = moment("09:30", "H:mm");
        let loginTime = moment(loginTimeStr, "H:mm");

        if (loginTime.diff(moment(defaultLoginTimeStr), "seconds") < 0) {
            loginTime = defaultLoginTimeStr;
        }

        const end = loginTime.clone().add(shiftHour, "h").add(shiftMinute, "m");
        // console.log("🚀 ~ file: main.js:56 ~ calculateTime ~ loginTime:", loginTime)

        parentDisplayEle.style.display = "block";
        loginTimeFormattedEle.value = loginTime.format("YYYY-MM-DD hh:mm A");
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

            pendingEle.style.display = "block";
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
    // if (!localStorage.getItem("calledByNowButton")) {
        loginTimeEle.value = localStorage.getItem("loginTimeStr") || "09:30";
    // } else {
    //     loginTimeEle.value = "09:30";
    // }

    // loginTimeEle.value = localStorage.getItem("loginTimeStr") || !localStorage.getItem("calledByNowButton") ? "09:30": localStorage.getItem("loginTimeStr");
    shiftHourEle.value = localStorage.getItem("shiftHour") || 8;
    shiftMinutesEle.value = localStorage.getItem("shiftMinute") || 30;

    let setDate = localStorage.getItem("currentDate");

    if (!setDate) {
        localStorage.setItem("currentDate", moment().format("YYYY-MM-DD"));
    }

    setDate = moment(localStorage.getItem("currentDate"));

    let diffDate = setDate.diff(moment(), "days");

    if (localStorage.getItem("clickedByUser") && diffDate >= 0) {
        loginTimeEle.click();
    } else {
        parentDisplayEle.style.display = "none";
        pendingEle.style.display = "none";
        doneEle.style.display = "none";

        localStorage.clear();
    }

    clearAllIntervals();
}
