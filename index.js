async function getNewVerifiedCard(numberOfCards) {
	const object = { numberOfCards: numberOfCards };
	const response = await fetch(`https://sdkfjklsahdgkls-ogosdgj.onrender.com/get-card`, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(object),
	});
	return await response.json();
}
const input = document.getElementById("numberInput");
input.addEventListener("keydown", function (event) {
	// Check if the Enter key is pressed
	if (event.key === "Enter") {
		submitForm();
	}
});

function validateNumber(input) {
	try {
		let hello = parseInt(input.value);
		if (isNaN(hello)) input.value = "";
	} catch {
		input.value = "";
		return;
	}
	if (input.value === "" || (input.value > 0 && input.value <= 5)) return;
	if (input.value < 1) {
		input.value = 1;
	} else if (input.value > 5) {
		input.value %= 10;
		if (input.value > 5) input.value = 5;
	}
}

function numOfCards() {
	let numberOfCards = document.getElementById("numberInput").value;

	if (numberOfCards > 5) {
		numberOfCards = 5;
	}
	if (numberOfCards < 1) {
		numberOfCards = 1;
	}

	return numberOfCards;
}

function removeInfo() {
	const info = document.getElementById("InfoHeaders");
	if (info) {
		info.remove();
	}
}

function loadingWheel() {
	const container = document.getElementById("container");
	container.innerHTML = `
		<div id='moreCardsModal'>
			<div class="loader"></div>
  	</div>
	`;
}

function unhideTable() {
	const table = document.getElementById("baguete-table");
	table.classList.remove("hidden");
}

function addTableRow(bagueteCardNumber, numberOfBaguets, verified) {
	const table = document.getElementById("baguete-table").getElementsByTagName("tbody")[0];

	const newRow = table.insertRow();
	const cell1 = newRow.insertCell(0);
	const cell2 = newRow.insertCell(1);
	const cell3 = newRow.insertCell(2);

	cell1.innerHTML = bagueteCardNumber;
	cell2.innerHTML = numberOfBaguets;
	if (verified === "unverified")
		cell3.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="verify_icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
  `;
	else
		cell3.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="verify_icon">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    `;
}

async function submitForm() {
	let numberOfCards = numOfCards();
	removeInfo();
	loadingWheel();

	const srvStat = document.getElementById("serverStatus");
	const srvStatFoot = document.getElementById("serverStatusFooter");
	srvStat.textContent = "Připojování k serveru";
	srvStatFoot.textContent = "Připojování k serveru";
	try {
		const response = await fetch("https://sdkfjklsahdgkls-ogosdgj.onrender.com/");
	} catch {
		srvStat.textContent = "Server Offline";
		srvStat.style.color = "red";
		srvStatFoot.textContent = "Server Offline";
		srvStatFoot.style.color = "red";
		container.remove();
		return;
	}
	srvStat.textContent = "Server Online";
	srvStatFoot.textContent = "Server Online";

	let returnedObject = await getNewVerifiedCard(parseInt(numberOfCards));
	if (returnedObject.state === "exceeded limit") {
		srvStat.textContent = "Překročen limit. Vraťte se zítra.";
		srvStat.style.color = "red";
		srvStatFoot.textContent = "Překročen limit. Vraťte se zítra.";
		srvStatFoot.style.color = "red";
		container.remove();
		return;
	}
	srvStat.textContent = "Server Online";
	srvStatFoot.textContent = "Server Online";
	console.log("GENERATED CARDS!:");
	console.log(returnedObject);
	container.innerHTML = "";
	const button = document.getElementById("restorebutton");
	button.classList.remove("hidden");
	const state = returnedObject.state;
	const baguete = returnedObject.card;
	unhideTable();
	if (state !== "error") {
		for (const baguet in baguete) {
			addTableRow(baguet, baguete[baguet], state);
		}
	} else {
		alert(`error: ${returnedObject.message}`);
	}
}

function putContainerBack() {
	const container = document.getElementById("container");
	container.innerHTML = `
    <div id='moreCardsModal' onClick="hideMenu()">
			<div id='cardGenModal' onClick="event.stopPropagation()">
				<input type="number" id="numberInput" placeholder="Počet karet" oninput="validateNumber(this)" min="0" max="5" required>
      	<input type="submit" value="Odeslat" style="margin: 1rem auto 0" onclick="submitForm()">
			</div>
    </div>
  `;
	const newInput = document.getElementById("numberInput");
	newInput.addEventListener("keydown", function (event) {
		// Check if the Enter key is pressed
		if (event.key === "Enter") {
			submitForm();
		}
	});
	container.className = "";
	container.className = "container";
}

function hideMenu() {
	const container = document.getElementById("moreCardsModal");
	container.remove();
}
