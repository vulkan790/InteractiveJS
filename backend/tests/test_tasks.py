def register(client, email="author@test.com", password="secret123", name="Author"):
    return client.post("/users/", json={"email": email, "password": password, "name": name})

def login(client, email="author@test.com", password="secret123"):
    return client.post("/users/token", data={"username": email, "password": password})

def make_author(client, promote, email = "author@test.com"):
    register(client, email=email)
    promote(email, "author")
    return login(client, email=email).json()["access_token"]

def make_moderator(client, promote, email = "moderator@test.com"):
    register(client, email=email)
    promote(email, "moderator")
    return login(client, email=email).json()["access_token"]

def make_task_body(**override):
    body = {
        "title": "Проверка числа",
        "description": "Определите знак числа num.",
        "category": "Условные операторы и циклы",
        "category_key": "conditions",
        "difficulty": "medium",
        "input_example": "let num = 5;",
        "output_example": "Положительное",
        "starter_code": "// ваш код\n",
        "solution": "if (num > 0) console.log('Положительное');",
        "tests": [
            {"input": "let num = 5;", "expected": "Положительное"},
            {"input": "let num = -3;", "expected": "Отрицательное"},
        ],
    }
    body.update(override)
    return body

def auth(token):
    return { "Authorization": f"Bearer {token}" }

def create_task(client, token, **override):
    return client.post("/tasks/", json=make_task_body(**override), headers=auth(token))

class TestListTasks:
    def test_empty(self, client):
        response = client.get("/tasks/")
        assert response.status_code == 200
        assert response.json() == []

    def test_without_token(self, client):
        response = client.get("/tasks/")
        assert response.status_code == 200

    def test_hiding_pending(self, client, promote, publish):
        token = make_author(client, promote)
        visible = create_task(client, token, title="Visible").json()
        create_task(client, token, title="Hidden")
        publish(visible["id"])
        titles = [t["title"] for t in client.get("/tasks/").json()]
        assert "Visible" in titles
        assert "Hidden" not in titles

    def test_filter_by_category(self, client, promote, publish):
        token = make_author(client, promote)
        a = create_task(client, token, difficulty="easy").json()
        b = create_task(client, token, difficulty="hard").json()
        publish(a["id"])
        publish(b["id"])
        data = client.get("/tasks/?difficulty=easy").json()
        assert len(data) == 1
        assert data[0]["difficulty"] == "easy"

    def test_filter_combined(self, client, promote, publish):
        token = make_author(client, promote)
        for kwargs in (
            {"category_key": "conditions", "difficulty": "easy"},
            {"category_key": "conditions", "difficulty": "hard"},
            {"category_key": "functions",  "difficulty": "easy"}
        ):
            task = create_task(client, token, **kwargs).json()
            publish(task["id"])

        data = client.get("/tasks/?category_key=conditions&difficulty=easy").json()
        assert len(data) == 1
        assert data[0]["category_key"] == "conditions"
        assert data[0]["difficulty"] == "easy"

    def test_filter_no_match(self, client, promote, publish):
        token = make_author(client, promote)
        task = create_task(client, token, category_key="conditions").json()
        publish(task["id"])
        assert client.get("/tasks/?category_key=does-not-exist").json() == []

class TestGetTask:
    def test_get_published(self, client, promote, publish):
        token = make_author(client, promote)
        task = create_task(client, token).json()
        publish(task["id"])
        response = client.get(f"/tasks/{task['id']}")
        assert response.status_code == 200
        body = response.json()
        assert body["id"] == task["id"]
        assert body["title"] == "Проверка числа"
        assert body["status"] == "published"

    def test_nonexistent(self, client):
        response = client.get("/tasks/99999")
        assert response.status_code == 404

    def test_pending_not_visible(self, client, promote):
        token = make_author(client, promote)
        task = create_task(client, token).json()
        response = client.get(f"/tasks/{task['id']}")
        assert response.status_code == 404

class TestCreateTaskAuth:
    def test_without_token(self, client):
        response = client.post("/tasks/", json=make_task_body())
        assert response.status_code == 401

    def test_garbage_token(self, client):
        response = client.post(
            "/tasks/",
            json=make_task_body(),
            headers={
                "Authorization": "Bearer garbage-token"
            }
        )
        assert response.status_code == 401

    def test_regular_user_forbidden(self, client):
        register(client)
        token = login(client).json()["access_token"]
        response = client.post("/tasks/", json=make_task_body(), headers=auth(token))
        assert response.status_code == 403

    def test_author_ok(self, client, promote):
        token = make_author(client, promote)
        response = create_task(client, token)
        assert response.status_code == 201

    def test_moderator_ok(self, client, promote):
        token = make_moderator(client, promote)
        response = create_task(client, token)
        assert response.status_code == 201

class TestCreateTaskPayload:
    def test_response_fields(self, client, promote):
        token = make_author(client, promote)
        response = create_task(client, token)
        assert response.status_code == 201
        body = response.json()
        assert body["title"] == "Проверка числа"
        assert body["category_key"] == "conditions"
        assert body["difficulty"] == "medium"
        assert body["status"] == "pending"
        assert isinstance(body["author_id"], int)
        assert len(body["tests"]) == 2

    def test_author_id_is_current_user(self, client, promote):
        token = make_author(client, promote, email="alice@test.com")
        me = client.get("/users/me", headers=auth(token)).json()
        response = create_task(client, token)
        assert response.json()["author_id"] == me["id"]

    def test_tests_are_persisted(self, client, promote):
        token = make_author(client, promote)
        response = create_task(client, token, tests=[
            {"input": "a", "expected": "A"},
            {"input": "b", "expected": "B"},
            {"input": "c", "expected": "C"}
        ])
        assert len(response.json()["tests"]) == 3

    def test_create_with_empty_tests(self, client, promote):
        token = make_author(client, promote)
        response = create_task(client, token, tests=[])
        assert response.status_code == 201
        assert response.json()["tests"] == []

class TestCreateTaskValidation:
    def test_missing_title(self, client, promote):
        token = make_author(client, promote)
        payload = make_task_body()
        del payload["title"]
        response = client.post("/tasks/", json=payload, headers=auth(token))
        assert response.status_code == 422

    def test_empty_title(self, client, promote):
        token = make_author(client, promote)
        response = create_task(client, token, title="")
        assert response.status_code == 422

    def test_missing_solution(self, client, promote):
        token = make_author(client, promote)
        payload = make_task_body()
        del payload["solution"]
        response = client.post("/tasks/", json=payload, headers=auth(token))
        assert response.status_code == 422

    def test_empty_solution(self, client, promote):
        token = make_author(client, promote)
        response = create_task(client, token, solution="")
        assert response.status_code == 422

    def test_empty_expected(self, client, promote):
        token = make_author(client, promote)
        response = create_task(client, token, tests=[{"input": "x", "expected": ""}])
        assert response.status_code == 422