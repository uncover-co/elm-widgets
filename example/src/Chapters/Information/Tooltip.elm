module Chapters.Information.Tooltip exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import W.Tooltip


chapter_ : Chapter x
chapter_ =
    chapter "Tooltip"
        |> renderComponentList
            [ ( "Default"
              , W.Tooltip.view []
                    { tooltip = [ H.text "This is a tooltip!" ]
                    , children = [ H.text "Hello!" ]
                    }
              )
            , ( "Always Visible"
              , W.Tooltip.view [ W.Tooltip.alwaysVisible ]
                    { tooltip = [ H.text "Helloo!" ]
                    , children = [ H.text "Hello!" ]
                    }
              )
            , ( "Fast"
              , W.Tooltip.view [ W.Tooltip.fast ]
                    { tooltip = [ H.text "This is a blazingly fast tooltip!" ]
                    , children = [ H.text "Hello!" ]
                    }
              )
            , ( "Slow"
              , W.Tooltip.view [ W.Tooltip.slow ]
                    { tooltip = [ H.text "This is a sloow tooltip!" ]
                    , children = [ H.text "Hello!" ]
                    }
              )
            ]
