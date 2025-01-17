-- Enable foreign key support in SQLite
PRAGMA foreign_keys = ON;

-- 1) Create the Products table first (referenced by several other tables)
CREATE TABLE Products (
    ProductId       INTEGER NOT NULL PRIMARY KEY,
    ProductName     VARCHAR(30) NOT NULL,
    CalcCosts       DECIMAL(6, 2),
    Stock           INTEGER,
    MinStock        INTEGER,
    Price           DECIMAL(8, 2) NOT NULL
);

-- 2) Create the Suppliers table (referenced by Orders and SupplierProducts)
CREATE TABLE Suppliers (
    SupplierId      INTEGER NOT NULL PRIMARY KEY,
    SupplierName    VARCHAR(30) NOT NULL
);

-- 3) Create the Customers table (referenced by ProductReviews and CustomerOrders)
CREATE TABLE Customers (
    CustomerId      INTEGER NOT NULL PRIMARY KEY,
    CustomerName    VARCHAR(30) NOT NULL,
    CustomerCity    VARCHAR(30) NOT NULL
);

-- 4) Create the Orders table (references Suppliers)
CREATE TABLE Orders (
    OrderId     INTEGER NOT NULL PRIMARY KEY,
    SupplierId  INTEGER NOT NULL REFERENCES Suppliers(SupplierId),
    OrderDate   DATE NOT NULL,
    Delivered   INTEGER DEFAULT 0
);

-- 5) Create the OrderItems table (references Orders and Products)
CREATE TABLE OrderItems (
    OrderId     INTEGER NOT NULL REFERENCES Orders(OrderId),
    ProductId   INTEGER NOT NULL REFERENCES Products(ProductId),
    Quantity    INTEGER NOT NULL,
    PRIMARY KEY (OrderId, ProductId)
);

-- 6) Create the CustomerOrders table (references Customers)
CREATE TABLE CustomerOrders (
    OrderId     INTEGER NOT NULL PRIMARY KEY,
    CustomerId  INTEGER NOT NULL REFERENCES Customers(CustomerId),
    OrderDate   DATE NOT NULL
);

-- 7) Create the CustomerOrderItems table (references CustomerOrders and Products)
CREATE TABLE CustomerOrderItems (
    OrderId     INTEGER NOT NULL REFERENCES CustomerOrders(OrderId),
    ProductId   INTEGER NOT NULL REFERENCES Products(ProductId),
    Quantity    INTEGER NOT NULL,
    PRIMARY KEY (OrderId, ProductId)
);

-- 8) Create the Departments table (Employees will reference this)
CREATE TABLE Departments (
    DepartmentId        INTEGER NOT NULL PRIMARY KEY,
    DepartmentName      VARCHAR(30) NOT NULL UNIQUE,
    ManagerPersonnelId  INTEGER
);

-- 9) Create the Employees table (references Departments)
CREATE TABLE Employees (
    PersonnelId     INTEGER NOT NULL PRIMARY KEY,
    Name            VARCHAR(30) NOT NULL,
    Salary          DECIMAL(8, 2),
    DepartmentId    INTEGER REFERENCES Departments(DepartmentId)
);

-- 10) Create the SupplierProducts table (references Suppliers and Products)
CREATE TABLE SupplierProducts (
    SupplierId  INTEGER NOT NULL REFERENCES Suppliers(SupplierId),
    ProductId   INTEGER NOT NULL REFERENCES Products(ProductId),
    PRIMARY KEY (SupplierId, ProductId)
);

-- 11) Create the ProductReviews table (references Customers and Products)
CREATE TABLE ProductReviews (
    CustomerId  INTEGER NOT NULL REFERENCES Customers(CustomerId),
    ProductId   INTEGER NOT NULL REFERENCES Products(ProductId),
    Review      VARCHAR(1000),
    Rating      INTEGER NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    ReviewDate  DATE NOT NULL,
    PRIMARY KEY (CustomerId, ProductId)
);

------------------------------------------------------------
-- Insert data into the tables
------------------------------------------------------------

INSERT INTO Products (ProductId, ProductName, CalcCosts, Stock, MinStock, Price)
VALUES
    (1, 'SuperTech Laptop Pro', 500.00, 20, 5, 999.99),
    (2, 'PrintMaster X500',     150.00, 15, 3, 129.99),
    (3, 'SmartGadget X3',       300.00, 30, 10, 499.99),
    (4, 'UltraTab S',           200.00, 25, 8, 299.99),
    (5, 'SoundBlitz HD Headphones', 50.00, 4, 15, 79.99);

INSERT INTO Customers (CustomerId, CustomerName, CustomerCity)
VALUES
    (1, 'John Doe',    'New York'),
    (2, 'Jane Smith',  'Los Angeles'),
    (3, 'Bob Johnson', 'Chicago'),
    (4, 'Emily Brown', 'Chicago'),
    (5, 'Alice White', 'San Francisco');

INSERT INTO ProductReviews (CustomerId, ProductId, Review, Rating, ReviewDate)
VALUES
    (1, 1, 'Great laptop, very fast!',            5, '2023-04-01'),
    (2, 2, 'Good printer for the price.',         4, '2023-06-02'),
    (2, 3, 'Love the features on this smartphone.', 5, '2023-06-02'),
    (3, 4, 'Tablet is lightweight and portable.', 4, '2023-10-04'),
    (4, 5, 'Excellent sound quality!',            5, '2023-12-05'),
    (5, 5, 'Pro: Great sound. Con: Uncomfortable after long use.', 3, '2023-05-10');

INSERT INTO Suppliers (SupplierId, SupplierName)
VALUES
    (1, 'TechWonders Ltd.'),
    (2, 'OfficeTech Innovations'),
    (3, 'ElectroGlobe Enterprises'),
    (4, 'MobileInnovate Solutions');

INSERT INTO SupplierProducts (SupplierId, ProductId)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (4, 5);

INSERT INTO Orders (OrderId, SupplierId, OrderDate, Delivered)
VALUES
    (1, 1, '2023-12-06', 0),
    (2, 2, '2023-01-07', 1),
    (3, 3, '2023-12-08', 0),
    (4, 4, '2023-08-09', 1);

INSERT INTO OrderItems (OrderId, ProductId, Quantity)
VALUES
    (1, 1, 10),
    (2, 2, 5),
    (3, 3, 15),
    (4, 4, 8);

INSERT INTO CustomerOrders (OrderId, CustomerId, OrderDate)
VALUES
    (1, 1, '2023-03-29'),
    (2, 2, '2023-06-01'),
    (3, 3, '2023-10-01'),
    (4, 4, '2023-11-18'),
    (5, 5, '2023-05-15');

INSERT INTO CustomerOrderItems (OrderId, ProductId, Quantity)
VALUES
    (1, 1, 2),
    (2, 2, 1),
    (2, 3, 1),
    (3, 4, 3),
    (4, 5, 2),
    (5, 5, 1);

INSERT INTO Departments (DepartmentId, DepartmentName, ManagerPersonnelId)
VALUES
    (1, 'IT',        101),
    (2, 'Sales',     102),
    (3, 'Finance',   103),
    (4, 'Marketing', 104);

INSERT INTO Employees (PersonnelId, Name, Salary, DepartmentId)
VALUES
    (101, 'Alice Johnson',   80000.00, 1),
    (102, 'Bob Smith',       75000.00, 2),
    (103, 'Charlie Brown',   90000.00, 3),
    (104, 'David White',     70000.00, 2),
    (105, 'Emma Davis',      85000.00, 4);

