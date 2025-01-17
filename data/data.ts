import { ILanguage, IQuest, Difficulty } from "../types/quest";
import languageData from "./languages.json";
import arrays from "./quests/arrays.json";
import dynamicProgramming from "./quests/dynamicProgramming.json";
import hashingDS from "./quests/hashingDS.json";
import linkedLists from "./quests/LinkedLists.json";
import other from "./quests/other.json";
import sql from "./quests/sql.json";
import strings from "./quests/strings.json";
import trees from "./quests/trees.json";

export const languageObjects: ILanguage[] = [...languageData].sort((a, b) => {
  const priority = {
    'SQL': 3,
    'Python (local)': 2,
    'Pseudocode': 1
  };
  return (priority[b.name] || 0) - (priority[a.name] || 0) || a.name.localeCompare(b.name);
});

export const questions: IQuest[] = [...arrays, ...dynamicProgramming, ...hashingDS, ...linkedLists, ...other, ...sql, ...strings, ...trees].map((question) => ({
  ...question,
  difficulty: question.difficulty as Difficulty,
})).sort((a, b) => a.title.localeCompare(b.title));

export const database_schema_markdown = `## Table: Products
| Column Name   | Data Type      | Constraints                  |
|---------------|----------------|------------------------------|
| ProductId     | INTEGER        | PRIMARY KEY, NOT NULL        |
| ProductName   | VARCHAR(30)    | NOT NULL                     |
| CalcCosts     | DECIMAL(6, 2)  | NULLABLE                     |
| Stock         | INTEGER        | NULLABLE                     |
| MinStock      | INTEGER        | NULLABLE                     |
| Price         | DECIMAL(8, 2)  | NOT NULL                     |

---

## Table: Suppliers
| Column Name   | Data Type      | Constraints                  |
|---------------|----------------|------------------------------|
| SupplierId    | INTEGER        | PRIMARY KEY, NOT NULL        |
| SupplierName  | VARCHAR(30)    | NOT NULL                     |

---

## Table: Customers
| Column Name   | Data Type      | Constraints                  |
|---------------|----------------|------------------------------|
| CustomerId    | INTEGER        | PRIMARY KEY, NOT NULL        |
| CustomerName  | VARCHAR(30)    | NOT NULL                     |
| CustomerCity  | VARCHAR(30)    | NOT NULL                     |

---

## Table: Orders
| Column Name   | Data Type      | Constraints                  |
|---------------|----------------|------------------------------|
| OrderId       | INTEGER        | PRIMARY KEY, NOT NULL        |
| SupplierId    | INTEGER        | NOT NULL, REFERENCES Suppliers(SupplierId) |
| OrderDate     | DATE           | NOT NULL                     |
| Delivered     | INTEGER        | DEFAULT 0                    |

---

## Table: OrderItems
| Column Name   | Data Type      | Constraints                  |
|---------------|----------------|------------------------------|
| OrderId       | INTEGER        | PRIMARY KEY (composite), REFERENCES Orders(OrderId) |
| ProductId     | INTEGER        | PRIMARY KEY (composite), REFERENCES Products(ProductId) |
| Quantity      | INTEGER        | NOT NULL                     |

---

## Table: CustomerOrders
| Column Name   | Data Type      | Constraints                  |
|---------------|----------------|------------------------------|
| OrderId       | INTEGER        | PRIMARY KEY, NOT NULL        |
| CustomerId    | INTEGER        | NOT NULL, REFERENCES Customers(CustomerId) |
| OrderDate     | DATE           | NOT NULL                     |

---

## Table: CustomerOrderItems
| Column Name   | Data Type      | Constraints                  |
|---------------|----------------|------------------------------|
| OrderId       | INTEGER        | PRIMARY KEY (composite), REFERENCES CustomerOrders(OrderId) |
| ProductId     | INTEGER        | PRIMARY KEY (composite), REFERENCES Products(ProductId) |
| Quantity      | INTEGER        | NOT NULL                     |

---

## Table: Departments
| Column Name          | Data Type      | Constraints              |
|-----------------------|----------------|--------------------------|
| DepartmentId         | INTEGER        | PRIMARY KEY, NOT NULL    |
| DepartmentName       | VARCHAR(30)    | UNIQUE, NOT NULL         |
| ManagerPersonnelId   | INTEGER        | NULLABLE                 |

---

## Table: Employees
| Column Name   | Data Type      | Constraints                  |
|---------------|----------------|------------------------------|
| PersonnelId   | INTEGER        | PRIMARY KEY, NOT NULL        |
| Name          | VARCHAR(30)    | NOT NULL                     |
| Salary        | DECIMAL(8, 2)  | NULLABLE                     |
| DepartmentId  | INTEGER        | REFERENCES Departments(DepartmentId) |

---

## Table: SupplierProducts
| Column Name   | Data Type      | Constraints                  |
|---------------|----------------|------------------------------|
| SupplierId    | INTEGER        | PRIMARY KEY (composite), REFERENCES Suppliers(SupplierId) |
| ProductId     | INTEGER        | PRIMARY KEY (composite), REFERENCES Products(ProductId) |

---

## Table: ProductReviews
| Column Name   | Data Type      | Constraints                  |
|---------------|----------------|------------------------------|
| CustomerId    | INTEGER        | PRIMARY KEY (composite), REFERENCES Customers(CustomerId) |
| ProductId     | INTEGER        | PRIMARY KEY (composite), REFERENCES Products(ProductId) |
| Review        | VARCHAR(1000)  | NULLABLE                     |
| Rating        | INTEGER        | NOT NULL, CHECK (Rating >= 1 AND Rating <= 5) |
| ReviewDate    | DATE           | NOT NULL                     |
`
