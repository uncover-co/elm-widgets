module Chapters.Core.Buttons exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import UI
import W.Button


chapter_ : Chapter x
chapter_ =
    chapter "Buttons"
        |> renderComponentList
            ([ [ ( "Default", [] )
               , ( "Primary", [ W.Button.primary ] )
               , ( "Secondary", [ W.Button.secondary ] )
               , ( "Success", [ W.Button.success ] )
               , ( "Warning", [ W.Button.warning ] )
               , ( "Danger", [ W.Button.danger ] )
               , ( "Custom"
                 , [ W.Button.theme
                        { background = "#ef67ef"
                        , foreground = "#f6e1f6"
                        , aux = "#ffedff"
                        }
                   ]
                 )
               ]
                |> List.map
                    (\( name, attrs ) ->
                        ( name
                        , UI.vSpacer
                            [ UI.hSpacer
                                [ W.Button.view attrs
                                    { label = "Button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.outlined :: attrs)
                                    { label = "Outlined"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.invisible :: attrs)
                                    { label = "Invisible"
                                    , onClick = logAction ""
                                    }
                                ]
                            , UI.hSpacer
                                [ W.Button.view
                                    (W.Button.disabled True :: attrs)
                                    { label = "Button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.outlined :: W.Button.disabled True :: attrs)
                                    { label = "Outlined"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.invisible :: W.Button.disabled True :: attrs)
                                    { label = "Invisible"
                                    , onClick = logAction ""
                                    }
                                ]
                            , UI.hSpacer
                                [ W.Button.view (W.Button.rounded :: attrs)
                                    { label = "Button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.outlined :: W.Button.rounded :: attrs)
                                    { label = "Outlined"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.invisible :: W.Button.rounded :: attrs)
                                    { label = "Invisible"
                                    , onClick = logAction ""
                                    }
                                ]
                            , UI.hSpacer
                                [ W.Button.view (W.Button.small :: attrs)
                                    { label = "Button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.outlined :: W.Button.small :: attrs)
                                    { label = "Outlined"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.invisible :: W.Button.small :: attrs)
                                    { label = "Invisible"
                                    , onClick = logAction ""
                                    }
                                ]
                            ]
                        )
                    )
             , [ ( "As Link"
                 , UI.vSpacer
                    [ UI.hSpacer
                        [ W.Button.viewLink
                            []
                            { label = "link"
                            , href = "/logAction/#"
                            }
                        , W.Button.viewLink
                            [ W.Button.outlined
                            ]
                            { label = "link"
                            , href = "/logAction/#"
                            }
                        , W.Button.viewLink
                            [ W.Button.invisible
                            ]
                            { label = "link"
                            , href = "/logAction/#"
                            }
                        ]
                    , UI.hSpacer
                        [ W.Button.viewLink
                            [ W.Button.disabled True
                            ]
                            { label = "link"
                            , href = "/logAction/#"
                            }
                        , W.Button.viewLink
                            [ W.Button.outlined
                            , W.Button.disabled True
                            ]
                            { label = "link"
                            , href = "/logAction/#"
                            }
                        , W.Button.viewLink
                            [ W.Button.invisible
                            , W.Button.disabled True
                            ]
                            { label = "link"
                            , href = "/logAction/#"
                            }
                        ]
                    ]
                 )
               , ( "Full width"
                 , W.Button.view
                    [ W.Button.fill ]
                    { label = "button"
                    , onClick = logAction ""
                    }
                 )
               ]
             ]
                |> List.concat
            )
