module Chapters.Form.Field exposing (chapter_)

import ElmBook
import ElmBook.Actions exposing (logActionWith, logActionWithString)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import Html.Attributes as HA
import W.Field
import W.InputText
import W.InputRadio
import W.InputSlider


chapter_ : Chapter x
chapter_ =
    let
        props :
            { label : H.Html (ElmBook.Msg x)
            , input : H.Html (ElmBook.Msg x)
            }
        props =
            { label = H.text "Label"
            , input =
                H.div [ HA.style "display" "flex", HA.style "flex-direction" "column", HA.style "gap" "20px" ] [
                W.InputText.view
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
            }
    in
    chapter "Field"
        |> renderComponentList
            [ ( "Single"
              , W.Field.view [] props
              )
            , ( "Group + Status"
              , H.div []
                    [ W.Field.view [] props
                    , W.Field.view [ W.Field.hint "Try writing some text here." ] props
                    , W.Field.view
                        [ W.Field.hint "Try writing some text here."
                        , W.Field.success "Pretty good text you wrote there!"
                        ]
                        props
                    , W.Field.view
                        [ W.Field.hint "Try writing some text here."
                        , W.Field.success "Pretty good text you wrote there!"
                        , W.Field.warning "You know better than this."
                        ]
                        props
                    , W.Field.view
                        [ W.Field.hint "Try writing some text here."
                        , W.Field.success "Pretty good text you wrote there!"
                        , W.Field.warning "You know better than this."
                        , W.Field.danger "You're in trouble now…"
                        ]
                        props
                    ]
              )
            , ( "Right aligned"
              , H.div []
                    [ W.Field.view
                        [ W.Field.alignRight True
                        ]
                        props
                    , W.Field.view
                        [ W.Field.alignRight True
                        , W.Field.footer (H.text "Some description")
                        , W.Field.warning "You know better than this."
                        ]
                        props
                    , W.Field.view
                        [ W.Field.alignRight True
                        , W.Field.footer (H.text "Some description")
                        , W.Field.success "You did it!"
                        ]
                        props
                    ]
              )
            ]
