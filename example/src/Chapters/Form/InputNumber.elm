module Chapters.Form.InputNumber exposing (..)

import ElmBook.Actions exposing (updateStateWith)
import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import Html as H
import W.InputNumber


type alias Model =
    { int : String
    , float : Maybe Float
    }


init : Model
init =
    { int = "4"
    , float = Just 1.2
    }


chapter_ : Chapter { x | inputNumber : Model }
chapter_ =
    chapter "Input Number"
        |> renderStatefulComponentList
            [ ( "Default"
              , \{ inputNumber } ->
                    H.div []
                        [ W.InputNumber.view
                            [ W.InputNumber.placeholder "Type something…"
                            ]
                            { value = inputNumber.int
                            , onInput =
                                updateStateWith
                                    (\v model ->
                                        let
                                            state =
                                                model.inputNumber
                                        in
                                        { model | inputNumber = { state | int = v } }
                                    )
                            }
                        ]
              )
            ]
