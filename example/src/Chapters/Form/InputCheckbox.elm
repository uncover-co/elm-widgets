module Chapters.Form.InputCheckbox exposing (..)

import ElmBook.Actions exposing (logActionWithBool)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import W.Container
import W.InputCheckbox


chapter_ : Chapter x
chapter_ =
    chapter "Input Checkbox"
        |> renderComponentList
            [ ( "Default"
              , W.InputCheckbox.view
                    []
                    { value = True
                    , onInput = logActionWithBool "onInput"
                    }
              )
            , ( "Disabled"
              , W.InputCheckbox.view
                    [ W.InputCheckbox.disabled True ]
                    { value = False
                    , onInput = logActionWithBool "onInput"
                    }
              )
            , ( "Read Only"
              , W.InputCheckbox.view
                    [ W.InputCheckbox.readOnly True ]
                    { value = True
                    , onInput = logActionWithBool "onInput"
                    }
              )
            , ( "Custom Color"
              , W.InputCheckbox.view
                    [ W.InputCheckbox.color "red" ]
                    { value = True
                    , onInput = logActionWithBool "onInput"
                    }
              )
            , ( "Toggle"
              , W.Container.view
                    [ W.Container.card, W.Container.pad_3 ]
                    [ W.InputCheckbox.view
                        [ W.InputCheckbox.toggle ]
                        { value = True
                        , onInput = logActionWithBool "onInput"
                        }
                    ]
              )
            ]
