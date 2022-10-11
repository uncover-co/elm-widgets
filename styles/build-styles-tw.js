const fs = require("fs");
const file = fs.readFileSync("./styles/output/index.css", "utf-8");

fs.writeFileSync(
  "./src/W/StylesTw.elm",
  `module W.StylesTw exposing (globalStyles)

{-|

@docs globalStyles

-}

import Html as H exposing (Html)

{-| -}
globalStyles : Html msg
globalStyles =
    H.node "style"
        []
        [ H.text """${file}""" ]`
);
