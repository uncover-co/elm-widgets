module UI exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)


hSpacer : List (Html msg) -> Html msg
hSpacer =
    div
        [ style "display" "flex"
        , style "gap" "8px"
        ]


vSpacer : List (Html msg) -> Html msg
vSpacer =
    div
        [ style "display" "flex"
        , style "flex-direction" "column"
        , style "gap" "8px"
        ]
