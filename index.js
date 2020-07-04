const express = require("express");
const exphbs = require("express-handlebars");
const fetch = require("node-fetch");
const path = require("path");
// eslint-disable-next-line no-unuded-vars
const helpers = require("handlebars-helpers")(["string"]);

const PORT = process.env.PORT || 5003;

const app = express();

const catchErrors = (asyncFunction) => (...args) =>
  asyncFunction(...args).catch(console.error);

const getAllPokemon = catchErrors(async () => {
  const res = await fetch(" https://pokeapi.co/api/v2/pokemon?limit=151");
  const json = await res.json();
  console.table(json.results);
  return json;
});

const getPokemon = catchErrors(async (pokemon = "1") => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  const json = await res.json();
  return json;
});

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.get(
  "/",
  catchErrors(async (req, res) => {
    const pokemons = await getAllPokemon();
    res.render("home", { pokemons });
  })
);

app.get(
  "/:pokemon",
  catchErrors(async (req, res) => {
    const search = req.params.pokemon;
    const pokemon = await getPokemon(search);
    res.render("pokemon", { pokemon });
  })
);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
