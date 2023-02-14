let seconds = 0;
let minutes = 0;
let hours = 0;
let days = 0;

const secondsSpan = document.getElementById("seconds");
const minutesSpan = document.getElementById("minutes");
const hoursSpan = document.getElementById("hours");
const daysSpan = document.getElementById("days");

function formatTime(date)
{
	let result = [date, date, Math.min(59, 5 + date), Math.min(59, 20 + date)];
	return result;
}

const deadlineTime = [2023, 5, 28, 12, 32];
const currentTime = [2023, 2, 12, 15, 10];

function nullTimer()
{
	seconds = 0;
	minutes = 0;
	hours = 0;
	days = 0;
}

function deadlineIsValid()
{
	let deadlineValue = "" + deadlineTime[0] + deadlineTime[1] + deadlineTime[2] + deadlineTime[3] + deadlineTime[4];
	let currentValue = "" + currentTime[0] + currentTime[1] + currentTime[2] + currentTime[3] + currentTime[4];

	deadlineValue = parseInt(deadlineValue);
	currentValue = parseInt(currentValue);

	console.log("Comparing: " + deadlineValue + " with " + currentValue);

	return deadlineValue > currentValue;
}

function resetTimer()
{
	//const deadline = formatTime(deadlineTime);
	//const currentTime = formatTime(0);

	//seconds = 59;
	//minutes = deadline[1] - currentTime[1];
	//hours = deadline[2] - currentTime[2];
	//days = deadline[3] - currentTime[3];

	//console.log("Remaining time is set to :" + seconds + ":" + minutes + ":" + hours + ":" + days);
	console.log("Checking given dates:");
	if (deadlineIsValid() === false)
	{
		console.log("Dates are invalid!");

		nullTimer();
		return;
	}
	console.log("Dates are valid!");
	//HANDLE SPECIAL CASES!

	seconds = 59 - currentTime[4] + deadlineTime[4];
	if (seconds >= 60)
	{
		minutes++;
		seconds = seconds - 60;
	}

	minutes = minutes + 59 - currentTime[3] + deadlineTime[3];
	if (minutes >= 60)
	{
		hours++;
		minutes = minutes - 60;
	}

	hours = hours + 24 - currentTime[2] + deadlineTime[2];
	if (hours >= 24)
	{
		days++;
		hours = hours - 24;
	}

	if (deadlineTime[0] > currentTime[0])
	{
		days = days +
			daysToEnd(currentTime[1], currentTime[2], currentTime[0]) +
			daysToDate(deadlineTime[1], deadlineTime[2], deadlineTime[0])
			+ daysThroughYears(currentTime[0] + 1, deadlineTime[0] - 1);
	}
	else (deadlineTime[0] === currentTime[0])
	{
		days = days +
			daysToEnd(currentTime[1], currentTime[2], currentTime[0]) -
			daysToEnd(deadlineTime[1], deadlineTime[2], deadlineTime[0]) - 1;
	}
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

function daysThroughYears(from, to)
{
	let result = 0;

	for (let y = from; y <= to; y++)
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
	secondsSpan.textContent = seconds.toString();
	minutesSpan.textContent = minutes.toString();
	hoursSpan.textContent = hours.toString();
	daysSpan.textContent = days.toString();
}

function timer()
{
	//while (seconds > 0 || minutes > 0 || hours > 0 || days > 0)
	//	setTimeout(tick(), 1000);
	let elapsedTime = 0;
	let ticking = setInterval(() => 
	{
		let startingTime = performance.now();

		if (seconds <= 0 && minutes <= 0 && hours <= 0 && days <= 0)
		{
			tickTime = 0;
			clearInterval(ticking);
			ticking = null;
		}

		tick();
		elapsedTime = performance.now() - startingTime;
	}, 1000 - elapsedTime);
}

resetTimer();
timer();

//console.log("Reached end of code!");
