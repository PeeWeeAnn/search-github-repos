import "./scss/app.scss";

async function fetchRepos(text) {
	let result = await fetch(
		`https://api.github.com/search/repositories?q=${text}&page=1&per_page=10`,
	)
		.then((res) => res.json())
		.catch((error) => console.log(error));
	appendResults(result.items);
}

function appendResults(arrayOfResults) {
	let resultsList = document.getElementById("results_list");

	arrayOfResults.forEach((item) => {
		let li = document.createElement("li");
		let anchor = document.createElement("anchor");
		let description = document.createElement("p");
		let count = document.createElement("p");
		let creatingData = document.createElement("p");

		anchor.textContent = item.name;
		anchor.href = item.html_url;
		anchor.target = "_blank";

		description.textContent = item.description || "No description";

		count.textContent = "☆" + item.stargazers_count;

		creatingData.textContent = item.created_at;

		li.append(anchor);
		li.append(description);
		li.append(count);
		li.append(creatingData);
		resultsList.append(li);
	});
}

let input = document.querySelector("input");

input.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();

		if (document.querySelector(".search_message")) {
			removeMessage(document.querySelector(".search_message"));
		}

		if (event.currentTarget.value) {
			let list = document.querySelector(".list");

			let searchMessage = document.createElement("p");

			searchMessage.classList.add("search_message");
			searchMessage.textContent = `Найдены результаты по запросу ${event.currentTarget.value}:`;

			list.prepend(searchMessage);
		} else {
			let list = document.querySelector(".list");

			let searchMessage = document.createElement("p");

			searchMessage.classList.add("search_message");
			searchMessage.textContent = "Вы ничего не ввели в поисковую строку!";

			list.prepend(searchMessage);
		}

		fetchRepos(input.value);
		input.value = "";
		removeResults();
	}
});

function removeResults() {
	let resultsList = document.querySelectorAll("#results_list > *");

	resultsList.forEach((listItem) => {
		listItem.remove();
	});
}

function removeMessage(message) {
	message.remove();
}
