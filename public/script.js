const inputTitle = document.getElementById('input-title')
    , inputBody = document.getElementById('input-body')
    , submitBtn = document.getElementById('submit-btn')
    , postList = document.getElementById('post-list')
    , cancelBtn = document.getElementById('cancel-btn')

window.addEventListener('load', async () => {
    const updateBtn = document.getElementsByClassName('update-btn')
        , deletesBtn = document.getElementsByClassName('delete-btn')

    // Get all Post
    const allPost = await apiRequest('/api/posts', 'get')
    for (let i = 0; i < allPost?.length; i++) {
        let post = createList(allPost[i].title, allPost[i].body, allPost[i]._id);
        postList.prepend(post);
    }

    // create post
    submitBtn.addEventListener('click', async function (event) {
        event.preventDefault();

        if (!inputField(inputTitle, inputBody)) return;

        let data = { title: inputTitle.value, body: inputBody.value }
            , { id } = this.dataset;
        if (id) {
            await updatePost(id, data)
            return
        }

        let { title, body, _id, message } = await apiRequest('/api/posts/create', 'post', data);
        if (_id) {
            let post = createList(title, body, _id);
            deletePost(post.getElementsByClassName('delete-btn')[0])
            updatePostBtn(post.getElementsByClassName('update-btn')[0]);
            postList.prepend(post);
            inputTitle.value = '';
            inputBody.value = '';
        } else {
            alert(message)
        }
    })

    for (i = 0; i < deletesBtn.length; i++) {
        deletePost(deletesBtn[i]);
        updatePostBtn(updateBtn[i]);
    }
})

// api Request
async function apiRequest(url, method, data) {
    const response = await fetch(url, {
        method: method.toUpperCase(),
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : null
    })

    return await response.json();
}

// update post
async function updatePostBtn(updateBtn) {
    updateBtn.addEventListener('click', async function (event) {
        let post = event.path.find(element => element.className === 'post')
            , { id } = post.dataset
            , postTitle = post.getElementsByTagName('h3')[0]
            , postBody = post.getElementsByTagName('p')[0];

        inputTitle.value = postTitle.textContent;
        inputBody.value = postBody.textContent;
        submitBtn.setAttribute('data-id', id);
        submitBtn.innerText = 'Update'
        submitBtn.classList.add('cancel-active')
        cancelBtn.style.display = 'block'
        post.setAttribute('id', 'updating');
    })
}

// delete post
async function deletePost(deleteBtn) {
    deleteBtn.addEventListener('click', async function (event) {
        if (!confirm('Do you want to delete your post?')) return
        let post = event.path.find(element => element.className === 'post')
            , { id } = post.dataset
            , { message, deleted } = await apiRequest(`/api/posts/delete/${id}`, 'delete');
        if (deleted) {
            post.remove();
        }
        alert(message);
    })
}

// input Errors
function inputField(inputTitle, inputBody) {
    inputTitle.style.borderColor = inputTitle.value ? 'lightgray' : 'crimson';
    inputBody.style.borderColor = inputBody.value ? 'lightgray' : 'crimson';
    if (!inputTitle.value || !inputBody.value) {
        return false
    } else {
        return true
    }
}

// create post List
function createList(title, body, id) {
    let elements = `<div class="left">
        <h3>${title}</h3>
        <p>${body}</p>
        </div>
        <div class="right">
        <svg class="update-btn">
        <use xlink:href="icons/edit-pencil.svg#pencil" />
        </svg>
        <svg class="delete-btn">
        <use xlink:href="icons/trash.svg#trash" />
        </svg>
        </div>`

    let div = document.createElement('div')
    div.setAttribute('class', 'post')
    div.setAttribute('data-id', id)
    div.innerHTML = elements;
    return div;
}

async function updatePost(id, data) {
    let { title, body, _id, message } = await apiRequest(`/api/posts/update/${id}`, 'patch', data);
    if (_id) {
        let updating = document.getElementById('updating')
            , postTitle = updating.getElementsByTagName('h3')[0]
            , postBody = updating.getElementsByTagName('p')[0];

        postTitle.innerText = title;
        postBody.innerText = body;

        updating.removeAttribute('id');
        inputTitle.value = '';
        inputBody.value = '';
        submitBtn.removeAttribute('data-id');
        submitBtn.innerText = 'Submit'
        submitBtn.classList.remove('cancel-active')
        cancelBtn.style.display = 'none'
    } else {
        alert(message);
    }
}

// cancel button

cancelBtn.addEventListener('click', function () {
    document.getElementById('updating').removeAttribute('id');

    submitBtn.removeAttribute('data-id');
    submitBtn.innerText = 'Submit'
    submitBtn.classList.remove('cancel-active')
    this.style.display = 'none'
})