def register(client, email = "ivan@test.com", password = "secret123", name = "Ivan"):
    return client.post("/users/", json = { "email": email, "password": password, "name": name })

def login(client, email = "ivan@test.com", password = "secret123", name = "Ivan"):
    return client.post("/users/token", data = { "username": email, "password": password })

class TestRegister:
    def test_register(self, client):
        response = register(client)
        assert response.status_code == 201

        body = response.json()
        assert body["email"] == "ivan@test.com"
        assert body["name"] == "Ivan"
        assert "hashes_password" not in body

    def test_register_Ivan_again(self, client):
        register(client)
        response = register(client)

        assert response.status_code == 409

class TestLogin:
    def test_login(self, client):
        register(client)
        response = login(client)
        assert response.status_code == 200

        body = response.json()
        assert "access_token" in body
        assert "refresh_token" in body
        assert body["token_type"] == "bearer"

    def test_wrong_login(self, client):
        register(client)
        response = login(client, password = "wrong_password")
        assert response.status_code == 401

    def test_null_login(self, client):
        register(client)
        response = login(client, email = "ghost@test.com")
        assert response.status_code == 401

class TestMe:
    def test_without_token(self, client):
        response = client.get("/users/me")
        assert response.status_code == 401

    def test_token(self, client):
        register(client)
        token = login(client).json()["access_token"]

        response = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        assert response.json()["email"] == "ivan@test.com"
 
    def test_garbage_token(self, client):
        response = client.get("/users/me", headers={"Authorization": "Bearer garbage-token"})
        assert response.status_code == 401
 
 
class TestRefreshToken:
    def test_refresh(self, client):
        register(client)
        refresh_token = login(client).json()["refresh_token"]
 
        response = client.post("/users/refresh-token", params={"refresh_token": refresh_token})
        assert response.status_code == 200
        assert "access_token" in response.json()
 
    def test_garbage_refresh(self, client):
        response = client.post("/users/refresh-token", params={"refresh_token": "garbage"})
        assert response.status_code == 401

class TestUpdateMe:
    def test_update(self, client):
        register(client)
        token = login(client).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
 
        response = client.put("/users/me", json={"name": "Ivan Petrov"}, headers=headers)
        assert response.status_code == 200
        assert response.json()["name"] == "Ivan Petrov"
 
        me_response = client.get("/users/me", headers=headers)
        assert me_response.json()["name"] == "Ivan Petrov"
 
    def test_update_without_token(self, client):
        response = client.put("/users/me", json={"name": "Ivan Petrov"})
        assert response.status_code == 401