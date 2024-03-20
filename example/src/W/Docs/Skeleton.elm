module W.Docs.Skeleton exposing (Model, docs, init)

import ElmBook.Actions exposing (updateState)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import Html.Attributes as HA
import W.Container
import W.Skeleton


type alias Model =
    String


init : Model
init =
    ""


docs : Chapter x
docs =
    chapter "Skeleton"
        |> renderComponentList
            [ ( "Default"
              , W.Skeleton.view []
              )
            , ( "Circle"
              , W.Skeleton.view [ W.Skeleton.circle 48 ]
              )
            , ( "Composition"
              , W.Container.view
                    [ W.Container.gap_4 ]
                    [ W.Skeleton.view [ W.Skeleton.circle 48 ]
                    , W.Skeleton.view [ W.Skeleton.height 120 ]
                    , W.Skeleton.view [ W.Skeleton.relativeWidth 0.8 ]
                    , W.Skeleton.view [ W.Skeleton.relativeWidth 0.3 ]
                    ]
              )
            , ( "Composition (without animation)"
              , W.Container.view
                    [ W.Container.gap_4 ]
                    [ W.Skeleton.view [ W.Skeleton.noAnimation, W.Skeleton.circle 48 ]
                    , W.Skeleton.view [ W.Skeleton.noAnimation, W.Skeleton.height 120 ]
                    , W.Skeleton.view [ W.Skeleton.noAnimation, W.Skeleton.relativeWidth 0.8 ]
                    , W.Skeleton.view [ W.Skeleton.noAnimation, W.Skeleton.relativeWidth 0.3 ]
                    ]
              )
            ]
