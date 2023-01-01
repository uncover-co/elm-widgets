module Chapters.Information.Message exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import UI
import W.Message


chapter_ : Chapter x
chapter_ =
    chapter "Message"
        |> renderComponentList
            ([ ( [], "Neutral" )
             , ( [ W.Message.primary ], "Primary" )
             , ( [ W.Message.secondary ], "Secondary" )
             , ( [ W.Message.success ], "Success" )
             , ( [ W.Message.warning ], "Warning" )
             , ( [ W.Message.danger ], "Danger" )
             , ( [ W.Message.color "purple" ], "Custom" )
             ]
                |> List.map
                    (\( attrs, label ) ->
                        ( label
                        , UI.vSpacer
                            [ W.Message.view attrs [ H.text label ]
                            , W.Message.view (W.Message.onClick (logAction "onClick") :: attrs) [ H.text label ]
                            , W.Message.view (W.Message.href "/logAction/#" :: attrs) [ H.text label ]
                            , W.Message.view
                                (attrs
                                    ++ [ W.Message.icon [ H.text "i" ]
                                       , W.Message.footer [ H.text "Footer" ]
                                       ]
                                )
                                [ H.text label ]
                            ]
                        )
                    )
            )
