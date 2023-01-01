module Chapters.Form.Field exposing (chapter_)

import ElmBook
import ElmBook.Actions exposing (logActionWith, logActionWithString)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import Html.Attributes as HA
import W.InputField
import W.InputRadio
import W.InputSlider
import W.InputText


chapter_ : Chapter x
chapter_ =
    let
        props :
            { label : List (H.Html (ElmBook.Msg x))
            , input : List (H.Html (ElmBook.Msg x))
            }
        props =
            { label =
                [ H.text "Label" ]
            , input =
                [ H.div [ HA.style "display" "flex", HA.style "flex-direction" "column", HA.style "gap" "20px" ]
                    [ W.InputText.view
                        [ W.InputText.placeholder "..."
                        ]
                        { value = ""
                        , onInput = logActionWithString "onInput"
                        }
                    , W.InputRadio.view
                        []
                        { id = "default"
                        , value = 1
                        , toLabel = String.fromInt
                        , toValue = String.fromInt
                        , options = [ 1, 2, 3 ]
                        , onInput = logActionWith String.fromInt "onInput"
                        }
                    , W.InputSlider.view
                        [ W.InputSlider.readOnly True ]
                        { min = 0
                        , max = 10
                        , step = 1
                        , value = 5
                        , onInput = logActionWith String.fromFloat "onInput"
                        }
                    ]
                ]
            }
    in
    chapter "Input Field"
        |> renderComponentList
            [ ( "Single"
              , W.InputField.view [] props
              )
            , ( "Group + Status"
              , H.div []
                    [ W.InputField.view [] props
                    , W.InputField.view [ W.InputField.hint [ H.text "Try writing some text here." ] ] props
                    , W.InputField.view [ W.InputField.hint [ H.text "Try writing some text here." ] ]
                        props
                    ]
              )
            , ( "Right aligned"
              , H.div []
                    [ W.InputField.view
                        [ W.InputField.alignRight True
                        ]
                        props
                    , W.InputField.view
                        [ W.InputField.alignRight True
                        ]
                        props
                    , W.InputField.view
                        [ W.InputField.alignRight True
                        ]
                        props
                    ]
              )
            ]
