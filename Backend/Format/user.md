### **Create User (`api/user/create`)**

- **Method:** `POST`
- **Input:**

  ```json
  {
    "UserId": "USER003",
    "Username": "johndsdsoe",
    "Password": "securepassword",
    "Status": 1,
    "Gmail": "johndoe@gmail.com"
  }
  ```

- **Output:**
  ```json
  {
    "message": "Username already exists"
  }
  ```

---
