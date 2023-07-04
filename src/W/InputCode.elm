module W.InputCode exposing (view)

import Array
import Html as H
import Html.Attributes as HA


view :
    { length : Int
    , value : String
    }
    -> H.Html msg
view props =
    if props.length <= 0 then
        H.div [] []

    else
        let
            valueLetters : Array String
            valueLetters =
                props.value
                    |> String.split ""
                    |> Array.fromList
        in
        H.label
            []
            [ H.input [] []
            , H.div
                []
                (props.length
                    |> List.range 0
                )
            ]
