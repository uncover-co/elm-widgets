module Chapters.Form.InputSlider exposing (..)

import ElmBook.Actions exposing (logActionWith, updateStateWith)
import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import W.InputSlider


type alias Model =
    { default : Float
    , customColor : Float
    }


init : Model
init =
    { default = 5
    , customColor = 5
    }


chapter_ : Chapter { m | range : Model }
chapter_ =
    chapter "Input Slider"
        |> renderStatefulComponentList
            [ ( "Default"
              , \{ range } ->
                    W.InputSlider.view []
                        { min = 0
                        , max = 10
                        , step = 1
                        , value = range.default
                        , onInput =
                            updateStateWith
                                (\v model ->
                                    let
                                        range_ =
                                            model.range
                                    in
                                    { model | range = { range_ | default = v } }
                                )
                        }
              )
            , ( "Disabled"
              , \_ ->
                    W.InputSlider.view
                        [ W.InputSlider.disabled True ]
                        { min = 0
                        , max = 10
                        , step = 1
                        , value = 5
                        , onInput = logActionWith String.fromFloat "onInput"
                        }
              )
            , ( "Read Only"
              , \_ ->
                    W.InputSlider.view
                        [ W.InputSlider.readOnly True ]
                        { min = 0
                        , max = 10
                        , step = 1
                        , value = 5
                        , onInput = logActionWith String.fromFloat "onInput"
                        }
              )
            , ( "Custom Color"
              , \{ range } ->
                    W.InputSlider.view
                        [ W.InputSlider.theme
                            { color = "red"
                            , shadow = "rgba(255, 0, 0, 0.1)"
                            }
                        ]
                        { min = 0
                        , max = 10
                        , step = 1
                        , value = range.customColor
                        , onInput =
                            updateStateWith
                                (\v model ->
                                    let
                                        range_ =
                                            model.range
                                    in
                                    { model | range = { range_ | customColor = v } }
                                )
                        }
              )
            ]
