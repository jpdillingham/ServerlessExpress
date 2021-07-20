const express = require("express");

const app = express();

// because each service is a standalone express app designed to run
// behind API gateway, leave the base route up to the app.
app.use(require('./handlers/customer').app);
app.use(require('./handlers/widget').app);
app.use(require('./handlers/graphql').app);

app.use(require('./middleware/404'));

app.listen(3000, () => console.log('Listening on port 3000.'));