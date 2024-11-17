


const Workout = require('./models/workout');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

module.exports = function (app, passport) {
    // Home route
    app.get('/', (req, res) => res.render('index'));

    // Login route
    app.get('/login', (req, res) => res.render('login', { message: req.flash('loginMessage') }));
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // Signup route
    app.get('/signup', (req, res) => res.render('signup', { message: req.flash('signupMessage') }));
    app.post('/signup', async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await new User({ email: req.body.email, password: hashedPassword }).save();
            res.redirect('/login');
        } catch (err) {
            res.redirect('/signup');
        }
    });

    // Profile route
    app.get('/profile', isLoggedIn, async (req, res) => {
      try {
          const workouts = await Workout.find({ userId: req.user._id });
          res.render('profile', { user: req.user, workouts });
      } catch (err) {
          console.error(err);
          res.redirect('/');
      }
  });
  


   

    // Route to add a new workout
   
    app.post('/profile/workouts', isLoggedIn, async (req, res) => {
      try {
          const newWorkout = new Workout({
              title: req.body.title,
              description: req.body.description,
              day: req.body.day,
              userId: req.user._id
          });
          await newWorkout.save();
          res.redirect('/profile'); // Redirect to profile page after adding a workout
      } catch (err) {
          console.error(err);
          res.redirect('/profile');
      }
  });
  
  
  app.put('/workouts/:id', isLoggedIn, async (req, res) => {
    try {
        await Workout.findByIdAndUpdate(req.params.id, { completed: true });
        res.json({ message: 'Workout marked as completed' });
    } catch (err) {
        console.error('Error marking workout as completed:', err);
        res.status(500).json({ error: 'Failed to update workout' });
    }
});









    // Mark workout as completed
    app.put('/workouts/:id', isLoggedIn, async (req, res) => {
        try {
            await Workout.findByIdAndUpdate(req.params.id, { completed: req.body.completed });
            res.json({ message: 'Workout updated' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating workout');
        }
    });

    // Delete a workout
    app.delete('/workouts/:id', isLoggedIn, async (req, res) => {
        try {
            await Workout.findByIdAndDelete(req.params.id);
            res.json({ message: 'Workout deleted' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting workout');
        }
    });

    // Logout
    app.get('/logout', (req, res) => {
        req.logout(() => {
            console.log('User logged out');
        });
        res.redirect('/');
    });

    // Middleware to check if user is authenticated
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }
};
