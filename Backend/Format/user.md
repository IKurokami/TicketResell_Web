### **Create User (`api/user/create`)**

- **Method:** `POST`
- **Input:**

    ```json
    {
        "username": "aaa",
        "email": "aaa.doe@aaaa.com",
        "passwordhash": "hashed_password_here",
        "usertype": "staff"
    }
    ```
- **Output:**
    ```json
    {
        "message": "something"
    }
    ```

---

### **Get All Users (`api/user/read`)**

- **Method:** `GET`
- **Output:**
    ```json
    [
        {
            "userId": 1,
            "username": "john_doe",
            "email": "john@example.com",
            "phoneNumber": "1234567890",
            "profilePicture": "profile1.jpg",
            "bio": "Loves music and events.",
            "socialId": "social_1",
            "createdAt": "2024-09-10T06:28:58.6066667",
            "userType": "buyer",
            "rating": 4.5,
            "isVerified": true
        }, ...
    ]
    ```

---

### **Get User by Id, Username**

**`api/user/read/{id:int}`**

**`api/user/read/{username}`**
- **Method:** `GET`
- **Output:**
    ```json
    {
        "userId": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "phoneNumber": "1234567890",
        "profilePicture": "profile1.jpg",
        "bio": "Loves music and events.",
        "socialId": "social_1",
        "createdAt": "2024-09-10T06:28:58.6066667",
        "userType": "buyer",
        "rating": 4.5,
        "isVerified": true
    }
    ```

---

### **Update User by Id**

**`api/user/update/{id:int}`**

**`api/user/update/{username}`**

- **Method:** `PUT`
- **Input:**
    ```json
    {
        "username": "exampleUser",
        "email": "example@example.com",
        "phonenumber": "123-456-7890",
        "passwordhash": "hashedPassword123",
        "profilepicture": "http://example.com/profile.jpg",
        "bio": "This is a short bio about the user."
    }
    ```
- **Output:**
    ```json
    {
        "message": "Successfully update user with id: 7"
    }
    ```

---

### **Delete User by Id (`api/user/delele/{id}`)**

- **Method:** `DELETE`
- **Output:**

    ```json
    {
        "message": "Successfully delete user with id: 8"
    }
    ```
