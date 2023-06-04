module Chapters.Information.Menu exposing (chapter_)

import ElmBook
import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import W.Menu


items : List (H.Html (ElmBook.Msg x))
items =
    [ W.Menu.viewButton []
        { label = [ H.text "Click me" ]
        , onClick = logAction "onClick"
        }
    , W.Menu.viewButton [ W.Menu.noPadding ]
        { label = [ H.text "Click me (no padding)" ]
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


chapter_ : Chapter x
chapter_ =
    chapter "Menu"
        |> renderComponentList
            [ ( "Default"
              , W.Menu.view items
              )
            , ( "Custom padding"
              , W.Menu.viewCustom
                    [ W.Menu.paddingX 24 ]
                    items
              )
            ]
