module UI exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)


hSpacer : List (Html msg) -> Html msg
hSpacer =
    div [ class "ew ew-h-space"]

vSpacer : List (Html msg) -> Html msg
vSpacer =
    div [ class "ew ew-v-space"]
