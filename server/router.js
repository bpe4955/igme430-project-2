const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/chat', mid.requiresLogin, controllers.Chat.chatPage);
  app.post('/sendMessage', mid.requiresLogin, controllers.Chat.sendMessage);
  app.get('/getMessages', mid.requiresLogin, controllers.Chat.getMessages);

  app.get('/getColors', mid.requiresLogin, controllers.Account.getColors);
  app.get('/getVip', mid.requiresLogin, controllers.Account.getVIP);
  app.get('/getRooms', mid.requiresLogin, controllers.Account.getRooms);

  app.get('/settings', mid.requiresLogin, controllers.Account.settingsPage);

  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.post('/changeColor', mid.requiresLogin, controllers.Account.changeColor);
  app.post('/changeRoom', mid.requiresLogin, controllers.Account.changeRoom);
  app.post('/changeVIP', mid.requiresLogin, controllers.Account.changeVip);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
