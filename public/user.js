let user_info = document.getElementById("user_info");
let user_img = document.getElementById("user_img");
let loader = document.getElementById("loader");
let user_section = document.getElementById("user_section");
let back_btn = document.getElementById("back_btn");

back_btn.addEventListener("click", function () {
    window.location.href = "index.html";
});

async function user() {
    try {
        const reponse = await fetch(`/backend/user`);
        const data = await reponse.json();
        if (!data.user) {
            return;
        } else {
            const backend_cache = await check_cache(data.user); //calling the cache data in Backend.
            if (backend_cache) return;
            user_info_(data.user);
        }
    } catch (error) {
        console.error(error);
    }
}
user();

async function user_info_(user) {
    user_section.style.display = "none";
    loader.style.display = "flex";
    try {
        const reponse = await fetch(` https://api.github.com/users/${user}`);
        const data = await reponse.json();
        send_backend(user, data);// calling for cache data store in Backend.
        if (data.login === undefined) {
            document.getElementById('user_info').innerHTML = `<h2>requests limit cross!</h2>`;
            user_section.style.display = "flex";
            loader.style.display = "none";
            user_section.style.height = "auto";
            return;
        } else {
            render_user_info(data);
        }
    } catch (error) {
        document.getElementById('user_info').innerHTML = "<p> error fethching user </p>";
    }
}

function render_user_info(data) {
    user_section.style.display = "flex";
    loader.style.display = "none";
    document.getElementById("user_img").innerHTML = `
            <img src= ${data.avatar_url} width= "220"/>
            `;
    document.getElementById('user_info').innerHTML = `
            <h2>Github User ID:${data.login || "user id"}</h2>
            <h3>Full Name(real name):${data.name || "full name"}</h3>
            <p>Email:${data.email || "Not Provided!"}</p>
            <p>Bio:${data.bio || "Not Provided!"}</p>
            <p>Following:${data.following || "Not Provided!"}</p>
            <p>Followers:${data.followers || "Not Provided!"}</p>
            <p>Location:${data.location || "Not Provided!"}</p>
            <p>Twitter Username:${data.twitter_username || "Not Provided!"}</p>
            <p>Public Repos:${data.public_repos || "Not Provided!"}</p>
            <p>Company:${data.company || "Not Provided!"}</p>
            <a href=${data.html_url} target="_blank">View Profile</a>
            <a href=${data.blog} target="_blank">Blog:${data.blog || "N/A"}</a>
            `;
}

async function send_backend(user, obj_) {// sending data for cacheing to Backend.
    try {
        const response = await fetch("/user/cache", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, obj_ })
        })
        if (response.ok) {
            const results = await response.json();
        }
    } catch (error) {
        console.error(error)
    }

}

async function check_cache(user) {
    try {
        const response = await fetch("/user/cache/take");
        if (response.ok) {
            const results = await response.json();
            if (!results || !results.obj) {
                return false;
            }
            if (results.obj.user === user) {
                console.log("_");
                render_user_info(results.obj.obj_)
                return true;
            }
        }
    } catch (error) {
        console.error(error)
    }

}