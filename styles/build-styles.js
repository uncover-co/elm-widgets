const fs = require("fs");

const file =
    fs
        .readFileSync("./styles/output/index.css", "utf-8")
        .replace(/\\(?!\\)/g, "\\\\")

fs.writeFileSync(
    "./src/W/Styles.elm",
    `module W.Styles exposing (baseTheme, globalStyles)

{-|

@docs globalStyles

-}

import Html as H
import Theme


{-| -}
baseTheme : H.Html msg
baseTheme =
    Theme.globalProvider Theme.lightTheme


{-| -}
globalStyles : H.Html msg
globalStyles =
    H.node "style"
        []
        [ H.text """${file}""" ]`
);
