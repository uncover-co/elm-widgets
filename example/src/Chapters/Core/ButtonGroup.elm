module Chapters.Core.ButtonGroup exposing (chapter_)

import ElmBook.Actions exposing (logActionWith)
import ElmBook.Chapter exposing (Chapter, chapter, renderWithComponentList, withComponentList)
import Html as H
import UI
import W.ButtonGroup


body : String
body =
    """
- [ ] Icons
- [ ] Text left/right
- [ ] Disable uppercase
- [ ] Receive html?
"""


chapter_ : Chapter x
chapter_ =
    chapter "ButtonGroup"
        |> withComponentList
            [ ( "Default"
              , UI.vSpacer
                    [ UI.hSpacer
                        [ W.ButtonGroup.view []
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view []
                            { items = [ 0, 1 ]
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view []
                            { items = [ 1 ]
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        ]
                    , UI.hSpacer
                        [ W.ButtonGroup.view [ W.ButtonGroup.outlined ]
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view [ W.ButtonGroup.outlined ]
                            { items = [ 0, 1 ]
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view [ W.ButtonGroup.outlined ]
                            { items = [ 1 ]
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.disabled True
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        ]
                    , UI.hSpacer
                        [ W.ButtonGroup.view [ W.ButtonGroup.small ]
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.small
                            , W.ButtonGroup.outlined
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.disabled True
                            , W.ButtonGroup.small
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
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
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.rounded
                            , W.ButtonGroup.outlined
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.disabled True
                            , W.ButtonGroup.rounded
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        ]
                    , UI.hSpacer
                        [ W.ButtonGroup.view
                            [ W.ButtonGroup.rounded
                            , W.ButtonGroup.small
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.rounded
                            , W.ButtonGroup.outlined
                            , W.ButtonGroup.small
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        , W.ButtonGroup.view
                            [ W.ButtonGroup.disabled True
                            , W.ButtonGroup.rounded
                            , W.ButtonGroup.small
                            ]
                            { items = List.range 0 2
                            , toLabel = \i -> H.text (String.fromInt i)
                            , isActive = (==) 2
                            , onClick = logActionWith String.fromInt "onClick"
                            }
                        ]
                    ]
              )
            , ( "Fill"
              , W.ButtonGroup.view
                    [ W.ButtonGroup.fill
                    ]
                    { items = List.range 0 2
                    , toLabel = \i -> H.text (String.fromInt i)
                    , isActive = (==) 2
                    , onClick = logActionWith String.fromInt "onClick"
                    }
              )
            ]
        |> renderWithComponentList body
