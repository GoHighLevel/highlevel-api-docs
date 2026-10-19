---
tags: [Webhook Events]
---

# Contact

Called whenever a contact is deleted

#### Schema

```json json_schema
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string"
    },
    "locationId": {
      "type": "string"
    },
    "id": {
      "type": "string"
    },
    "address1": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "companyName": {
      "type": "string"
    },
    "country": {
      "type": "string"
    },
    "source": {
      "type": "string"
    },
    "dateAdded": {
      "type": "string"
    },
    "dateOfBirth": {
      "type": "string"
    },
    "dnd": {
      "type": "boolean"
    },
    "email": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "postalCode": {
      "type": "string"
    },
    "state": {
      "type": "string"
    },
    "tags": {
      "type": "array"
    },
    "website": {
      "type": "string"
    },
    "assignedTo": {
      "type": "string"
    },
    "customFields": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "value": {
            "type": ["string", "number", "array", "object"]
          }
        }
      }
    }
  }
}
```

#### Example

```json
{
  "type": "ContactDelete",
  "locationId": "ve9EPM428h8vShlRW1KT",
  "id": "nmFmQEsNgz6AVpgLVUJ0",
  "address1": "3535 1st St N",
  "city": "ruDolomitebika",
  "state": "AL",
  "companyName": "Loram ipsum",
  "country": "DE",
  "source": "xyz form",
  "dateAdded": "2021-11-26T12:41:02.193Z",
  "dateOfBirth": "2000-01-05T00:00:00.000Z",
  "dnd": true,
  "email": "JohnDeo@gmail.comm",
  "name": "John Deo",
  "firstName": "John",
  "lastName": "Deo",
  "phone": "+919509597501",
  "postalCode": "452001",
  "tags": ["id magna sed Lorem", "Duis dolor commodo aliqua"],
  "website": "https://www.google.com/",
  "assignedTo": "nmFmQEsNgz6AVpgLVUJ0",
  "customFields": [
    {
      "id": "BcdmQEsNgz6AVpgLVUJ0",
      "value": "XYZ Corp"
    }
  ]
}
```