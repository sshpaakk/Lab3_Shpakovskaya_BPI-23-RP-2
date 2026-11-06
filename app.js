// Получаем элементы страницы
const loadButton = document.getElementById("loadButton");
const posts = document.getElementById("posts");
const postForm = document.getElementById("postForm");
const createButton = document.getElementById("createButton");
const message = document.getElementById("message");

// Отображение сообщений с кодом
function showMessage(text, type, status) {
    message.textContent = "Код: " + status + ". " + text;
    message.className = type;
}

// Отображение публикации
function showPost(title, body, id, status) {
    const post = document.createElement("div");
    post.className = "post";

    const postTitle = document.createElement("h3");
    postTitle.textContent = title;

    const postBody = document.createElement("p");
    postBody.textContent = body;

    post.appendChild(postTitle);
    post.appendChild(postBody);

    if (id !== undefined) {
        const postId = document.createElement("p");
        postId.textContent = "ID публикации: " + id;
        post.appendChild(postId);
    }

    if (status !== undefined) {
        const postStatus = document.createElement("p");
        postStatus.textContent = "HTTP-код: " + status;
        post.appendChild(postStatus);
    }

    posts.appendChild(post);
}

// Загрузка публикаций через GET-запрос
async function loadPosts() {
    loadButton.disabled = true;

    showMessage("Загрузка публикаций...", "", "ожидание");

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts?_limit=5"
        );

        if (!response.ok) {
            throw new Error("Ошибка HTTP: " + response.status);
        }

        const data = await response.json();
        posts.innerHTML = "";

        data.forEach(function(post) {
            showPost(post.title, post.body, post.id, response.status);
        });

        showMessage(
            "Публикации успешно загружены!",
            "success",
            response.status
        );

    } catch (error) {
        const status = error.message.match(/Ошибка HTTP: (\d+)/);
        const code = status ? status[1] : "сетевая ошибка";

        showMessage(
            "Не удалось загрузить публикации. " + error.message,
            "error",
            code
        );

    } finally {
        loadButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadPosts);

// Создание публикации через POST-запрос
postForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();

    // Проверка заполнения полей
    if (title === "" || body === "") {
        showMessage(
            "Заполните заголовок и текст!",
            "error",
            "400 (валидация)"
        );
        return;
    }

    createButton.disabled = true;

    showMessage("Отправка публикации...", "", "ожидание");

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    body: body,
                    userId: 1
                })
            }
        );

        if (!response.ok) {
            throw new Error("Ошибка HTTP: " + response.status);
        }

        const newPost = await response.json();

        showPost(
            newPost.title,
            newPost.body,
            newPost.id,
            response.status
        );

        showMessage(
            "Публикация успешно создана! ID: " + newPost.id,
            "success",
            response.status
        );

        postForm.reset();

    } catch (error) {
        const status = error.message.match(/Ошибка HTTP: (\d+)/);
        const code = status ? status[1] : "сетевая ошибка";

        showMessage(
            "Не удалось создать публикацию. " + error.message,
            "error",
            code
        );

    } finally {
        createButton.disabled = false;
    }
});