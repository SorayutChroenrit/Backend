require("dotenv").config();

const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_DATABASE);

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// GET route to fetch UserAccount data
app.get("/UserAccount", (req, res) => {
  db.query("SELECT * FROM UserAccount", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.send(result);
    }
  });
});
// GET route to fetch Product
app.get("/Product", (req, res) => {
  db.query("SELECT * FROM Product", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.send(result);
    }
  });
});
// GET route to fetch Product
app.get("/Order", (req, res) => {
  db.query("SELECT * FROM `Order`", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.send(result);
    }
  });
});
// GET route to fetch UserAccount data by ID
app.get("/UserAccount/:id", (req, res) => {
  const UserAccountId = req.params.id;
  db.query(
    "SELECT * FROM UserAccount WHERE id = ?",
    [UserAccountId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        if (result.length === 0) {
          res.status(404).json({ error: "UserAccount not found" });
        } else {
          res.send(result[0]); // Assuming UserAccount ID is unique, so returning the first result
        }
      }
    }
  );
});

// POST route to create a new UserAccount
app.post("/createUserAccount", (req, res) => {
  const { username, password, position } = req.body;
  console.log("Received request to create UserAccount:", {
    username,
    password,
    position,
  });

  db.query(
    "INSERT INTO UserAccount (username, password, Position ) VALUES (?, ?, ?)",
    [username, password, position],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ message: "UserAccount created successfully" });
      }
    }
  );
});

// POST route to create a new Product
app.post("/createProduct", (req, res) => {
  const { P_ID, Quantity, P_Name, LastUpdated } = req.body; // Destructure required fields from the request body

  const sql =
    "INSERT INTO Product (P_ID, Quantity, P_Name, LastUpdated) VALUES (?, ?, ?, ?)"; // Define the SQL query

  db.query(
    sql,
    [P_ID, Quantity, P_Name, LastUpdated], // Bind parameters to the query
    (err, result) => {
      if (err) {
        console.error("Error inserting product:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      console.log("Product created successfully");
      res.status(200).json({ message: "Product created successfully" });
    }
  );
});

// POST route to Order a new Product
app.post("/createOrder", (req, res) => {
  const { OrderID, Quantity, P_Name, LastUpdated } = req.body;

  const sql =
    "INSERT INTO `Order` (OrderID, Quantity, P_Name, LastUpdated) VALUES (?, ?, ?, ?)";

  db.query(sql, [OrderID, Quantity, P_Name, LastUpdated], (err, result) => {
    if (err) {
      console.error("Error inserting order:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("Order created successfully");
    res.status(200).json({ message: "Order created successfully" });
  });
});

app.put("/updateUserAccount", (req, res) => {
  const { username, password, position, id } = req.body;

  let updateQuery = "UPDATE UserAccount SET ";
  let params = [];

  if (username !== undefined) {
    updateQuery += "username = ?, ";
    params.push(username);
  }

  if (password !== undefined) {
    updateQuery += "password = ?, ";
    params.push(password);
  }

  if (position !== undefined) {
    updateQuery += "position = ?, ";
    params.push(position);
  }
  // Remove the last comma and space from the query string
  updateQuery = updateQuery.slice(0, -2);

  // Add the WHERE clause to specify the UserAccount ID
  updateQuery += " WHERE id = ?";

  // Add the UserAccount ID parameter
  params.push(id);

  // Execute the update query
  db.query(updateQuery, params, (err, result) => {
    if (err) {
      console.error("Error updating UserAccount:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Send success response if the update was successful
    res.status(200).json({ message: "UserAccount updated successfully" });
  });
});

// PUT route to update a Product
app.put("/updateProduct", (req, res) => {
  const { P_ID, P_Name, Quantity, LastUpdated } = req.body;

  let updateQuery = "UPDATE Product SET ";
  let params = [];

  if (P_Name !== undefined) {
    updateQuery += "P_Name = ?, ";
    params.push(P_Name);
  }

  if (Quantity !== undefined) {
    updateQuery += "Quantity = ?, ";
    params.push(Quantity);
  }

  // Remove the last comma and space from the query string
  updateQuery = updateQuery.slice(0, -2);

  // Add the WHERE clause to specify the Product ID
  updateQuery += " WHERE P_ID = ?";

  // Add the Product ID parameter
  params.push(P_ID);

  // Execute the update query
  db.query(updateQuery, params, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Send success response if the update was successful
    res.status(200).json({ message: "Product updated successfully" });
  });
});

// PUT route to update an Order
app.put("/updateOrder", (req, res) => {
  const { OrderID, Total_Number, Status } = req.body;

  let updateQuery = "UPDATE `Order` SET ";
  let params = [];

  if (Total_Number !== undefined) {
    updateQuery += "Total_Number = ?, ";
    params.push(Total_Number);
  }

  if (Status !== undefined) {
    updateQuery += "Status = ?, ";
    params.push(Status);
  }

  // Remove the last comma and space from the query string
  updateQuery = updateQuery.slice(0, -2);

  // Add the WHERE clause to specify the OrderID
  updateQuery += " WHERE OrderID = ?";

  // Add the OrderID parameter
  params.push(OrderID);

  // Execute the update query
  db.query(updateQuery, params, (err, result) => {
    if (err) {
      console.error("Error updating order:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Send success response if the update was successful
    res.status(200).json({ message: "Order updated successfully" });
  });
});

// DELETE route to delete an UserAccount by ID
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM UserAccount WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.log(result);
      res.status(200).json({ message: "UserAccount deleted successfully" });
    }
  });
});

// DELETE route to delete an Product by ID
app.delete("/deleteProduct/:P_ID", (req, res) => {
  const P_ID = req.params.P_ID;
  db.query("DELETE FROM Product WHERE P_ID = ?", P_ID, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.log(result);
      res.status(200).json({ message: "UserAccount deleted successfully" });
    }
  });
});
// DELETE route to delete an Order by ID
app.delete("/deleteOrder/:OrderID", (req, res) => {
  const OrderID = req.params.OrderID;
  db.query("DELETE FROM `Order` WHERE OrderID = ?", OrderID, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.log(result);
      res.status(200).json({ message: " Order deleted successfully" });
    }
  });
});
// Define a route for the root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Mango Storage System!");
});

const PORT = 3001; // Change the port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
