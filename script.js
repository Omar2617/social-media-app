let currentPage = 1;
let lastPage = 1;

function getPosts(reload = true, page = 1) {
    let postsContainer = document.getElementById("posts");
    if(reload) {
        postsContainer.innerHTML = "";
    }
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=4&page=${page}`)
    .then((response) => {
        const data = response.data.data;
        console.log(data);
        lastPage = response.data.meta.last_page;
        for(post of data) {
            const author = post.author;
            postsContainer.innerHTML += `
                <!-- Post -->
                <div class="card mb-3 mt-3 container shadow" id="post${post.id}">
                    <div class="py-2 px-1 d-flex align-items-center">
                        <img src="${author.profile_image}" id="profileImg" class="profile-img rounded-circle">
                        <span id="username" class="mx-3 text-opacity-50">@${author.username}</span>
                    </div>
                    <img src="${post.image}" id="postImg" class="post-img card-img-top rounded">
                    <div class="card-body">
                        <h5 class="card-title" id="post${post.id}Title">${post.title??""}</h5>
                        <p class="card-text" id="post${post.id}Body">${post.body??""}</p>
                        <p class="card-text"><small class="text-body-secondary">Last updated ${post.created_at}</small></p>
                        <div>
                            <i class="bi bi-pen" style="cursor: pointer;"></i>
                            <span id="commentsCount">(${post.comments_count}) Comments</span>
                            <div id="post${post.id}Tags" class="d-inline-flex flex-wrap"></div>
                            <div class="input-group mb-3 my-3">
                                <input type="text" class="form-control" placeholder="Comment" aria-label="Recipient's username" aria-describedby="button-addon2">
                                <button class="btn btn-outline-secondary" type="button" id="button-addon2">Send</button>
                            </div>
                            <div id="post${post.id}Comments" class="comments-container"></div>
                        </div>
                    </div>
                </div>
                <!--// Post //-->    
            `;
            let tagsContainer = document.getElementById(`post${post.id}Tags`);
            for(let i = 0; i < post.tags.length; i++) {
                tagsContainer.innerHTML += `
                    <span class="bg-secondary p-1 m-1 rounded text-light" id="post${post.id}Tag${i}">${post.tags[i].name}</span>
                `;
            };
        };
    })
    .catch((error) => {
        appendAlert(error.message, "danger");
    });
};

function login() {
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    axios.post("https://tarmeezacademy.com/api/v1/login",{
        "username" : loginUsername.value,
        "password" : loginPassword.value
    })
    .then((response) => {
        loginUsername.value = "";
        loginPassword.value = "";
        document.getElementById("loginCloseBtn").click();

        const data = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        appendAlert('Login is Successfully!', 'success');    
        setupUi();   
    })
    .catch((error) => {
        appendAlert(error.response.data.message, 'danger');
    });
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
        let data = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        registerUsername.value = "";
        registerName.value = "";
        registerEmail.value = "";
        registerPassword.value = "";
        registerImage.value = ""; 
        regiserCloseBtn.click();

        appendAlert('Regiser is Successfully!', 'success');
        setupUi();
    })
    .catch((error) => {
        appendAlert(error.response.data.message, "danger");
    });
};

function logout() {
    localStorage.clear();
    setupUi();
}

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

function setupUi() {
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const createPostBtn = document.getElementById("createPostBtn");
    const navImg = document.getElementById("navImg");
    const navUsername = document.getElementById("navUsername");
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if(user && token) {
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "block";
        createPostBtn.style.display = "block";
        navImg.innerHTML = `<img  src="${user.profile_image}" class="rounded-circle" style="height: 40px; width: 40px;">`;
        navUsername.innerHTML = `@${user.username}`;
    } else {
        loginBtn.style.display = "block";
        registerBtn.style.display = "block";
        logoutBtn.style.display = "none";
        createPostBtn.style.display = "none";
        navImg.innerHTML = "";
        navUsername.innerHTML = "";
    };
};

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
        postTitleInput.value = "";
        postBodyInput.value = "";
        postImageInput.value = "";
        document.getElementById("createPostCloseBtn").click();
        appendAlert("The post has been created successfully", "success"); 
        getPosts();
    })
    .catch((error) => {
        appendAlert(error.response.data.message, "danger");
    });
}

window.addEventListener('scroll', () => {
    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

    if (isAtBottom && currentPage < lastPage) {
        currentPage++;
        getPosts(false,currentPage);
    }
  });

document.addEventListener("DOMContentLoaded", () => {
    setupUi();
    getPosts();
});