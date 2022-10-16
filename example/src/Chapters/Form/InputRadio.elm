module Chapters.Form.InputRadio exposing (chapter_)

import ElmBook.Actions exposing (logActionWith)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import W.InputRadio


chapter_ : Chapter x
chapter_ =
    chapter "Input Radio"
        |> renderComponentList
            [ ( "Default"
              , W.InputRadio.view
                    []
                    { id = "default"
                    , value = 1
                    , toLabel = String.fromInt
                    , toValue = String.fromInt
                    , options = [ 1, 2, 3 ]
                    , onInput = logActionWith String.fromInt "onInput"
                    }
              )
            , ( "Disabled"
              , W.InputRadio.view
                    [ W.InputRadio.disabled True ]
                    { id = "disabled"
                    , value = 2
                    , toLabel = String.fromInt
                    , toValue = String.fromInt
                    , options = [ 1, 2, 3 ]
                    , onInput = logActionWith String.fromInt "onInput"
                    }
              )
            , ( "Read Only"
              , W.InputRadio.view
                    [ W.InputRadio.readOnly True ]
                    { id = "read-only"
                    , value = 2
                    , toLabel = String.fromInt
                    , toValue = String.fromInt
                    , options = [ 1, 2, 3 ]
                    , onInput = logActionWith String.fromInt "onInput"
                    }
              )
            , ( "Starting with hidden value"
              , W.InputRadio.view []
                    { id = "r"
                    , value = -1
                    , toLabel = String.fromInt
                    , toValue = String.fromInt
                    , options = [ 1, 2, 3 ]
                    , onInput = logActionWith String.fromInt "onInput"
                    }
              )
            , ( "Custom Colors"
              , W.InputRadio.view
                    [ W.InputRadio.color "red" ]
                    { id = "custom-colors"
                    , value = 3
                    , toLabel = String.fromInt
                    , toValue = String.fromInt
                    , options = [ 1, 2, 3 ]
                    , onInput = logActionWith String.fromInt "onInput"
                    }
              )
            , ( "Vertical"
              , W.InputRadio.view
                    [ W.InputRadio.vertical True ]
                    { id = "vertical"
                    , value = 2
                    , toLabel = String.fromInt
                    , toValue = String.fromInt
                    , options = [ 1, 2, 3 ]
                    , onInput = logActionWith String.fromInt "onInput"
                    }
              )
            ]
