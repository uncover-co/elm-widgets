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
               , ( "Success", [ W.Button.success ] )
               , ( "Warning", [ W.Button.warning ] )
               , ( "Danger", [ W.Button.danger ] )
               , ( "Custom"
                 , [ W.Button.theme
                        { bg = "#ef67ef"
                        , bgChannels = "239 103 239"
                        , fg = "#f6e1f6"
                        , fgChannels = "246 225 246"
                        , aux = "#ffedff"
                        , auxChannels = "255 237 255"
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
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.outlined :: attrs)
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.invisible :: attrs)
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                ]
                            , UI.hSpacer
                                [ W.Button.view
                                    (W.Button.disabled True :: attrs)
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.outlined :: W.Button.disabled True :: attrs)
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.invisible :: W.Button.disabled True :: attrs)
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                ]
                            , UI.hSpacer
                                [ W.Button.view (W.Button.rounded :: attrs)
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.outlined :: W.Button.rounded :: attrs)
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.invisible :: W.Button.rounded :: attrs)
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                ]
                            , UI.hSpacer
                                [ W.Button.view (W.Button.small :: attrs)
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.outlined :: W.Button.small :: attrs)
                                    { label = "button"
                                    , onClick = logAction ""
                                    }
                                , W.Button.view
                                    (W.Button.invisible :: W.Button.small :: attrs)
                                    { label = "button"
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
