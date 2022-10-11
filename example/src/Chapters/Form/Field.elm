module Chapters.Form.Field exposing (chapter_)

import ElmBook
import ElmBook.Actions exposing (logActionWithString)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import W.Field
import W.InputText


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
                W.InputText.view
                    [ W.InputText.placeholder "..."
                    ]
                    { value = ""
                    , onInput = logActionWithString "onInput"
                    }
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
