module Chapters.Information.Badge exposing (chapter_)

import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import ElmBook.Actions exposing (logAction)
import W.Badge
import Html as H
import UI


chapter_ : Chapter x
chapter_ =
    chapter "Badge"
        |> renderComponentList 
            [ ( "Default"
              , UI.vSpacer
                [ W.Badge.view [] 
                    { value = Just [ H.text "!" ]
                    , children = [ H.text "Hello!" ]
                    }
                , W.Badge.view [ W.Badge.background "purple" ] 
                    { value = Just [ H.text "999" ]
                    , children = [ H.text "Hello!" ]
                    }
                ]
              )
            , ( "Inline", UI.hSpacer 
                [ W.Badge.viewInline [] 
                    [ H.text "!" ]
                , W.Badge.viewInline [ W.Badge.neutral ] 
                    [ H.text "999" ]
                , W.Badge.viewInline [ W.Badge.primary ] 
                    [ H.text "999" ]
                , W.Badge.viewInline [ W.Badge.secondary ] 
                    [ H.text "999" ]
                , W.Badge.viewInline [ W.Badge.success ] 
                    [ H.text "999" ]
                , W.Badge.viewInline [ W.Badge.warning ] 
                    [ H.text "999" ]
                , W.Badge.viewInline
                    [ W.Badge.background "purple" ] 
                    [ H.text "999" ]
                ]
              )
            ]
