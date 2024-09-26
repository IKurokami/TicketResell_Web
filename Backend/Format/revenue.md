### **Create Revenue (`api/Revenue/create`)**

- **Method:** `POST`
- **Input:**

  ```json
  {
    "RevenueId": "R01",
    "SellerId": "USER01",
    "Revenue1": "100000"
  }
  ```

- **Output:**
  ```json
  {
    "message": "Successfully created Revenue"
  }
  ```

### **Get All Revenue (`api/Revenue/read`)**

- **Method:** `GET`
- **Output:**
  ```json
  [
    {
      "revenueId": "R01",
      "sellerId": "USER01",
      "startDate": "2024-09-20T02:33:44.5644136",
      "endDate": "2024-10-20T02:33:44.5644136",
      "revenue1": 100000,
      "type": "month"
    }
  ]
  ```

### **Get Revenue By Id,SellerId**

**`api/Revenue/readbyid/{id}`**

**`api/Revenue/readbysellerid/{Sellerid}`**

- **Method:** `GET`
- **Output:**
  ```json
  [
    {
      "revenueId": "R01",
      "sellerId": "USER01",
      "startDate": "2024-09-20T02:33:44.5644136",
      "endDate": "2024-10-20T02:33:44.5644136",
      "revenue1": 100000,
      "type": "month"
    }
  ]
  ```

### **Update Revenue By SellerId** 
(`api/Revenue/update/{id}`)

- **Method:** `PUT`
- **Input:**
  ```json
  {
    "revenue1": 3400000
  }
  ```
- **Output:**
  ```json
  {
    "message": "Successfully update revenue with id: USER01"
  }
  ```

### **Delete Revenue by Id,SellerId**

**`api/Revenue/delete/{id}`**

**`api/Revenue/deletebysellerid/{Sellerid}`**

- **Method:** `DELETE`
- **Output:**

  ```json
  {
    "message": "Successfully delete Revenue with id: 4"
  }
  ```

---
