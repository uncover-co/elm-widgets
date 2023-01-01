module Chapters.Information.Tag exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import UI
import W.Tag


chapter_ : Chapter x
chapter_ =
    chapter "Tag"
        |> renderComponentList
            ([ ( [], "Neutral" )
             , ( [ W.Tag.primary ], "Primary" )
             , ( [ W.Tag.secondary ], "Secondary" )
             , ( [ W.Tag.success ], "Success" )
             , ( [ W.Tag.warning ], "Warning" )
             , ( [ W.Tag.danger ], "Danger" )
             , ( [ W.Tag.color "purple" ], "Custom" )
             ]
                |> List.map
                    (\( attrs, label ) ->
                        ( label
                        , UI.hSpacer
                            [ W.Tag.view attrs [ H.text label ]
                            , W.Tag.viewButton attrs { onClick = logAction "onClick", label = [ H.text label ] }
                            , W.Tag.viewLink attrs { href = "/logAction/#", label = [ H.text label ] }
                            , W.Tag.view (W.Tag.small True :: attrs) [ H.text label ]
                            ]
                        )
                    )
            )
