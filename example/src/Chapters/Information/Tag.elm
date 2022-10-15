module Chapters.Information.Tag exposing (chapter_)

import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import ElmBook.Actions exposing (logAction)
import W.Tag
import Html as H
import UI


chapter_ : Chapter x
chapter_ =
    chapter "Tag"
        |> renderComponentList
            ([ ( [], "Neutral")
            , ( [ W.Tag.primary ], "Primary" )
            , ( [ W.Tag.secondary ], "Secondary" )
            , ( [ W.Tag.success ], "Success" )
            , ( [ W.Tag.warning ], "Warning" )
            , ( [ W.Tag.danger ], "Danger" )
            , ( [ W.Tag.color "purple" ], "Custom" )
            ] |> List.map (\(attrs, label) ->
                ( label, UI.hSpacer [ 
                W.Tag.view attrs [ H.text label ]
                , W.Tag.view (W.Tag.onClick (logAction "onClick") :: attrs) [ H.text label ]
                , W.Tag.view (W.Tag.href "/logAction/#" :: attrs) [ H.text label ]
                , W.Tag.view (W.Tag.small True :: attrs) [ H.text label ]
                 ])
            ))

