module Chapters.Information.Tooltip exposing (chapter_)

import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import ElmBook.Actions exposing (logAction)
import W.Tooltip
import Html as H


chapter_ : Chapter x
chapter_ =
    chapter "Tooltip"
        |> renderComponentList 
            [ ( "Default"
              , W.Tooltip.view [] 
                    { tooltip = [ H.text "Tooltip!" ]
                    , children = [ H.text "Hello!" ]
                    }
              )
            ]
