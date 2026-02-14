const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "../Public")));
app.use(express.static(path.join(__dirname, "../View")));

const pageRoutes = require("./Routes/pageRoutes");
app.use("/", pageRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
