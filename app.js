// Получаем элементы страницы
const loadButton = document.getElementById("loadButton");
const posts = document.getElementById("posts");
const postForm = document.getElementById("postForm");
const createButton = document.getElementById("createButton");
const message = document.getElementById("message");

// Функция для отображения сообщений
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

// Функция для отображения публикации
function showPost(title, body, id) {

    // Создаем карточку публикации
    const post = document.createElement("div");
    post.className = "post";

    // Создаем заголовок
    const postTitle = document.createElement("h3");
    postTitle.textContent = title;

    // Создаем текст публикации
    const postBody = document.createElement("p");
    postBody.textContent = body;

    // Добавляем заголовок и текст в карточку
    post.appendChild(postTitle);
    post.appendChild(postBody);

    // Если сервер вернул ID, отображаем его
    if (id !== undefined) {
        const postId = document.createElement("p");
        postId.textContent = "ID публикации: " + id;
        post.appendChild(postId);
    }

    // Добавляем карточку на страницу
    posts.appendChild(post);
}

// Функция загрузки публикаций
async function loadPosts() {

    // Отключаем кнопку на время загрузки
    loadButton.disabled = true;

    // Показываем сообщение о загрузке
    showMessage("Загрузка публикаций...", "");

    try {

        // Отправляем GET-запрос
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts?_limit=5"
        );

        // Проверяем ответ сервера
        if (!response.ok) {
            throw new Error("Ошибка HTTP: " + response.status);
        }

        // Преобразуем ответ в JSON
        const data = await response.json();

        // Очищаем список старых публикаций
        posts.innerHTML = "";

        // Отображаем полученные публикации
        data.forEach(function(post) {
            showPost(post.title, post.body);
        });

        // Показываем сообщение об успехе
        showMessage("Публикации успешно загружены!", "success");

    } catch (error) {

        // Показываем сообщение об ошибке
        showMessage(
            "Не удалось загрузить публикации. " + error.message,
            "error"
        );

    } finally {

        // Снова включаем кнопку
        loadButton.disabled = false;
    }
}

// Обработчик кнопки загрузки
loadButton.addEventListener("click", loadPosts);

// Обработчик формы создания публикации
postForm.addEventListener("submit", async function(event) {

    // Отменяем стандартную отправку формы
    event.preventDefault();

    // Получаем данные из полей
    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();

    // Проверяем заполнение полей
    if (title === "" || body === "") {
        showMessage("Заполните заголовок и текст!", "error");
        return;
    }

    // Отключаем кнопку отправки
    createButton.disabled = true;

    // Показываем сообщение об отправке
    showMessage("Отправка публикации...", "");

    try {

        // Отправляем POST-запрос
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

        // Проверяем ответ сервера
        if (!response.ok) {
            throw new Error("Ошибка HTTP: " + response.status);
        }

        // Получаем созданную публикацию
        const newPost = await response.json();

        // Отображаем публикацию
        showPost(newPost.title, newPost.body, newPost.id);

        // Показываем сообщение об успехе
        showMessage(
            "Публикация успешно создана! ID: " + newPost.id,
            "success"
        );

        // Очищаем форму
        postForm.reset();

    } catch (error) {

        // Показываем сообщение об ошибке
        showMessage(
            "Не удалось создать публикацию. " + error.message,
            "error"
        );

    } finally {

        // Снова включаем кнопку
        createButton.disabled = false;
    }
});