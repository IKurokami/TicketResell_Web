
### **Create Category (`api/Category/create`)**

- **Method:** `POST`
- **Input:**

    ```json
    {
      "CategoryId" : "CAT04",
      "Name" : "Movie",
      "Description" : "The movie you can see"
    }
    ```
- **Output:**
    ```json
    {
        "message": "Successfully created Category"
    }
    ```
### **Get All Categories (`api/Category/read`)**

- **Method:** `GET`
- **Output:**
    ```json
    [
       {
        "categoryId": "CAT01",
        "name": "Music",
        "description": "All music events and concerts"
    },
    {
        "categoryId": "CAT02",
        "name": "Sports",
        "description": "All sports-related events"
    },
    {
        "categoryId": "CAT03",
        "name": "Technology",
        "description": "Tech conferences and events"
    },
    {
        "categoryId": "CAT04",
        "name": "Movie",
        "description": "The movie you can see"
    }
    ]
    ```
### **Get Category By Id**

**`api/Category/read/{id}`**

- **Method:** `GET`
- **Output:**
    ```json
    [
      {
        "CategoryId" : "CAT04",
        "Name" : "Movie",
        "Description" : "The movie you can see"
      }
    ]
    ```

### **Update Category By Id**
(`api/Category/update/{id}`)

- **Method:** `PUT`
- **Input:**
    ```json
    {
      "Name" : "Football",
      "Description" : "The movie you can see"
    }
    ```
- **Output:**
    ```json
    {
        "message": "Successfully updated Category"
    }
    ```

### **Delete Category by Id**

**`api/Category/delete/{id}`**

- **Method:** `DELETE`
- **Output:**

    ```json
    {
       "message": "Successfully deleted Category with id: CAT04"
    }
    ```
---
