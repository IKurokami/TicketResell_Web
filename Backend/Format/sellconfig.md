### **Create Sell Config (`api/SellConfig/create`)**

- **Method:** `POST`
- **Input:**

```json
{
	"SellConfigId": "SeCo001",
	"Commision"	  : "0.1"
}
```

- **Output:**

```json
{
	"message": "Successfully created sellconfig: ..."
}
```

---

### **Read Sell Config (`api/SellConfig/read`)**

- **Method:** `GET`
- **Output:**

```json
{
	"SellConfigId": "SeCo001",
	"Commision"	  : "0.1"
	...
}
```
---
### **Update Sell Config (`api/SellConfig/update/"id"`)**
												
- **Method:**`PUT`
- **Input:**
```json
{
	"Commision"	  : "0.2""

}
```

- **Output:**


```json
{
	Successfully update sell config:{sellConfigId}
}
```
---

### **Delete Sell Config (`api/SellConfig/delete/"id"`)**

- **Method:**`DELETE`
- **Output:**

```json
{
    "sellConfigId": "SeCo001",
    "commision": 0.2,
    "users": []
}
```
