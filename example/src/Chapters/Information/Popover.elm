module Chapters.Information.Popover exposing (chapter_)

import ElmBook
import ElmBook.Actions
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import UI
import W.Button
import W.Divider
import W.Menu
import W.Popover


children :
    String
    ->
        { content : List (H.Html (ElmBook.Msg x))
        , trigger : List (H.Html (ElmBook.Msg x))
        }
children label =
    { content =
        [ W.Menu.view
            [ W.Menu.viewButton []
                { label = [ H.text "Item" ]
                , onClick = ElmBook.Actions.logAction "onClick"
                }
            , W.Menu.viewButton []
                { label = [ H.text "Item" ]
                , onClick = ElmBook.Actions.logAction "onClick"
                }
            , W.Divider.view [] []
            , W.Popover.viewNext
                [ W.Popover.showOnHover
                , W.Popover.right
                , W.Popover.width 80
                , W.Popover.offset 4
                ]
                { trigger =
                    [ W.Menu.viewDummy []
                        [ H.text "Item" ]
                    ]
                , content =
                    [ W.Menu.viewButton []
                        { label = [ H.text "Item" ]
                        , onClick = ElmBook.Actions.logAction "onClick"
                        }
                    , W.Menu.viewButton []
                        { label = [ H.text "Item" ]
                        , onClick = ElmBook.Actions.logAction "onClick"
                        }
                    ]
                }
            ]
        ]
    , trigger =
        [ W.Button.viewDummy [] [ H.text label ]
        ]
    }


chapter_ : Chapter x
chapter_ =
    chapter "Popover"
        |> renderComponentList
            ([ ( "Bottom (Persistent)", [ W.Popover.persistent ] )
             , ( "Bottom Right", [ W.Popover.bottomRight ] )
             , ( "Top", [ W.Popover.top ] )
             , ( "Top Right", [ W.Popover.topRight ] )
             , ( "Left", [ W.Popover.left ] )
             , ( "Left Bottom", [ W.Popover.leftBottom ] )
             , ( "Right", [ W.Popover.right ] )
             , ( "Right Bottom", [ W.Popover.rightBottom ] )
             ]
                |> List.map
                    (\( label, attrs ) ->
                        ( label
                        , UI.hSpacer
                            [ W.Popover.viewNext attrs (children "Default")
                            , W.Popover.viewNext (W.Popover.over :: attrs) (children "Over")
                            , W.Popover.viewNext (W.Popover.offset 4 :: attrs) (children "Offset")
                            , W.Popover.viewNext (W.Popover.full True :: attrs) (children "Full")
                            , W.Popover.viewNext (W.Popover.showOnHover :: W.Popover.offset 4 :: attrs) (children "Hover")
                            ]
                        )
                    )
            )
