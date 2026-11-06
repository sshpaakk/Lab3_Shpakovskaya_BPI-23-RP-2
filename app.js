// Получаем элементы страницы
const loadButton = document.getElementById("loadButton");
const posts = document.getElementById("posts");
const postForm = document.getElementById("postForm");
const createButton = document.getElementById("createButton");
const message = document.getElementById("message");

// Отображение сообщений
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

// Отображение публикации
function showPost(title, body, id) {
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

    posts.appendChild(post);
}

// Загрузка публикаций через GET-запрос
async function loadPosts() {
    loadButton.disabled = true;
    showMessage("Загрузка публикаций...", "");

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
            showPost(post.title, post.body);
        });

        showMessage("Публикации успешно загружены!", "success");

    } catch (error) {
        showMessage(
            "Не удалось загрузить публикации. " + error.message,
            "error"
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
        showMessage("Заполните заголовок и текст!", "error");
        return;
    }

    createButton.disabled = true;
    showMessage("Отправка публикации...", "");

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

        showPost(newPost.title, newPost.body, newPost.id);

        showMessage(
            "Публикация успешно создана! ID: " + newPost.id,
            "success"
        );

        postForm.reset();

    } catch (error) {
        showMessage(
            "Не удалось создать публикацию. " + error.message,
            "error"
        );

    } finally {
        createButton.disabled = false;
    }
});