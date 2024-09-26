
### **Create Ticket (`api/Ticket/create`)**

- **Method:** `POST`
- **Input:**

    ```json
    {
      "ticketId": "TIC05",
      "sellerId": "USER01",
      "name": "Concert Ticket",
      "cost": 150.00,
      "location": "Stadium",
      "startDate": "2024-09-25T19:30:00",
      "status": 1,
      "image": "https://example.com/image.jpg",
      "CategoriesId": ["CAT01","CAT02"]
    }
    ```
- **Output:**
    ```json
    {
        "message": "Successfully created Ticket"
    }
    ```
### **Get All Ticket (`api/Ticket/read`)**

- **Method:** `GET`
- **Output:**
    ```json
    [
        {
        "ticketId": "TIC01",
        "sellerId": "USER01",
        "name": "Foolball Ticket",
        "cost": 50,
        "location": "Stadium",
        "startDate": "2024-10-01T18:00:00",
        "createDate": "2024-09-21T13:21:54.6280427",
        "modifyDate": "2024-09-21T13:21:54.6281001",
        "status": 1,
        "image": "ticket-image-url.jpg"
    },
    {
        "ticketId": "TIC02",
        "sellerId": "USER01",
        "name": "Concert Ticket",
        "cost": 50,
        "location": "Stadium",
        "startDate": "2024-10-01T18:00:00",
        "createDate": "2024-09-21T13:24:07.9679199",
        "modifyDate": "2024-09-21T13:24:07.9679204",
        "status": 1,
        "image": "ticket-image-url.jpg"
    }
   
    ]
    ```
### **Get Ticket By Id, Name, Date**

**`api/Ticket/readbyid/{id}`**

**`api/Ticket/readbyname/{name}`**

**`api/Ticket/readbydate/{date}`**

- **Method:** `GET`
- **Output:**
    ```json
    [
      {
        "ticketId": "TIC02",
        "sellerId": "USER01",
        "name": "Concert Ticket",
        "cost": 50,
        "location": "Stadium",
        "startDate": "2024-10-01T18:00:00",
        "createDate": "2024-09-21T13:24:07.9679199",
        "modifyDate": "2024-09-21T13:24:07.9679204",
        "status": 1,
        "image": "ticket-image-url.jpg"
      }
   
    ]
    ```  



### **Update Ticket By Id**
(`api/Ticket/update/{id}`)

- **Method:** `PUT`
- **Input:**
    ```json
    {
      "name": "Concert Ticket",
      "cost": 50.00,
      "location": "Park",
      "startDate": "2024-10-01T18:00:00",
      "status": 1,
      "image": "ticket-image-url.jpg"
    }
    ```
- **Output:**
    ```json
    {
        "message": "Successfully updated Ticket"
    }
    ```

### **Delete Ticket by Id**

**`api/Ticket/delete/{id}`**

- **Method:** `DELETE`
- **Output:**

    ```json
    {
       "message": "Successfully deleted Ticket(s) with id: TIC01"
    }
    ```
---
