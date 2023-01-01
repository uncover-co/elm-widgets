module Chapters.Information.Menu exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import W.Menu


chapter_ : Chapter x
chapter_ =
    chapter "Menu"
        |> renderComponentList
            [ ( "Default"
              , W.Menu.view
                    [ W.Menu.viewButton []
                        { label = [ H.text "Click me" ]
                        , onClick = logAction "onClick"
                        }
                    , W.Menu.viewLink
                        [ W.Menu.left [ H.text "L" ]
                        ]
                        { label = [ H.text "Link to" ]
                        , href = "/logAction/#"
                        }
                    , W.Menu.viewTitle
                        [ W.Menu.left [ H.text "T" ]
                        , W.Menu.right [ H.text "Edit" ]
                        ]
                        { label = [ H.text "Title" ]
                        }
                    , W.Menu.viewButton
                        [ W.Menu.selected True
                        ]
                        { label = [ H.text "Click me" ]
                        , onClick = logAction "onClick"
                        }
                    , W.Menu.viewLink []
                        { label = [ H.text "Link to" ]
                        , href = "/logAction/#"
                        }
                    ]
              )
            ]
