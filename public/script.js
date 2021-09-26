window.addEventListener('load', async () => {
    const inputTitle = document.getElementById('input-title')
        , inputBody = document.getElementById('input-body')
        , submitBtn = document.getElementById('submit-btn')
        , postList = document.getElementById('post-list')
        , updateBtn = document.getElementsByClassName('update-btn')
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

        if (!inputTitle.value || !inputBody.value) {
            inputField(inputTitle, inputBody);
        } else {
            inputField(inputTitle, inputBody);
            let data = { title: inputTitle.value, body: inputBody.value }
                , { id } = this.dataset;

            if (id) {
                let { title, body, _id, message } = await apiRequest(`/api/posts/update/${id}`, 'patch', data);
                if (_id) {
                    let updated = document.getElementById('updated')
                        , postTitle = updated.getElementsByTagName('h4')[0]
                        , postBody = updated.getElementsByTagName('p')[0];

                    postTitle.innerText = title;
                    postBody.innerText = body;

                    this.removeAttribute('data-id');
                    updated.removeAttribute('id');
                    inputTitle.value = '';
                    inputBody.value = '';
                } else {
                    alert(message);
                }
            } else {
                let { title, body, _id, message } = await apiRequest('/api/posts/create', 'post', data);
                if (_id) {
                    let post = createList(title, body, _id);
                    deletePost(post.getElementsByClassName('delete-btn')[0])
                    updatePost(post.getElementsByClassName('update-btn')[0], submitBtn, inputTitle, inputBody);
                    postList.prepend(post);
                    inputTitle.value = '';
                    inputBody.value = '';
                } else {
                    alert(message)
                }
            }
        }
    })

    for (i = 0; i < deletesBtn.length; i++) {
        deletePost(deletesBtn[i]);
        updatePost(updateBtn[i], submitBtn, inputTitle, inputBody);
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
async function updatePost(updateBtn, submitBtn, inputTitle, inputBody) {
    updateBtn.addEventListener('click', async function (event) {
        let post = event.path.find(element => element.className === 'post')
            , { id } = post.dataset
            , postTitle = post.getElementsByTagName('h4')[0]
            , postBody = post.getElementsByTagName('p')[0];

        inputTitle.value = postTitle.textContent;
        inputBody.value = postBody.textContent;
        submitBtn.setAttribute('data-id', id);
        post.setAttribute('id', 'updated');
    })
}

// delete post
async function deletePost(deleteBtn) {
    deleteBtn.addEventListener('click', async function (event) {
        let post = event.path.find(element => element.className === 'post')
            , { id } = post.dataset
            , { message, deleted } = await apiRequest(`/api/posts/delete/${id}`, 'delete');
        if (deleted) {
            alert(message);
            post.remove();
        } else {
            alert(message);
        }
    })
}

// input Errors
function inputField(inputTitle, inputBody) {
    inputTitle.style.borderColor = inputTitle.value ? 'lightgray' : 'crimson';
    inputBody.style.borderColor = inputBody.value ? 'lightgray' : 'crimson';
}

// create post List
function createList(title, body, id) {
    let elements = `<div class="left">
        <h4>${title}</h4>
        <p>${body}</p>
        </div>
        <div class="right">
        <svg class="update-btn">
        <use xlink:href="edit-pencil.svg#pencil" />
        </svg>
        <svg class="delete-btn">
        <use xlink:href="trash.svg#trash" />
        </svg>
        </div>`

    let div = document.createElement('div')
    div.setAttribute('class', 'post')
    div.setAttribute('data-id', id)
    div.innerHTML = elements;
    return div;
}