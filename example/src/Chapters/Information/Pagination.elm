module Chapters.Information.Pagination exposing (chapter_)

import ElmBook.Actions exposing (logActionWith)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import W.Pagination


chapter_ : Chapter x
chapter_ =
    chapter "Pagination"
        |> renderComponentList
            [ ( "Small amount of pages"
              , W.Pagination.view []
                    { total = 3
                    , active = 1
                    , onClick = logActionWith String.fromInt "onClick"
                    }
              )
            , ( "medium amount of pages"
              , W.Pagination.view []
                    { total = 8
                    , active = 5
                    , onClick = logActionWith String.fromInt "onClick"
                    }
              )
            , ( "big number of pages"
              , W.Pagination.view [ W.Pagination.separator [ H.text "..." ] ]
                    { total = 9999
                    , active = 10
                    , onClick = logActionWith String.fromInt "onClick"
                    }
              )
            ]
