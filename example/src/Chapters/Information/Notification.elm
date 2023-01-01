module Chapters.Information.Notification exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import UI
import W.Notification


chapter_ : Chapter x
chapter_ =
    chapter "Notification"
        |> renderComponentList
            ([ ( [], "Neutral" )
             , ( [ W.Notification.primary ], "Primary" )
             , ( [ W.Notification.secondary ], "Secondary" )
             , ( [ W.Notification.success ], "Success" )
             , ( [ W.Notification.warning ], "Warning" )
             , ( [ W.Notification.danger ], "Danger" )
             , ( [ W.Notification.color "purple" ], "Custom" )
             ]
                |> List.map
                    (\( attrs, label ) ->
                        ( label
                        , UI.vSpacer
                            [ W.Notification.view attrs [ H.text label ]
                            , W.Notification.view (W.Notification.onClick (logAction "onClick") :: attrs) [ H.text label ]
                            , W.Notification.view (W.Notification.onClose (logAction "onClose") :: attrs) [ H.text label ]
                            , W.Notification.view (W.Notification.href "/logAction/#" :: attrs) [ H.text label ]
                            , W.Notification.view
                                (attrs
                                    ++ [ W.Notification.icon [ H.text "i" ]
                                       , W.Notification.footer [ H.text "Footer" ]
                                       ]
                                )
                                [ H.text label ]
                            ]
                        )
                    )
            )
