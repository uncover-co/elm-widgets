module Chapters.Form.InputColor exposing (..)

import Color
import ElmBook.Actions exposing (logActionWith)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import W.InputColor
import W.Internal.Color


chapter_ : Chapter m
chapter_ =
    chapter "Input Color"
        |> renderComponentList
            [ ( "Default"
              , W.InputColor.view
                    []
                    { value = Color.blue
                    , onInput = logActionWith W.Internal.Color.toHex "onInput"
                    }
              )
            , ( "Disabled"
              , W.InputColor.view
                    [ W.InputColor.disabled True ]
                    { value = Color.yellow
                    , onInput = logActionWith W.Internal.Color.toHex "onInput"
                    }
              )
            , ( "Read Only"
              , W.InputColor.view
                    [ W.InputColor.readOnly True ]
                    { value = Color.red
                    , onInput = logActionWith W.Internal.Color.toHex "onInput"
                    }
              )
            ]
