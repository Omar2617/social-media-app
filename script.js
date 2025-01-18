let logoutBtn = document.getElementById("logoutBtn");
let loginBtn = document.getElementById("loginBtn");
let registerBtn = document.getElementById("registerBtn");
let addPostBtn = document.getElementById("addPostBtn");

function login() {
    const loginCloseBtn = document.getElementById("loginCloseBtn");
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    axios.post("https://tarmeezacademy.com/api/v1/login",{
        "username" : loginUsername.value,
        "password" : loginPassword.value
    })
    .then((response) => {
        const data = response.data;
        loginUsername.value = "";
        loginPassword.value = "";
        loginCloseBtn.click();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        appendAlert('Login is Successfully!', 'success');
        logoutBtn.style.display = "block";
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        addPostBtn.style.display = "block";
    })
    .catch((error) => {
        appendAlert(error.response.data.message, 'danger');
    });
};

function appendAlert(message, type) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
    setTimeout(() => {
        wrapper.style.display = "none";
    }, 3000);
};

function register() {
    const registerUsername = document.getElementById("registerUsername");
    const registerName = document.getElementById("registerName");
    const registerEmail = document.getElementById("registerEmail");
    const registerPassword = document.getElementById("registerPassword");
    const registerImage = document.getElementById("registerImage");
    const regiserCloseBtn = document.getElementById("regiserCloseBtn");

    const formData = new FormData();

    formData.append("username", registerUsername.value);
    formData.append("password", registerPassword.value);
    formData.append("image", registerImage.files[0]);
    formData.append("name", registerName.value);
    formData.append("email", registerEmail.value);
  

    axios.post("https://tarmeezacademy.com/api/v1/register",formData)
    .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        registerUsername.value = "";
        registerName.value = "";
        registerEmail.value = "";
        registerPassword.value = "";
        registerImage.value = "";
        regiserCloseBtn.click();
        appendAlert('Regiser is Successfully!', 'success');
        logoutBtn.style.display = "block";
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        addPostBtn.style.display = "block";
    })
    .catch((error) => {
        appendAlert(error.response.data.message, "danger");
    });
};

function logout() {
    logoutBtn.style.display = "none";
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    addPostBtn.style.display = "none";
    localStorage.clear();
}

function getPosts(limit) {
    let postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=${limit}`)
    .then((response) => {
        const data = response.data.data;
        for(post of data) {
            let author = post.author;
            postsContainer.innerHTML += `
                <!-- Post -->
                <div class="card mb-3 mt-3 container shadow" id="post${post.id}">
                    <div class="py-2 px-1 bg-white d-flex align-items-center">
                        <img src="${author.profile_image}" id="profileImg" class="profile-img rounded-circle">
                        <span id="username" class="mx-3 text-opacity-50">@${author.username}</span>
                    </div>
                    <img src="${post.image}" id="postImg" class="post-img card-img-top rounded">
                    <div class="card-body">
                        <h5 class="card-title" id="post${post.id}Title">${post.title??""}</h5>
                        <p class="card-text" id="post${post.id}Body">${post.body??""}</p>
                        <p class="card-text"><small class="text-body-secondary">Last updated ${post.created_at}</small></p>
                        <div>
                            <i class="bi bi-pen"></i>
                            <span id="commentsCount">(${post.comments_count}) Comments</span>
                            <div id="post${post.id}Tags" class="d-inline-flex flex-wrap"></div>
                        </div>
                    </div>
                </div>
                <!--// Post //-->    
            `;
            let tagsContainer = document.getElementById(`post${post.id}Tags`);
            for(let i = 0; i < post.tags.length; i++) {
                tagsContainer.innerHTML += `
                    <span class="bg-secondary p-1 m-1 rounded text-light" id="post${post.id}Tag${i}">${post.tags.name}</span>
                `;
            };
        };
    })
    .catch((error) => {
        appendAlert(error.message, "danger");
    });
}

function createPostBtnClicked(){
    let postTitleInput = document.getElementById("postTitleInput");
    let postBodyInput = document.getElementById("postBodyInput");
    let postImageInput = document.getElementById("postImageInput");
    let token = localStorage.getItem("token");

    let formData = new FormData();
    
    formData.append("title", postTitleInput.value);
    formData.append("body", postBodyInput.value);
    formData.append("image",postImageInput.files[0]);

    axios.post("https://tarmeezacademy.com/api/v1/posts", formData, {
        headers: {
            "authorization": `Bearer ${token}`,
        }
    })
    .then(() => {
        appendAlert("The post has been created successfully", "success"); 
        getPosts(2);
    })
    .catch((error) => {
        appendAlert(error.response.data.message, "danger");
    });

    postTitleInput.value = "";
    postBodyInput.value = "";
    document.getElementById("createPostCloseBtn").click();
}

document.body.onload = () => {
    if(localStorage.getItem("token")) {
        logoutBtn.style.display = "block";
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        addPostBtn.style.display = "block";
    } else {
        logoutBtn.style.display = "none";
        addPostBtn.style.display = "none";
    }
}

getPosts(2);