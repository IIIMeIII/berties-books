module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });

    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });

    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });

    app.get('/search-result', function (req, res) {
        // searching the database
        let sqlquery = "SELECT * FROM books WHERE name = ?"; // query database to get all the books where the name is the same as the user input (keyword)
        db.query(sqlquery, [req.query.keyword], (err, result) => {
            if (err) {
                res.redirect("./"); // redirects user back to the home page if there's an error
            } else {
                let newData = Object.assign({}, shopData, {availableBooks:result})
                if (newData.availableBooks.length == 0) {
                    sqlquery = "SELECT * FROM books WHERE name LIKE ?"; // query database to get all the books where the name is similar to the amount of characters the user entered (keyword)
                    db.query(sqlquery, ["%" + req.query.keyword + "%"], (err, result) => { // % represents any number of characters (including 0)
                        if (err) {
                            res.redirect("./");
                        } 
                        else {

                            // merge shopData with the {availableBooks:result} object to create a new object newData to be passed to the ejs file 
                            newData = Object.assign({}, shopData, {availableBooks:result}); 
                            if (newData.availableBooks.length == 0) {
                                res.send("No books found!");
                            } 
                            else {
                                res.render("search-results.ejs", newData);
                            }
                        }
                    })
                } else {
                    res.render("search-results.ejs", newData);
                }
            }
        })
    });

    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    }); 

    app.get('/addbook', function (req,res) {
        res.render('addbook.ejs', shopData);                                                                     
    }); 


    app.get('/list', function(req, res) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }

            // merge shopData with the {availableBooks:result} object to create a new object newData to be passed to the ejs file
            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData);
            res.render("list.ejs", newData);

         });
    });

    app.get('/bargainbooks', function(req, res) {
        let sqlquery = "SELECT * FROM books WHERE price < 20"; // query database to get all books with a price less than £20
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }

            let newData = Object.assign({}, shopData, {availableBooks:result});
            console.log(newData);
            res.render("bargainbooks.ejs", newData);

         });
    });
 
    app.post('/registered', function (req,res) {
        // saving data in database
        res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);                                                                              
    }); 

    app.post('/bookadded', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            res.send(' This book is added to database, name: '
                      + req.body.name + ' price '+ req.body.price);
          }
        });
    });
}
