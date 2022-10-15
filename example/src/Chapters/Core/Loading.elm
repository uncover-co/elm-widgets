module Chapters.Core.Loading exposing (chapter_)

import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import W.Loading


chapter_ : Chapter x
chapter_ =
    chapter "Loading"
        |> renderComponentList
            [ ( "Circles"
              , W.Loading.circles []
              )
            , ( "Circles with Custom Size and Color"
              , W.Loading.circles
                    [ W.Loading.size 40
                    , W.Loading.color "#48CB82"
                    ]
              )
            , ( "Dots"
              , W.Loading.dots []
              )
            , ( "Dots with Custom Size and Color"
              , W.Loading.dots
                    [ W.Loading.size 40
                    , W.Loading.color "#48CB82"
                    ]
              )
            , ( "Ripples"
              , W.Loading.ripples []
              )
            , ( "Ripples with Custom Size and Color"
              , W.Loading.ripples
                    [ W.Loading.size 40
                    , W.Loading.color "#48CB82"
                    ]
              )
            ]
