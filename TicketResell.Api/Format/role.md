### **Create role (`api/Role/create`)**

- **Method:** `POST`
- **Input:**

```json
{
	"RoleId": "R001",
	"Rolename": "admin"
	"Description": "Control System"
}
```

- **Output:**

```json
{
	"message": "Successfully created role: {roleId}"
}
```

---

### **Read Role (`api/Role/read`)**

- **Method:** `GET`
- **Output:**

```json
{
	"RoleId": "R001",
	"Rolename": "admin",
	"Description": "Control system"
	...
}
```
---
### **Update Role (`api/Role/update/"id"`)**
												
- **Method:**`PUT`
- **Input:**
```json
{
	"Rolename"	  : "staff",
	"Description" : "User Manager"

}
```

- **Output:**


```json
{
	Successfully update role:{roleId}
}
```
---

### **Delete Role (`api/Role/delete/"id"`)**

- **Method:**`DELETE`
- **Output:**

```json
{
    "RoleId": "R001",
    "Rolename": "admin",
    "Description": "Control system"
}
```
