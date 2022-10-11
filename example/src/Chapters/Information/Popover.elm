module Chapters.Information.Popover exposing (chapter_)

import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import UI
import W.Button
import W.Popover


children :
    String
    ->
        { content : List (H.Html msg)
        , children : List (H.Html msg)
        }
children label =
    { content =
        [ H.text "Content with considerable size" ]
    , children =
        [ W.Button.viewLink []
            { href = "/logAction/"
            , label = label
            }
        ]
    }


chapter_ : Chapter x
chapter_ =
    chapter "Popover"
        |> renderComponentList
            ([ ( "Bottom", [] )
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
                            [ W.Popover.view attrs (children "Default")
                            , W.Popover.view (W.Popover.over :: attrs) (children "Over")
                            , W.Popover.view (W.Popover.offset 4 :: attrs) (children "Offset")
                            , W.Popover.view (W.Popover.full True :: attrs) (children "Full")
                            ]
                        )
                    )
            )
