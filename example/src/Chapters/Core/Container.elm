module Chapters.Core.Container exposing (..)

import ElmBook.Chapter exposing (Chapter, chapter, withComponentList, renderWithComponentList)
import Html as H
import W.Container
import Theme


square : H.Html msg
square =
    W.Container.view
        [ W.Container.pad_4
        , W.Container.background Theme.baseAux
        , W.Container.extraRounded
        ]
        []


chapter_ : Chapter x
chapter_ =
    chapter "Containers"
        |> withComponentList
            [ ( "Horizontal + Space between elements"
              , W.Container.view
                    [ W.Container.pad_8
                    , W.Container.gap_2
                    , W.Container.horizontal
                    , W.Container.spaceBetween
                    , W.Container.background (Theme.baseAuxWithAlpha 0.1)
                    ]
                    [ square
                    , square
                    , square
                    ]
              )
            , ( "Horizontal + Space around elements"
              , W.Container.view
                    [ W.Container.pad_8
                    , W.Container.gap_2
                    , W.Container.horizontal
                    , W.Container.spaceAround
                    , W.Container.background (Theme.baseAuxWithAlpha 0.1)
                    ]
                    [ square
                    , square
                    , square
                    ]
              )
            , ( "Elements centered on both axis with some gap between them"
              , W.Container.view
                    [ W.Container.pad_8
                    , W.Container.gap_2
                    , W.Container.background (Theme.baseAuxWithAlpha 0.1)
                    , W.Container.alignCenterX
                    , W.Container.alignCenterY
                    ]
                    [ square
                    , square
                    , square
                    ]
              )
            , ( "Elements centered on the Y axis and aligned right with some gap between them"
              , W.Container.view
                    [ W.Container.pad_8
                    , W.Container.gap_2
                    , W.Container.background (Theme.baseAuxWithAlpha 0.1)
                    , W.Container.alignRight
                    , W.Container.alignCenterY
                    ]
                    [ square
                    , square
                    , square
                    ]
              )
            , ( "Horizontal only on large screens"
              , W.Container.view
                    [ W.Container.pad_8
                    , W.Container.gap_2
                    , W.Container.background (Theme.baseAuxWithAlpha 0.1)
                    , W.Container.alignCenterX
                    , W.Container.alignCenterY
                    , W.Container.largeScreen [ W.Container.horizontal ]
                    ]
                    [ square
                    , square
                    , square
                    ]
              )
            , ( "Using the card attribute to set background, borders and shadows at the same time"
              , W.Container.view
                    [ W.Container.pad_8
                    , W.Container.background (Theme.baseAuxWithAlpha 0.1)
                    , W.Container.alignCenterX
                    , W.Container.alignCenterY
                    ]
                    [ W.Container.view [ W.Container.pad_8, W.Container.card ] []
                    ]
              )
            ]
        |> renderWithComponentList """
Containers are flexible elements that can be used for responsive padding, spacing and layouting of child elements. They also accept a few styles like shadows, rounded borders and colored backgrounds.

---

If you're using something like [Elm-UI](https://package.elm-lang.org/packages/mdgriffith/elm-ui/latest/) or [TailwindCSS](https://tailwindcss.com/) then you can probably skip this widget and use your preferred method directly!

However, we wanted to give the opportunity for elm-widget users to reach farther in their app development without the need of using any other external packages.
"""
