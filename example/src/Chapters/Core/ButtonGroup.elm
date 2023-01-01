module Chapters.Core.ButtonGroup exposing (chapter_)

import ElmBook.Actions exposing (logActionWith)
import ElmBook.Chapter exposing (Chapter, chapter, renderWithComponentList, withComponentList)
import Html as H
import UI
import W.ButtonGroup


chapter_ : Chapter x
chapter_ =
    chapter "Button Groups"
        |> withComponentList
            [ ( "Default"
              , UI.vSpacer
                    [ UI.hSpacer
                        [ W.ButtonGroup.view
                            [ W.ButtonGroup.highlighted ((==) 2)
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view []
                            { items = [ 0, 1 ]
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view []
                            { items = [ 1 ]
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        ]
                    , UI.hSpacer
                        [ W.ButtonGroup.view [ W.ButtonGroup.outlined ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view [ W.ButtonGroup.outlined, W.ButtonGroup.highlighted ((==) 1) ]
                            { items = [ 0, 1 ]
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view [ W.ButtonGroup.outlined ]
                            { items = [ 1 ]
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.outlined
                            , W.ButtonGroup.disabled (\_ -> True)
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        ]
                    , UI.hSpacer
                        [ W.ButtonGroup.view [ W.ButtonGroup.small ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.small
                            , W.ButtonGroup.outlined
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.disabled (\_ -> True)
                            , W.ButtonGroup.small
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        ]
                    ]
              )
            , ( "Rounded"
              , UI.vSpacer
                    [ UI.hSpacer
                        [ W.ButtonGroup.view [ W.ButtonGroup.rounded ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.rounded
                            , W.ButtonGroup.outlined
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.disabled (\_ -> True)
                            , W.ButtonGroup.rounded
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        ]
                    , UI.hSpacer
                        [ W.ButtonGroup.view
                            [ W.ButtonGroup.rounded
                            , W.ButtonGroup.small
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.rounded
                            , W.ButtonGroup.outlined
                            , W.ButtonGroup.small
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.disabled (\_ -> True)
                            , W.ButtonGroup.rounded
                            , W.ButtonGroup.small
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> [ H.text (String.fromInt i) ]
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        ]
                    ]
              )
            , ( "Full"
              , W.ButtonGroup.view
                    [ W.ButtonGroup.full
                    ]
                    { items = List.range 0 2
                    , toLabel = \i -> [ H.text (String.fromInt i) ]
                    , onClick = logActionWith String.fromInt "onClick"
                    }
              )
            ]
        |> renderWithComponentList """
"""
