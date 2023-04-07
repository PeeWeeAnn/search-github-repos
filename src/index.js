import "./scss/app.scss"

const search = document.querySelector(".search")
const input = document.querySelector("input")
const button = document.querySelector("button")

// REQUEST DATA
async function fetchRepos(text) {
	let result = await fetch(
		`https://api.github.com/search/repositories?q=${text}&page=1&per_page=10`,
	)
		.then((res) => res.json())
		.catch((error) => console.log(error))

	if (result.items.length) {
		let foundMessage = document.createElement("p")

		appendElement(
			search,
			foundMessage,
			"search_message",
			"Найдены результаты по запросу: ",
		)

		let span = document.createElement("span")

		appendElement(foundMessage, span, "span", text)

		fillEntry()

		appendResults(result.items)
	} else {
		let notFoundMessage = document.createElement("p")

		appendElement(
			search,
			notFoundMessage,
			"search_message",
			"Ничего не найдено по запросу: ",
		)

		let span = document.createElement("span")

		appendElement(notFoundMessage, span, "span", text)

		fillEntry()
	}
}

// ACTIONS
function appendResults(arrayOfResults) {
	let resultsList = document.getElementById("results_list")

	arrayOfResults.forEach((item) => {
		let li = document.createElement("li")
		let anchor = document.createElement("a")
		let description = document.createElement("p")
		let count = document.createElement("p")
		let creatingData = document.createElement("p")

		anchor.textContent = item.name
		anchor.href = item.html_url
		anchor.target = "_blank"

		description.textContent = item.description || "No description"

		count.textContent = "☆" + item.stargazers_count

		creatingData.textContent = new Date(item.created_at).toLocaleDateString()

		li.append(anchor)
		li.append(description)
		li.append(count)
		li.append(creatingData)
		resultsList.append(li)
	})
}

const handleClick = () => {
	button.addEventListener("click", (event) => {
		event.preventDefault()

		if (document.querySelector(".search_message")) {
			removeElement(document.querySelector(".search_message"))
		}

		if (!input.value.trim()) {
			let searchMessage = document.createElement("p")

			appendElement(
				search,
				searchMessage,
				"search_message",
				"Вы ничего не ввели в поисковую строку!",
			)
		} else if (input.value.length < 3) {
			alert("Вы ввели менее 3-х символов.")
			return false
		}

		fetchRepos(input.value)
		input.value = ""
		removeResults()
	})
}

const handleEnter = () => {
	input.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			event.preventDefault()

			if (document.querySelector(".search_message")) {
				removeElement(document.querySelector(".search_message"))
			}

			if (!event.currentTarget.value.trim()) {
				let searchMessage = document.createElement("p")

				appendElement(
					search,
					searchMessage,
					"search_message",
					"Вы ничего не ввели в поисковую строку!",
				)
			} else if (event.currentTarget.value.length < 3) {
				alert("Вы ввели менее 3-х символов.")
				return false
			}

			fetchRepos(input.value)
			input.value = ""
			removeResults()
		}
	})
}

const removeResults = () => {
	let resultsList = document.querySelectorAll("#results_list > *")

	resultsList.forEach((listItem) => {
		removeElement(listItem)
	})
}

const fillEntry = () => {
	let entry = document.querySelector(".search_message .span")

	if (entry) {
		entry.addEventListener("click", (event) => {
			input.value = event.target.textContent
		})
	}
}

// HELPERS
function appendElement(parentNode, elementName, className, textContent) {
	elementName.classList.add(className)
	elementName.textContent = textContent

	parentNode.append(elementName)
}

function removeElement(message) {
	message.remove()
}

// EVENT LISTENERS
handleEnter()
handleClick()
