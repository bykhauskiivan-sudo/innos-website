"use strict";

const app = require("./app");

const port = Number(process.env.PORT || 8787);

app.listen(port, () => {
  console.log(`[innos-mailer] listening on port ${port}`);
});
