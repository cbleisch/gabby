Router.configure({
  // the default layout
  layoutTemplate: 'mainNav'
});

Router.route('/', function () {
  this.render('firstPage');
});
 
Router.route('/second', function () {
  this.render('secondPage');
  this.layout('mainSide');
});

Router.route('/chatroom', function () {
  this.render('chatroom');
  this.layout('mainSideWithChat');
});

Router.route('/profile', function () {
  this.render('profile');
});