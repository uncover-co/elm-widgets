module Chapters.Form.InputInt exposing (..)

import ElmBook.Actions exposing (updateState)
import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import Html as H
import W.InputInt


type alias Model =
    W.InputInt.Value


init : Model
init =
    W.InputInt.init (Just 4)


chapter_ : Chapter { x | inputInt : Model }
chapter_ =
    chapter "Input Int"
        |> renderStatefulComponentList
            [ ( "Int"
              , \{ inputInt } ->
                    H.div []
                        [ W.InputInt.view
                            [ W.InputInt.placeholder "Type something…"
                            , W.InputInt.mask (\s -> s ++ s)
                            ]
                            { value = inputInt
                            , onInput =
                                \v -> updateState (\model -> { model | inputInt = v })
                            }
                        ]
              )
            ]
