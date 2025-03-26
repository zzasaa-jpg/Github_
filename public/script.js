let form = document.getElementById("form");
let body = document.getElementById("body");
let requests_div = document.getElementById("requests_div");
let loader = document.getElementById("loader");
let container = document.getElementById("container");
let obj = {}; //for cacheing the data.

form.addEventListener("submit", async function (e) {
    container.style.display = "none";
    loader.style.display = "flex";
    e.preventDefault();
    let username = document.getElementById("input").value.trim();
    try {
        //--------------------------------------------------------------
        if (obj?.username === username) {
            console.log("_");
            c(username, true);
            rendring_users(obj.data.items);
            return;
        }
       c(username, false);

        const response = await fetch(`/api/git/users/${username}`);
        const data = await response.json();
        obj = { username, data }
        if (data.total_count === 0) {
            container.style.display = "block";
            loader.style.display = "none";
            document.getElementById('results').innerHTML = `<h2>No user found!</h2>`;
            return;
        } else {
            rendring_users(data.items)
        }
    } catch (error) {
        document.getElementById('results').innerHTML = "<p> error fetching users! </p>";
    }

});

async function requests() {
    try {
        const reponse = await fetch("/api/requests_limit");
        const data = await reponse.json();
        const resetTimeStamp = data.rate.reset * 1000;
        const resetTime = new Date(resetTimeStamp);
        requests_div.innerHTML = `
        <h2>Remaining requests:${data.rate.remaining}/60</h2>
        <h2>Search requests:${data.resources.search.remaining}/10</h2>
        <h2>Reset Time:${resetTime.toLocaleString()}</h2>
        `;
    } catch (error) {
        console.error(error);
    }

}
requests();

let requests_info = false;
window.addEventListener("dblclick", function () {
    requests_info = !requests_info
    if (requests_info) {
        requests_div.style.transform = "translateY(0px)";
        document.getElementById("results").style.display = "none";

    } else {
        requests_div.style.transform = "translateY(-1000vw)";
        document.getElementById("results").style.display = "flex";
    }
});

function rendring_users(data) {
    container.style.display = "block";
    loader.style.display = "none";
    body.style.alignItems = "normal";
    document.getElementById("results").innerHTML = "";
    let array = data;
    data.forEach(user => {
        let users_div = document.createElement("div");
        async function username_push(username_) {
            try {
                await fetch(`/backend/send/user/${username_}`);
            } catch (error) {
                console.error(error);
            }
            window.location.href = "User.html";
        }
        users_div.addEventListener("click", function () {
            username_push(user.login);
        })
        users_div.classList.add("user_div");
        users_div.innerHTML = `
                <img src= ${user.avatar_url} alt="img"/>
                <div id="h2_login">
                <h2>${user.login}</h2>
                </div>`;
        document.getElementById("results").appendChild(users_div);
    })

}

async function c(username, val) {
    const value = await fetch('api/value', {
        method: 'POST', 
        headers: {'Content-Type': "application/json"},
        body: JSON.stringify({value: username, cache: val}),
    });
}