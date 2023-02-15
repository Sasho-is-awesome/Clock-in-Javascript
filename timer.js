let seconds = 0;
let minutes = 0;
let hours = 0;
let days = 0;

const secondsSpan = document.getElementById("seconds");
const minutesSpan = document.getElementById("minutes");
const hoursSpan = document.getElementById("hours");
const daysSpan = document.getElementById("days");

const deadlineSpan = document.getElementById("deadline");

const secondsText = document.getElementById("secondsText");
const minutesText = document.getElementById("minutesText");
const hoursText = document.getElementById("hoursText");
const daysText = document.getElementById("daysText");

function formatTime()
{
	let temp = deadlineSpan.textContent.split(/\s|:|-/);

	let result = [parseInt(temp[2]), parseInt(temp[1]), parseInt(temp[0]), parseInt(temp[3]), parseInt(temp[4]), parseInt(temp[5])];
	console.log("Processed date: " + result);
	
	return result;
}

let currentTime;//current date is set in resetTimer()

let deadlineTime = formatTime();

function nullTimer()
{
	seconds = 0;
	minutes = 0;
	hours = 0;
	days = 0;
}

function isLarger(arg1, arg2)
{
	if (arg1 > arg2)
		return true;

	return false;
}

function deadlineIsValid()
{
	console.log("Comparing: " + deadlineTime + " with " + currentTime);

	if (deadlineTime[0] !== currentTime[0]) return isLarger(deadlineTime[0], currentTime[0]);
	if (deadlineTime[1] !== currentTime[1]) return isLarger(deadlineTime[1], currentTime[1]);
	if (deadlineTime[2] !== currentTime[2]) return isLarger(deadlineTime[2], currentTime[2]);
	if (deadlineTime[3] !== currentTime[3]) return isLarger(deadlineTime[3], currentTime[3]);
	if (deadlineTime[4] !== currentTime[4]) return isLarger(deadlineTime[4], currentTime[4]);
	if (deadlineTime[5] !== currentTime[5]) return isLarger(deadlineTime[5], currentTime[5]);

	return false;
}

function resetTimer()
{
	nullTimer();

	let currentDate = new Date();//set the current date; the clock synchronises, so it need to reset the current date
	currentTime = [
		currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate(),//the returned month is a value between 0 to 11
		currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds()];;

	console.log("Checking given dates:");
	if (deadlineIsValid() === false)
	{
		console.log("Dates are invalid!");
		return;
	}
	console.log("Dates are valid!");

	outputDate("resetTimer() BEFORE CALC");

	if (deadlineTime[0] === currentTime[0] &&
		deadlineTime[1] === currentTime[1] &&
		deadlineTime[2] === currentTime[2] &&
		deadlineTime[3] === currentTime[3] &&
		deadlineTime[4] === currentTime[4])//seconds remaining
	{
		seconds = deadlineTime[5] - currentTime[5];
		outputDate("resetTimer() CASE 1");
		return;
	}

	if (deadlineTime[0] === currentTime[0] &&
		deadlineTime[1] === currentTime[1] &&
		deadlineTime[2] === currentTime[2] &&
		deadlineTime[3] === currentTime[3])//minutes remaining
	{
		minutes = deadlineTime[4] - currentTime[4] - 1;
		setSec();
		outputDate("resetTimer() CASE 2");
		return;
	}

	if (deadlineTime[0] === currentTime[0] &&
		deadlineTime[1] === currentTime[1] &&
		deadlineTime[2] === currentTime[2])//hours remaining
	{
		hours = deadlineTime[3] - currentTime[3] - 1;
		setMinSec();
		outputDate("resetTimer() CASE 3");
		return;
	}

	if (deadlineTime[0] === currentTime[0] &&
		deadlineTime[1] === currentTime[1])//days remianing
	{
		days = deadlineTime[2] - currentTime[2] - 1;
		setHoursMinSec();
		outputDate("resetTimer() CASE 4");
		return;
	}

	if (deadlineTime[0] === currentTime[0])//months remaining
	{
		daysBetweenMonths();
		setDaysHoursMinSec();
		outputDate("resetTimer() CASE 5");
		return;
	}

	days += daysToEnd(currentTime[1], currentTime[2], currentTime[0]);
	//console.log("resetTimer() Days are now: " + days);
	days += daysToDate(deadlineTime[1], deadlineTime[2], deadlineTime[0]);
	//console.log("resetTimer() Days are now: " + days);
	days += daysThroughYears();
	//console.log("resetTimer() Days are now: " + days);

	setHoursMinSec();

	outputDate("resetTimer() CASE 6");
}

function daysToEnd(month, day, year)
{
	let result = 0;

	result += monthDays(month) - day;

	for (let m = month + 1; m <= 12; m++)
		result += monthDays(m, year);

	return result;
}

function daysToDate(month, day, year)
{
	let result = 0;

	result += day - 1;//not counting the day

	for (let m = 1; m < month; m++)//not counting the month
		result += monthDays(m, year);

	return result;
}

function daysThroughYears()
{
	if (currentTime[0] + 1 === deadlineTime[0])
		return 0;

	let result = 0;

	for (let y = currentTime[0] + 1; y < deadlineTime[0]; y++)
		result += daysInYear(y);

	return result;
}

function monthDays(month, year)
{
	if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
		return 31;

	if (month == 4 || month == 6 || month == 9 || month == 11)
		return 30;

	if (month == 2 && daysInYear(year) === 365)
		return 28;

	if (month == 2 && daysInYear(year) === 366)
		return 29;

	console.log("Something is wrong in monthDays(" + month + ", " + year + ")");
	return -1;//something is wrong here...
}

function daysInYear(year)
{
	if (year % 4 == 0)
		return 366;

	return 365;
}

function setSec()
{
	seconds = deadlineTime[5] + 59 - currentTime[5];

	if (seconds >= 60)
	{
		seconds -= 60;
		minutes++;
	}//minutes are set
}
function setMinSec()
{
	setSec();

	minutes += deadlineTime[4] + 59 - currentTime[4];

	if (minutes >= 60)
	{
		hours++;
		minutes -= 60;
	}//hours are set

}
function setHoursMinSec()
{
	setMinSec();

	hours += deadlineTime[3] + 23 - currentTime[3];//hours may have increased in setMinSec()

	if (hours >= 24)
	{
		days ++;
		hours -= 24;
	}//days are set
}
function setDaysHoursMinSec()
{
	setHoursMinSec();
	//console.log("setDaysHoursMinSec() Days are now: " + days);
	days += monthDays(currentTime[1], currentTime[0]) - currentTime[2] - 1;
	//console.log("setDaysHoursMinSec() Days are now: " + days);
	days += deadlineTime[2];
	//console.log("setDaysHoursMinSec() Days are now: " + days);
}
function daysBetweenMonths()
{
	if (currentTime[1] + 1 === deadlineTime[1])
		return;

	for (let m = currentTime[1] + 1; m < deadlineTime[1]; m++)
	{
		days += monthDays(m, currentTime[0]);
		console.log("daysBetweenMonths() Days are now: " + days);
	}
}

function outputDate(calledFrom)
{
	console.log("Date in " + calledFrom + " is :" + seconds + ":" + minutes + ":" + hours + ":" + days);
}

function tick()
{
	seconds--;

	if (seconds < 0)
	{
		seconds = 59;
		minutes--;
	}

	if (minutes < 0)
	{
		minutes = 59;
		hours--;

		resetTimer();//synchronising
	}

	if (hours < 0)
	{
		hours = 23;
		days--;
	}

	if (days < 0)
	{
		seconds = 0;
		minutes = 0;
		hours = 0;
		days = 0;
	}
	
	//console.log("Tick!");
	console.log("Time is :" + seconds + ":" + minutes + ":" + hours + ":" + days);
	updateTimer();
}

function updateTimer()
{
	secondsSpan.textContent = seconds.toString();//this is to be improved
	minutesSpan.textContent = minutes.toString();//all text updates on every tick
	hoursSpan.textContent = hours.toString();
	daysSpan.textContent = days.toString();

	if (days === 1)
	{
		daysText.textContent = "ден";
	}
	else if (days === 0)
	{
		daysSpan.textContent = "";
		daysText.textContent = "";
	}

	if (hours === 1)
	{
		hoursText.textContent = "час";
	}
	else if (hours === 0 && days === 0)
	{
		hoursSpan.textContent = "";
		hoursText.textContent = "";
	}
	else
	{
		hoursText.textContent = "часа";
	}

	if (minutes === 1)
	{
		minutesText.textContent = "минута";
	}
	else if (minutes === 0 && hours === 0 && days === 0)
	{
		minutesText.textContent = "";
		minutesSpan.textContent = "";
	}
	else
	{
		minutesText.textContent = "минути";
	}

	if (seconds === 1)
	{
		secondsText.textContent = "секунда";
	}
	else if (seconds === 0 && minutes === 0 && hours === 0 && days === 0)
	{
		secondsText.textContent = "";
		secondsSpan.textContent = "";
	}
	else
	{
		secondsText.textContent = "секунди";
	}

}

function timer()
{
	updateTimer();
	if (seconds <= 0 && minutes <= 0 && hours <= 0 && days <= 0)
	{
		onDeadlineReached();
		return;
	}
	//while (seconds > 0 || minutes > 0 || hours > 0 || days > 0)
	//	setTimeout(tick(), 1000);
	let elapsedTime = 0;
	let ticking = setInterval(() => 
	{
		let startingTime = performance.now();

		if (seconds <= 0 && minutes <= 0 && hours <= 0 && days <= 0)
		{
			clearInterval(ticking);
			ticking = null;
			onDeadlineReached();
			return;
		}

		tick();
		elapsedTime = performance.now() - startingTime;
	}, 1000 - elapsedTime);
}

function onDeadlineReached()
{
	window.alert("Countdown is over!");
}

resetTimer();
timer();

//console.log("Reached end of code!");
