const express = require('express');
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const { response } = require("express");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(
    session({
        saveUninitialized: true,
        key: "userId",
        secret: "Password",
        resave: true,
        cookie: {
            expires: 60 * 60 * 24 * 100,
        },
    })
);
const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"Hristian@5",
    database:"mydatabase",

});

app.post('/register', (req, res) => {
    const username = req.body.username; 
    const password = req.body.password; 
    const name = req.body.name; 
    const telephone = req.body.telephone; 
    const position = req.body.position; 
    const role = req.body.role; 
  
    if (!username || !password || !name || !telephone || !position || !role) {
      res.send("Please fill in all the required fields.");
      return;
    }
  
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, result) => {
          if (err) {
              console.log(err);
              res.send("An error occurred, please try again later.");
          }
          else if (result.length > 0) {
              res.send("Username already exists, please choose a different one.");
          }
          else {
              bcrypt.hash(password, saltRounds, (err, hash) => {
                  if (err) {
                      console.log(err);
                      res.send("An error occurred, please try again later.");
                  }
                  else {
                      db.query(
                          "INSERT INTO users (username, password, name, telephone, position, role) VALUES (?, ?, ?, ?, ?, ?)",
                          [username, hash, name, telephone, position, role],
                          (err, result) => {
                              if (err) {
                                  console.log(err);
                                  res.send("An error occurred, please try again later.");
                              }
                              else {
                                  res.send("User registered successfully.");
                              }
                          }
                      );
                  }
              });
          }
      }
    );
  });

app.post('/clientRegister', (req, res) => {
    const username = req.body.username; 
    const password = req.body.password; 
    const first_name = req.body.first_name; 
    const last_name = req.body.last_name; 
    const telephone = req.body.telephone; 
    const adress = req.body.adress; 
  
    if (!username || !password || !first_name || !last_name || !telephone || !adress) {
      res.send("Please fill in all the required fields.");
      return;
    }
  
    db.query(
      "SELECT * FROM clients WHERE username = ?",
      [username],
      (err, result) => {
          if (err) {
              console.log(err);
              res.send("An error occurred, please try again later.");
          }
          else if (result.length > 0) {
              res.send("Client already exists, please choose a different one.");
          }
          else {
              bcrypt.hash(password, saltRounds, (err, hash) => {
                  if (err) {
                      console.log(err);
                      res.send("An error occurred, please try again later.");
                  }
                  else {
                      db.query(
                          "INSERT INTO clients (username, password, first_name, last_name, telephone, adress) VALUES (?, ?, ?, ?, ?, ?)",
                          [username, hash, first_name, last_name, telephone, adress],
                          (err, result) => {
                              if (err) {
                                  console.log(err);
                                  res.send("An error occurred, please try again later.");
                              }
                              else {
                                  res.send("Client registered successfully.");
                              }
                          }
                      );
                  }
              });
          }
      }
    );
  });

app.post('/purchasesRegister', (req, res) => {
    const buyer = req.body.buyer; 
    const product = req.body.product; 
    const purchase_date = req.body.purchase_date; 
    const quantity = req.body.quantity; 
    const priceForOne = req.body.priceForOne; 
    const price = req.body.price; 
    const adress = req.body.adress; 

    if (!buyer || !product || !purchase_date || !quantity || !priceForOne || !price || !adress) {
        res.send("Please fill in all the required fields.");
        return;
    }

    db.query(
        "SELECT * FROM clients WHERE username = ?",
        [buyer],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send("An error occurred, please try again later.");
            }
            else if(result.length > 0) {
                db.query(
                    "INSERT INTO purchases (buyer, product, purchase_date, quantity, priceForOne, price, adress) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [buyer, product, purchase_date, quantity, priceForOne, price,  adress],
                    (err, result) => {
                        if (err) {
                            console.log(err);
                            res.send("An error occurred, please try again later.");
                        }
                        else {
                            res.send("Purchase registered successfully.");
                        }
                    }
                ); 
            }
            else{
                res.send("A client with this name doesn't exist.");
            }     
        }
    );
});
  

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    }
    else{
        res.send({loggedIn: false });
    }
});

app.post('/login', (req, res)=>{

    const username = req.body.username; 
    const password = req.body.password; 

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, result) => {
            if (err){
                console.log(err);
            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user = result;
                        console.log(req.session.user);
                        res.send(result);
                    }
                    else {
                        res.send({ message: "Wrong username/password combination"});
                    }
                });
            } 
            else {
                res.send({ message: "Wrong username/password combination"});
            }
        }
    );
});





app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});


app.get("/users/search", (req, res) => {
    const searchTerm = req.query.term;
    db.query(`SELECT * FROM users WHERE username LIKE '%${searchTerm}%' OR name LIKE '%${searchTerm}%'`, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: "An error occured" });
        } else {
            res.send({ message: "User deleted successfully" });
        }
    });
});

app.put("/users/:id", (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    console.log(req);
    console.log(userId);
    db.query(
        "UPDATE users SET ? WHERE id = ?",
        [updatedUser, userId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send({ error: "An error occured" });
            } else {
                console.log(result);
                res.send({ message: "User updated successfully" });
            }
        }
        );
});




app.get("/clients", (req, res) => {
    db.query("SELECT * FROM clients", (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/clients/search", (req, res) => {
    const searchTerm = req.query.term;
    db.query(`SELECT * FROM clients WHERE username LIKE '%${searchTerm}%'`, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.put("/clients/:id", (req, res) => {
    const clientId = req.params.id;
    const updatedClient = req.body;
    console.log(req);
    console.log(clientId);

    db.query(
        "UPDATE clients SET ? WHERE id = ?",
        [updatedClient, clientId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send({ error: "An error occured" });
            } else {
                console.log(result);
                res.send({ message: "Client updated successfully" });
            }
        }
        );
});

app.delete("/clients/:id", (req, res) => {
    const clientId = req.params.id;
    db.query("DELETE FROM clients WHERE id = ?", [clientId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: "An error occured" });
        } else {
            res.send({ message: "Clients deleted successfully" });
        }
    });
});

app.get("/clients/purchase", (req, res) => {
    const buyer = req.query.username;
    db.query(`SELECT * FROM clients WHERE username = '${buyer}'`, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(result);
      }
    });
});



app.get("/purchases/client", (req, res) => {
    const username = req.query.buyer;
    db.query(`SELECT * FROM purchases WHERE buyer = '${username}'`, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

app.get("/purchases", (req, res) => {
    db.query("SELECT * FROM purchases", (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/purchases/search", (req, res) => {
    const searchTerm = req.query.term;
    db.query(`SELECT * FROM purchases WHERE buyer LIKE '%${searchTerm}%' OR product LIKE '%${searchTerm}%'`, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.put("/purchases/:id", (req, res) => {
    const purchaseId = req.params.id;
    const updatedPurchase = req.body;
    console.log(req);
    console.log(purchaseId);
    db.query(
        "UPDATE purchases SET ? WHERE id = ?",
        [updatedPurchase, purchaseId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.send({ error: "An error occured" });
            } else {
                console.log(result);
                res.send({ message: "Purchase updated successfully" });
            }
        }
        );
});

app.delete("/purchases/:id", (req, res) => {
    const purchaseId = req.params.id;
    db.query("DELETE FROM purchases WHERE id = ?", [purchaseId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: "An error occured" });
        } else {
            res.send({ message: "Purchase deleted successfully" });
        }
    });
});

app.listen(5000, () => {console.log("server on 5000")}) 