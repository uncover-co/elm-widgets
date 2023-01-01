module Chapters.Core.Divider exposing (..)

import ElmBook.Chapter exposing (Chapter, chapter, withComponentList, renderWithComponentList)
import Html as H
import Html.Attributes as HA
import W.Divider


chapter_ : Chapter x
chapter_ =
    chapter "Divider"
        |> withComponentList
            [ ( "Horizontal"
              , H.div []
                    [ W.Divider.view [ W.Divider.margins 16 ] []
                    , W.Divider.view [ W.Divider.margins 16 ] [ H.text "or" ]
                    ]
              )
            , ( "Vertical"
              , H.div
                    [ HA.style "height" "40px"
                    , HA.style "display" "flex"
                    , HA.style "justify-content" "space-around"
                    ]
                    [ W.Divider.view [ W.Divider.vertical ] []
                    , W.Divider.view [ W.Divider.vertical ] []
                    , W.Divider.view [ W.Divider.vertical ] [ H.text "or" ]
                    , W.Divider.view [ W.Divider.vertical ] []
                    ]
              )
            ]
        |> renderWithComponentList """
Dividers can be used in a variety of ways to split sections of your content horizontally or vertically. You can also pass in a child element to be displayed as a label of your divider.
"""
