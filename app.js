//--- PRE-SETUP ---//
// set root page
const root = "http://127.0.0.1:5500/";
const landingPage = root + "index.html";

// import users list
const importUsers = () => {
	// if "users" list is not in Local Storage, fetch it from users.json
	if (localStorage.getItem("users") == null) {
		let users_data_url = "./data/users.json";
		fetch(users_data_url)
			.then((response) => response.json())
			.then((data) => {
				localStorage.setItem("users", JSON.stringify(data));
			})
			.catch((error) => console.log(error));
	}
};

// imoport food list
const importFood = () => {
	// if "food" list is not in Local Storage, fetch it from food.json
	if (localStorage.getItem("food") == null) {
		let food_data_url = "./data/food.json";
		fetch(food_data_url)
			.then((response) => response.json())
			.then((data) => {
				localStorage.setItem("food", JSON.stringify(data));
			})
			.catch((error) => console.log(error));
	}
};

// create variable to store logged users
const initLogged = () => {
	if (sessionStorage.getItem("logged") == null) {
		sessionStorage.setItem("logged", JSON.stringify(""));
	}
};

// main app
const main = () => {
	//--- DATABASE FUNCTIONS ---//
	// get users list from DB
	const dbGetUsers = () => {
		return JSON.parse(localStorage.getItem("users"));
	};

	// save users list to DB
	const dbSaveUsers = (data) => {
		localStorage.setItem("users", JSON.stringify(data));
	};

	// get logged user
	const loggedUser = () => {
		return JSON.parse(sessionStorage.getItem("logged"));
	};

	// save logged user
	const saveLogged = (userID) => {
		sessionStorage.setItem("logged", JSON.stringify(userID));
	};

	// get favorite of logged user
	const getFavorite = (userID) => {
		// get users list from DB
		let users = dbGetUsers();
		for (let user of users) {
			if (user["id"] == userID) {
				return user["favorite"];
			}
		}
	};

	// save favorite of logged user
	const addFavoriteFood = (userID, foodID) => {
		// get food list from DB
		let users = dbGetUsers();
		// push new food to user favorite food list
		for (let user of users) {
			if (user["id"] == userID) {
				user["favorite"].push(foodID);
			}
		}
		// save new users list to DB
		dbSaveUsers(users);
	};

	// get food list from DB
	const dbGetFood = () => {
		return JSON.parse(localStorage.getItem("food"));
	};

	// save food list to DB
	const dbSaveFood = (data) => {
		localStorage.setItem("food", JSON.stringify(data));
	};

	//--- ELEMENTS ---//
	let $app = document.getElementById("app");

	//logo
	let $logo = document.getElementById("logo");

	// search bar
	let $searchBox = document.getElementById("search-box");

	// nav-bar buttons
	let $signInBtn = document.getElementById("signin-btn");
	let $signUpBtn = document.getElementById("signup-btn");
	let $signOutBtn = document.getElementById("signout-btn");

	// side-bar's elements
	let $sideBar = document.getElementById("side-bar");
	let $homeBtn = document.getElementById("go-home");
	let $collectionBtn = document.getElementById("go-collection");
	let $allFoodBtn = document.getElementById("all-food");

	// intro
	let $intro = document.getElementById("intro");

	// food cards list
	let $foodCardList = document.getElementById("food-card-list");
	let $collectionTitle = document.getElementById("collection-title");
	let $foodCards = document.getElementsByClassName("food-card");
	let $foodPage = document.getElementById("food-page");

	// list of close buttons
	let $closeBtnList = document.getElementsByClassName("close-btn");

	// list of modals
	let $modalList = document.getElementsByClassName("modal");

	// alert modal's elements
	let $alertModal = document.getElementById("alert-modal");
	let $alertContent = document.getElementById("alert-content");

	// signin modal's elements
	let $signInModal = document.getElementById("signin-modal");
	let $signInForm = document.getElementById("signin-form");

	// signup modal's elements
	let $signUpModal = document.getElementById("signup-modal");
	let $signUpForm = document.getElementById("signup-form");

	//--- EVENTS ---//
	// open signin modal
	$signInBtn.addEventListener("click", () => {
		openModal($signInModal);
	});

	// signin as an user when submitting signin form
	$signInForm.addEventListener("submit", (e) => {
		// prevent submission navigate to other page
		e.preventDefault();

		//get cre input form
		let email = $signInForm.email.value;
		let password = $signInForm.password.value;

		// validate empty fields
		if (email == "" || password == "") {
			alertEmptySignUp();
			return;
		}

		// call function signinUser from users.js
		signInUser(email, password);
	});

	// open signup modal
	$signUpBtn.addEventListener("click", () => {
		openModal($signUpModal);
	});

	// create new user when submitting signun form
	$signUpForm.addEventListener("submit", (e) => {
		// prevent submission navigate to other page
		e.preventDefault();

		// get info input form
		let first_name = $signUpForm.first_name.value;
		let last_name = $signUpForm.last_name.value;
		let email = $signUpForm.email.value;
		let password = $signUpForm.password.value;

		// validate empty fields
		if (first_name == "" || last_name == "" || email == "" || password == "") {
			alertEmptySignUp();
			return;
		}

		// call function createNewUser from users.js
		creatNewUser(first_name, last_name, email, password);
	});

	// signout user
	$signOutBtn.addEventListener("click", () => {
		signOutUser();
		homeMainRender();
	});

	// back to home, when clcking logo
	$logo.addEventListener("click", () => {
		homeMainRender();
	});

	// back to home when clcking home option on sidebar
	$homeBtn.addEventListener("click", () => {
		homeMainRender();
	});

	// Go to user collection when clcking home option on sidebar
	$collectionBtn.addEventListener("click", () => {
		userPageRender();
	});

	// Go to all food page when clcking home option on sidebar
	$allFoodBtn.addEventListener("click", () => {
		allFoodPageRender();
	});

	// search food when typing
	$searchBox.addEventListener("input", () => {
		searchFood();
	});

	//--- MODALS FUNCTIONS ---//
	// open a modal
	const openModal = ($modal) => {
		$modal.style.display = "block";
	};

	// clear a form
	const clearForm = ($form) => {
		$form.reset();
	};

	// close a modal
	const closeModal = ($modal) => {
		$modal.style.display = "none";
	};

	// closse modal when clciking on <span> (x)
	for (let btn of $closeBtnList) {
		btn.addEventListener("click", () => {
			for (let modal of $modalList) {
				closeModal(modal);
			}
		});
	}

	// close modal when clicking anywhere outside of the modal content
	window.addEventListener("click", (e) => {
		for (let modal of $modalList) {
			if (modal == e.target) {
				closeModal(modal);
			}
		}
	});

	// open then close alert
	const alertOpenClose = () => {
		openModal($alertModal);
		// delay closing alert
		setTimeout(() => {
			closeModal($alertModal);
		}, 1500);
	};

	// alert empty fields in signup process
	const alertEmptySignUp = () => {
		$alertContent.innerHTML = `
		<h1>Real men DONT'T miss any field !!!</h1>
		<h2>Do it again bro !</h2>
	`;
		alertOpenClose();
	};

	// alert existing user
	const alertShortPassword = () => {
		$alertContent.innerHTML = `
		<h1>Big man need big password, bruh !!!</h1>
		<h2>Put your real, man!</h2>
	`;
		alertOpenClose();
	};

	// alert existing user
	const alertExistUser = () => {
		$alertContent.innerHTML = `
		<h1>Another guy took your chance to become a chef !!!</h1>
		<h2>Take that back or try another !</h2>
	`;
		alertOpenClose();
	};

	// alert cre not match
	const alertNotMatch = () => {
		$alertContent.innerHTML = `
		<h1>Responsible man remembers his marks !!!</h1>
		<h2>Hit your head and don't let your woman wait !</h2>
	`;
		alertOpenClose();
	};

	// alert signin successfully
	const alertSuccessSignIn = () => {
		$alertContent.innerHTML = `
		<h1>Welcome big man !!!</h1>
		<h2>Let's do some dish for your queen!</h2>
	`;
		alertOpenClose();
	};

	// alert signout successfully
	const alertSuccessSignOut = () => {
		$alertContent.innerHTML = `
		<h1>See ya , Bro !!!</h1>
		<h2>Hope to see you soon!</h2>
	`;
		alertOpenClose();
	};

	//--- USERS FUNCTIONS ---//
	// create user
	const creatNewUser = (first_name, last_name, email, password) => {
		//load users list from DB
		let users = dbGetUsers();

		// verify password
		if (password.length < 6) {
			loggedUser("hello");
			alertShortPassword();
			return;
		}

		// validate existing user by email
		for (let user of users) {
			if (user.email == email) {
				// call function alertExistUser from modals.js
				$signUpForm.password.value = "";
				alertExistUser();
				return;
			}
		}

		// add new user to users list
		users.push({
			id: users.length + 1,
			first_name: first_name,
			last_name: last_name,
			email: email,
			password: password,
			favorite: [],
		});

		// call function clearSignUpForm from modals.js
		clearForm($signUpForm);
		closeModal($signUpModal);

		// save new users list to DB
		dbSaveUsers(users);
		// signin for newly created user
		signInUser(email, password);
	};

	// signin as a user
	const signInUser = (email, password) => {
		// get users list from DB
		let users = dbGetUsers();
		let loggingUser = null;
		// validate password matchs email
		for (let user of users) {
			if (user.email == email && user.password == password) {
				loggingUser = user;
				// save logged user to session
				saveLogged(loggingUser.id);
				// clear signin form
				clearForm($signInForm);
				// close signin modal
				closeModal($signInModal);
				// open modal success signin
				alertSuccessSignIn();
				// render user UI
				homeMainRender();
				return;
			}
		}
		// alert no match
		alertNotMatch();
		$signInForm.password.value = "";
	};

	// signout an user
	const signOutUser = () => {
		saveLogged("");
		alertSuccessSignOut();
		homeMainRender();
	};

	//--- FOOD FUNCTIONS ---//

	// create food card
	const createFoodCard = (food) => {
		return `
	<div class="food-card center">
    <div class="food-card-content center"> 
      <div class="food-id">${food["id"]}</div>
      <div class="food-img">
        <img src=${food["thumbnail"]} />
      </div>
      <div class="food-name">
        <span>${food["name"]}</span>
      </div>
      <div class="food-des">
        <span>
          ${food["description"]}
        </span>
      </div>
    </div>
    <button class="card-btn">Cook this!</button>
  </div>
	`;
	};

	// show food cards list
	const showFoodCardsList = (food_list) => {
		// create food cards list content
		let foodCardListContent = "";
		for (let food of food_list) {
			foodCardListContent += createFoodCard(food);
		}
		// add food cards list content
		$foodCardList.innerHTML = foodCardListContent;
		$foodCardList.style.display = "flex";
		//
		getFoodCards();
	};

	// show food cards on landing
	const showLandingFoodCards = () => {
		// get food list from DB
		let food_list = dbGetFood();
		let landing_food_list = food_list.slice(0, 12);
		//
		showFoodCardsList(landing_food_list);
	};

	// show food cards on landing
	const showAllFoodCards = () => {
		// get food list from DB
		let food_list = dbGetFood();
		//
		showFoodCardsList(food_list);
	};

	// show user favorite food list
	const showUserFavorite = (userID) => {
		// get food list from DB
		let food_list = dbGetFood();
		let user_favorite = getFavorite(userID);
		let user_favorite_food_list = [];
		// add food from db to user favorite food list base on ID
		for (let foodID of user_favorite) {
			for (let food of food_list) {
				if (food["id"] == foodID) {
					user_favorite_food_list.push(food);
				}
			}
		}
		//
		showFoodCardsList(user_favorite_food_list);
	};

	// search food
	const searchFood = () => {
		let searchInput = $searchBox.value.toUpperCase();
		console.log(searchInput);
		let food_list = dbGetFood();
		let searchResult = [];
		for (let food of food_list) {
			if (food["name"].toUpperCase().includes(searchInput) == true) {
				searchResult.push(food);
			}
		}
		//
		showFoodCardsList(searchResult);
		window.scrollTo(0, 400);
	};
	const showFoodDetail = (food) => {
		//
		let foodIngredients = ``;
		for (let item of food["ingredients"]) {
			let ingredient = `
      <li>
        <span>${item}</span>
      </li>
      `;
			foodIngredients += ingredient;
		}
		//
		let stepContent = ``;
		for (let step of food["steps"]) {
			let stepDetail = `
      <li class="step-detail center">
        <div class="step-id">
        ${step["id"]}
        </div>
        <div class="step-content">
        ${step["content"]}
        </div>
      </li>      
    `;
			stepContent += stepDetail;
		}
		//
		let foodDetail = `
      <div class="food-content center"> 
        <div class="food-img center">
          <img src=${food["thumbnail"]} />
        </div>
        <div class="food-name">
          <h2>${food["name"]}</h2>
        </div>
        <div class="food-des">
          <span>
            ${food["description"]}
          </span>
        </div>
        <div class="directions center">
          <div class="food-ingredients center">
            <h3>Ingredients:</h3>
            <ul class="ingredients">
              ${foodIngredients}
            </ul>
          </div>
          <div class="vertical-line"></div>
          <div class="food-steps center">
            <h3>Directions:</h3>
            <ul class="steps center">
              ${stepContent}
            </ul>
          </div>
        </div>
      </div>
    `;
		$foodPage.innerHTML = foodDetail;
		$foodPage.style.display = "flex";
	};

	//--- DISPLAY FUNCTIONS---//
	// home render
	const homeMainRender = () => {
		smoothLoad();
		// check whether logged user or not
		if (loggedUser() == "") {
			// render homepage WITHOUT logged user
			$signInBtn.style.display = "block";
			$signUpBtn.style.display = "block";
			$signOutBtn.style.display = "none";
			//
			$sideBar.style.display = "none";
		} else {
			// render homepage WITH logged user
			$signInBtn.style.display = "none";
			$signUpBtn.style.display = "none";
			$signOutBtn.style.display = "block";
			//
			$sideBar.style.display = "flex";
		}
		//
		$intro.style.display = "flex";
		//
		$collectionTitle.style.display = "none";
		showLandingFoodCards();
		//
		$foodPage.style.display = "none";
		// scroll to top
		window.scrollTo(0, 0);
	};

	// user page while user logged
	const userPageRender = () => {
		smoothLoad();
		let userID = loggedUser();
		//
		$signInBtn.style.display = "none";
		$signUpBtn.style.display = "none";
		$signOutBtn.style.display = "block";
		//
		$sideBar.style.display = "flex";
		//
		$intro.style.display = "none";
		//
		$collectionTitle.innerHTML = `<h1>Your Dish Collection Here!!!</h1>`;
		$collectionTitle.style.display = "flex";
		showUserFavorite(userID);
		//
		$foodPage.style.display = "none";
		// scroll to top
		window.scrollTo(0, 0);
		//
	};

	const allFoodPageRender = () => {
		smoothLoad();
		let userID = loggedUser();
		//
		$signInBtn.style.display = "none";
		$signUpBtn.style.display = "none";
		$signOutBtn.style.display = "block";
		//
		$sideBar.style.display = "flex";
		//
		$intro.style.display = "none";
		//
		$collectionTitle.innerHTML = `<h1>All Our Dishes For You Here!!!</h1>`;
		$collectionTitle.style.display = "flex";
		showAllFoodCards();
		//
		$foodPage.style.display = "none";
		// scroll to top
		window.scrollTo(0, 0);
		//
	};

	// render food page
	const foodPageRender = (foodID) => {
		smoothLoad();
		if (loggedUser() == "") {
			// render homepage WITHOUT logged user
			$signInBtn.style.display = "block";
			$signUpBtn.style.display = "block";
			$signOutBtn.style.display = "none";
			$sideBar.style.display = "flex";
			$collectionBtn.style.display = "none";
		} else {
			// render homepage WITH logged user
			$signInBtn.style.display = "none";
			$signUpBtn.style.display = "none";
			$signOutBtn.style.display = "block";
			$sideBar.style.display = "flex";
			$collectionBtn.style.display = "flex";
		}
		//
		$intro.style.display = "none";
		//
		$collectionTitle.style.display = "none";
		$foodCardList.style.display = "none";
		//
		let food_list = dbGetFood();
		for (let food of food_list) {
			if (food["id"] == foodID) {
				showFoodDetail(food);
			}
		}
		//
		window.scrollTo(0, 0);
	};

	const getFoodCards = () => {
		$foodCards = document.getElementsByClassName("food-card");
		// click on a food card
		for (let $card of $foodCards) {
			let $cookBtn = $card.querySelector(".card-btn");
			let foodID = $card.querySelector(".food-id").innerHTML;
			$cookBtn.addEventListener("click", (e) => {
				foodPageRender(foodID);
			});
		}
	};

	// smooth load
	const smoothLoad = () => {
		$app.className = "fade";
		window.setTimeout(function () {
			$app.className = "";
		}, 400);
	};
	homeMainRender();
};

//--- WAIT DOM LOADED ---//
document.addEventListener("DOMContentLoaded", () => {
	// setup DB
	importUsers();
	importFood();
	initLogged();
	// wait for data loading
	if (
		JSON.parse(localStorage.getItem("users")) == undefined ||
		JSON.parse(localStorage.getItem("food")) == undefined
	) {
		setTimeout(() => {
			main();
		}, 2000);
	} else {
		main();
	}
});
