const express = require("express");
const exphbs = require("express-handlebars");
const fetch = require("node-fetch");
const path = require("path");

const PORT = process.env.PORT || 5003;

const app = express();

const getAllPokemon = async () => {
  try {
    const res = await fetch(" https://pokeapi.co/api/v2/pokemon?limit=151");
    const json = await res.json();
    console.table(json.results);
    return json;
  } catch (err) {
    console.log(err);
  }
};

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.get("/", async (req, res) => {
  try {
    const pokemons = await getAllPokemon();
    res.render("home", { pokemons });
  } catch (err) {
    console.log(err);
  }
});

app.get("/:title", (req, res) => {
  const title = req.params.title;
  res.render("about", { title, subTitle: `Ma page ${title}` });
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
