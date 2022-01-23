var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");


var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from form input
    var username = nameInputEl.value.trim();

    // if running that username works in getUserRepos run it then clear the form
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    // else alert the user their input wasn't accepted
    } else {
        alert("Please enter a Github username");
    }
};

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl)
    .then(function(response){
        // if request was successful
        if (response.ok) {
            response.json().then(function(data) {  
                displayRepos(data, user);
            });
        // if request failed
        } else {
            alert("Error: Github user not found");
        }
    // if connection issue
    }).catch(function(error) {
        // this catch is chained to the end of the ".then"
        alert("Unable to connect to Github");
    });
};

var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // clear old content
    repoContainerEl.textContent = "";
    // display user in subtitle (line 29 data>user was passed to this function and then set in the () of this var to be "searchTerm" so we're setting that info to equal the DOM element we pulled in as repoSearchTerm)
    repoSearchTerm.textContent = searchTerm;
    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        // create span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        // append to container
        repoEl.appendChild(titleEl);
        // create status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            // if it does display an X icon and the number of issues
            statusEl.innerHTML = 
            "<i class = 'fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        // if not display a checkmark
        } else {
            statusEl.innerHTML = 
            "<i class = 'fas fa-check-square status-icon icon-success'></i>";
        }
        // append to container
        repoEl.appendChild(statusEl);
        // append container to the DOM
        repoContainerEl.appendChild(repoEl);
    }

    console.log(repos);
    console.log(searchTerm);
};

userFormEl.addEventListener("submit", formSubmitHandler);