module Chapters.Form.InputFloat exposing (..)

import ElmBook.Actions exposing (updateState)
import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import Html as H
import W.InputFloat


type alias Model =
    { value : W.InputFloat.Value
    , value2 : W.InputFloat.Value
    , validation : Maybe (Result (List W.InputFloat.Error) Float)
    }


init : Model
init =
    { value = W.InputFloat.init (Just 1.2)
    , value2 = W.InputFloat.init Nothing
    , validation = Nothing
    }


chapter_ : Chapter { x | inputFloat : Model }
chapter_ =
    chapter "Input Float"
        |> renderStatefulComponentList
            [ ( "Default"
              , \{ inputFloat } ->
                    H.div []
                        [ W.InputFloat.view
                            [ W.InputFloat.placeholder "Type something…"
                            ]
                            { value = inputFloat.value
                            , onInput =
                                \v ->
                                    updateState
                                        (\model ->
                                            let
                                                inputFloat_ : Model
                                                inputFloat_ =
                                                    model.inputFloat
                                            in
                                            { model
                                                | inputFloat =
                                                    { inputFloat_ | value = v }
                                            }
                                        )
                            }
                        ]
              )
            , ( "With Validation"
              , \{ inputFloat } ->
                    H.div []
                        [ W.InputFloat.viewWithValidation
                            [ W.InputFloat.placeholder "Type something…"
                            ]
                            { value = inputFloat.value2
                            , onInput =
                                \result v ->
                                    updateState
                                        (\model ->
                                            let
                                                inputFloat_ : Model
                                                inputFloat_ =
                                                    model.inputFloat
                                            in
                                            { model
                                                | inputFloat =
                                                    { inputFloat_ | value2 = v, validation = Just result }
                                            }
                                        )
                            }
                        , inputFloat.validation
                            |> Maybe.map
                                (\validation ->
                                    case validation of
                                        Ok f ->
                                            H.text (String.fromFloat f)

                                        Err errors ->
                                            H.div
                                                []
                                                (errors
                                                    |> List.map
                                                        (\error -> H.p [] [ H.text (W.InputFloat.errorToString error) ])
                                                )
                                )
                            |> Maybe.withDefault (H.text "")
                        ]
              )
            ]
