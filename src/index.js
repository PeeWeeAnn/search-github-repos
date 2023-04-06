import "./scss/app.scss"

let input = document.querySelector("input")
let list = document.querySelector(".list")

async function fetchRepos(text) {
	let result = await fetch(
		`https://api.github.com/search/repositories?q=${text}&page=1&per_page=10`,
	)
		.then((res) => res.json())
		.catch((error) => console.log(error))

	if (result.items.length) {
		let searchMessageFound = document.createElement("p")

		appendMessage(
			list,
			searchMessageFound,
			"search_message",
			`Найдены результаты по запросу ${text}`,
		)

		appendResults(result.items)
	} else {
		let searchMessageNotFound = document.createElement("p")

		appendMessage(
			list,
			searchMessageNotFound,
			"search_message",
			`Ничего не найдено по запросу ${text}!`,
		)
	}
}

function appendResults(arrayOfResults) {
	let resultsList = document.getElementById("results_list")

	arrayOfResults.forEach((item) => {
		let li = document.createElement("li")
		let anchor = document.createElement("anchor")
		let description = document.createElement("p")
		let count = document.createElement("p")
		let creatingData = document.createElement("p")

		anchor.textContent = item.name
		anchor.href = item.html_url
		anchor.target = "_blank"

		description.textContent = item.description || "No description"

		count.textContent = "☆" + item.stargazers_count

		creatingData.textContent = item.created_at

		li.append(anchor)
		li.append(description)
		li.append(count)
		li.append(creatingData)
		resultsList.append(li)
	})
}

function handleEnter() {
	input.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			event.preventDefault()

			if (document.querySelector(".search_message")) {
				removeElement(document.querySelector(".search_message"))
			}

			if (!event.currentTarget.value) {
				let searchMessage = document.createElement("p")

				appendMessage(
					list,
					searchMessage,
					"search_message",
					"Вы ничего не ввели в поисковую строку!",
				)
			}

			fetchRepos(input.value)
			input.value = ""
			removeResults()
		}
	})
}

function removeResults() {
	let resultsList = document.querySelectorAll("#results_list > *")

	resultsList.forEach((listItem) => {
		removeElement(listItem)
	})
}

function appendMessage(list, elementName, className, message) {
	elementName.classList.add(className)
	elementName.textContent = message

	list.prepend(elementName)
}

function removeElement(message) {
	message.remove()
}

handleEnter()
