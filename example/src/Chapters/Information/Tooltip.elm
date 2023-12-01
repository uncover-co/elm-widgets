module Chapters.Information.Tooltip exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import UI
import W.Tooltip


chapter_ : Chapter x
chapter_ =
    chapter "Tooltip"
        |> renderComponentList
            [ ( "Different Positions"
              , UI.hSpacer
                    [ W.Tooltip.view []
                        { tooltip = [ H.text "This is a top tooltip!" ]
                        , children = [ H.text "Top!" ]
                        }
                    , W.Tooltip.view [ W.Tooltip.bottom ]
                        { tooltip = [ H.text "A bottom one!" ]
                        , children = [ H.text "Bottom?" ]
                        }
                    , W.Tooltip.view [ W.Tooltip.right ]
                        { tooltip = [ H.text "A right one!" ]
                        , children = [ H.text "Right!" ]
                        }
                    , W.Tooltip.view [ W.Tooltip.left ]
                        { tooltip = [ H.text "A left one!" ]
                        , children = [ H.text "Left??" ]
                        }
                    ]
              )
            , ( "Bottom"
              , W.Tooltip.view [ W.Tooltip.bottom ]
                    { tooltip = [ H.text "This is a tooltip!" ]
                    , children = [ H.text "Hello!" ]
                    }
              )
            , ( "Left"
              , W.Tooltip.view [ W.Tooltip.left ]
                    { tooltip = [ H.text "This is a tooltip!" ]
                    , children = [ H.text "Hello!" ]
                    }
              )
            , ( "Right"
              , W.Tooltip.view [ W.Tooltip.right ]
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
