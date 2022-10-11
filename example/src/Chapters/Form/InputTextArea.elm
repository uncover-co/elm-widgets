module Chapters.Form.InputTextArea exposing (Model, chapter_, init, update)

import ElmBook exposing (Msg)
import ElmBook.Actions exposing (logActionWithString, updateStateWith)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList, renderStatefulComponentList)
import W.InputTextArea


type alias Model =
    String


init : String
init =
    "Testing a long\n long\n long\n text?"


update : String -> Msg { b | inputTextArea : Model }
update =
    updateStateWith
        (\v model ->
            { model | inputTextArea = v }
        )


chapter_ : Chapter { x | inputTextArea : Model }
chapter_ =
    chapter "Input TextArea"
        |> renderStatefulComponentList
            [ ( "Default"
              , \{ inputTextArea } ->
                    W.InputTextArea.view
                        [ W.InputTextArea.placeholder "Type something…"
                        , W.InputTextArea.rows 4
                        ]
                        { value = inputTextArea
                        , onInput = update
                        }
              )
            , ( "Resizable"
              , \{ inputTextArea } ->
                    W.InputTextArea.view
                        [ W.InputTextArea.placeholder "Type something…"
                        , W.InputTextArea.rows 4
                        , W.InputTextArea.resizable True
                        ]
                        { value = inputTextArea
                        , onInput = update
                        }
              )
            , ( "Autogrow"
              , \{ inputTextArea } ->
                    W.InputTextArea.view
                        [ W.InputTextArea.placeholder "Type something…"
                        , W.InputTextArea.rows 1
                        , W.InputTextArea.autogrow True
                        ]
                        { value = inputTextArea
                        , onInput = update
                        }
              )
            ]
