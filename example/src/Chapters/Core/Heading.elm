module Chapters.Core.Heading exposing (..)

import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import Html.Attributes as HA
import Theme
import W.Heading
import W.Text


chapter_ : Chapter x
chapter_ =
    chapter "Typography"
        |> renderComponentList
            [ ( "Font Sizes"
              , H.div []
                    [ W.Heading.view
                        [ W.Heading.extraLarge ]
                        [ H.text "I'm a really large title" ]
                    , W.Text.view
                        [ W.Text.extraLarge, W.Text.aux ]
                        [ H.text "I'm a really large text" ]
                    , W.Heading.view
                        [ W.Heading.h2
                        , W.Heading.large
                        ]
                        [ H.text "I'm a large title" ]
                    , W.Text.view
                        [ W.Text.large, W.Text.aux ]
                        [ H.text "I'm a large text" ]
                    , W.Heading.view []
                        [ H.text "I'm the base title" ]
                    , W.Text.view [ W.Text.aux ]
                        [ H.text "I'm the base text" ]
                    , W.Heading.view
                        [ W.Heading.small ]
                        [ H.text "I'm a small title" ]
                    , W.Text.view
                        [ W.Text.small, W.Text.aux ]
                        [ H.text "I'm a small text" ]
                    ]
              )
            , ( "Font Sizes"
              , H.div []
                    [ W.Text.view
                        [ W.Text.extraLarge, W.Text.aux ]
                        [ H.text "I'm a large text" ]
                    , W.Text.view
                        [ W.Text.large, W.Text.aux ]
                        [ H.text "I'm a large text" ]
                    , W.Text.view [ W.Text.aux ]
                        [ H.text "I'm the base text" ]
                    , W.Text.view
                        [ W.Text.small, W.Text.aux ]
                        [ H.text "I'm a small text" ]
                    ]
              )
            , ( "Large"
              , W.Heading.view
                    [ W.Heading.large ]
                    [ H.text "I'm a title" ]
              )
            , ( "Small"
              , W.Heading.view
                    [ W.Heading.small ]
                    [ H.text "I'm a title" ]
              )
            ]
