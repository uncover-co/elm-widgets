const fs = require("fs");
const postcss = require("postcss");

const source = fs.readFileSync("./styles/styles.pcss");

postcss([
  require("postcss-import"),
  require("postcss-nested"),
  require("autoprefixer"),
  require("cssnano"),
])
  .process(source, {
    from: "./styles/styles.pcss",
    to: "./src/W/Styles.elm",
  })
  .then((result) => {
    fs.writeFileSync(
      "./src/W/Styles.elm",
      `module W.Styles exposing (globalStyles)

{-|

@docs globalStyles

-}

import Html as H exposing (Html)


{-| -}
globalStyles : Html msg
globalStyles =
    H.node "style"
        []
        [ H.text """${result.content}""" ]`
    );
  });
