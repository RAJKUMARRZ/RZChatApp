var User = require('./models/user');
var Session = require('./models/session');

    module.exports = function (app) {
        app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, authorization, x-www-form-urlencoded, application/form-data');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
    // api ---------------------------------------------------------------------


    app.post('/api/signup', function (req, res, next) {
        // confirm that user typed same password twice
        if (req.body.password !== req.body.passwordConf) {
            var err = new Error('Passwords do not match.');
            err.status = 400;
            res.send("passwords don't match");
            return next(err);
        }

        if (req.body.Name &&
            req.body.mobNo &&
            req.body.email &&
            req.body.username &&
            req.body.password &&
            req.body.passwordConf) {

                var userData = {
                Name: req.body.Name,
                mobNo: req.body.mobNo,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                passwordConf: req.body.passwordConf,
            }

            User.create(userData, function (error, user) {
                if (error) {
                    return next(error);
                } else {
                    var userInfo = {};
                    userInfo.token = user._id;
                    userInfo.Name = user.Name;
                    userInfo.mobNo = user.mobNo;
                    userInfo.email = user.email;
                    userInfo.uName = user.username;
                    return res.json(userInfo);
                }
            })
        } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    })

    app.post('/api/login', function (req, res, next) {
        if (req.body.logemail && req.body.logpassword) {
            User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
                if (error || !user) {
                    var err = new Error('Wrong email or password.');
                    err.status = 401;
                    return next(err);
                } else {
                    var userInfo = {};
                    userInfo.Name = user.Name;
                    userInfo.mobNo = user.mobNo;
                    userInfo.email = user.email;
                    Session.create({
                        userId: user._id,
                        userName: user.Name,
                        userUserName: user.username,
                        done: false
                    }, function(err){
                        if(err)
                            res.send(err);
                    })
                    Session.findOne({ userId: user._id }, (err, session) => {
                        if (err) {
                            return done(err, false);
                        } else {
                            userInfo.token = session._id
                            return res.json(userInfo);//session._id);//done(null, user);
                        }
                    });
                    //return res.json(userInfo);
                }
            })
        } else {
            var er = new Error('Email and Password are required');
            er.status = 403;
            return next(er);
        }
    })

    app.get('/logout', function (req, res, next) {
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.send('Log Out Successful');
                }
            });
        }
    });


    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);
            //set function on which we want to send response
            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    /*app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });*/
};
