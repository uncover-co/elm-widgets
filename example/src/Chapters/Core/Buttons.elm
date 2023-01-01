module Chapters.Core.Buttons exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderWithComponentList, withComponentList)
import Html as H
import UI
import W.Button


chapter_ : Chapter x
chapter_ =
    chapter "Buttons"
        |> withComponentList
            [ ( "Different Colors"
              , UI.hSpacer
                    ([ W.Button.noAttr
                     , W.Button.primary
                     , W.Button.secondary
                     , W.Button.success
                     , W.Button.warning
                     , W.Button.danger
                     ]
                        |> List.map
                            (\attr ->
                                W.Button.view [ attr ]
                                    { label = [ H.text "Button" ]
                                    , onClick = logAction "onClick"
                                    }
                            )
                    )
              )
            , ( "Different Sizes"
              , UI.hSpacer
                    ([ W.Button.small
                     , W.Button.noAttr
                     , W.Button.large
                     ]
                        |> List.map
                            (\attr ->
                                W.Button.view [ attr ]
                                    { label = [ H.text "Button" ]
                                    , onClick = logAction "onClick"
                                    }
                            )
                    )
              )
            , ( "Different Styles"
              , UI.hSpacer
                    ([ W.Button.noAttr
                     , W.Button.outlined
                     , W.Button.invisible
                     , W.Button.disabled True
                     ]
                        |> List.map
                            (\attr ->
                                W.Button.view [ attr ]
                                    { label = [ H.text "Button" ]
                                    , onClick = logAction "onClick"
                                    }
                            )
                    )
              )
            , ( "Different Aspect Ratios & Radius Sizes"
              , UI.hSpacer
                    ([ [ W.Button.icon ]
                     , []
                     , [ W.Button.icon, W.Button.rounded ]
                     , [ W.Button.rounded ]
                     ]
                        |> List.map
                            (\attrs ->
                                W.Button.view attrs
                                    { label = [ UI.viewIcon ]
                                    , onClick = logAction "onClick"
                                    }
                            )
                    )
              )
            , ( "100% Width"
              , UI.hSpacer
                    ([ W.Button.full
                     ]
                        |> List.map
                            (\attr ->
                                W.Button.view [ attr ]
                                    { label = [ H.text "Button" ]
                                    , onClick = logAction "onClick"
                                    }
                            )
                    )
              )
            ]
        --    , ( "Different Sizes", [ W.Button.primary ] )
        --    , ( "100% width", [ W.Button.primary ] )
        --    , ( "Icon Buttons", [ W.Button.secondary ] )
        --    , ( "Disabled Buttons", [ W.Button.success ] )
        --    ]
        --  , [ ( "Different Colors", [] )
        --    , ( "Different Sizes", [ W.Button.primary ] )
        --    , ( "100% width", [ W.Button.primary ] )
        --    , ( "Icon Buttons", [ W.Button.secondary ] )
        --    , ( "Disabled Buttons", [ W.Button.success ] )
        --    , ( "Warning", [ W.Button.warning ] )
        --    , ( "Danger", [ W.Button.danger ] )
        --    , ( "Custom"
        --      , [ W.Button.theme
        --             { background = "#ef67ef"
        --             , foreground = "#ef67ef"
        --             , aux = "#ffffff"
        --             }
        --        ]
        --      )
        --    ]
        --     |> List.map
        --         (\( name, attrs ) ->
        --             ( name
        --             , UI.vSpacer
        --                 [ UI.hSpacer
        --                     [ W.Button.view attrs
        --                         { label = [ H.text "Button" ]
        --                         , onClick = logAction ""
        --                         }
        --                     , W.Button.view
        --                         (W.Button.outlined :: attrs)
        --                         { label = [ H.text "Outlined" ]
        --                         , onClick = logAction ""
        --                         }
        --                     , W.Button.view
        --                         (W.Button.invisible :: attrs)
        --                         { label = [ H.text "Invisible" ]
        --                         , onClick = logAction ""
        --                         }
        --                     ]
        --                 , UI.hSpacer
        --                     [ W.Button.view
        --                         (W.Button.disabled True :: attrs)
        --                         { label = [ H.text "Button" ]
        --                         , onClick = logAction ""
        --                         }
        --                     , W.Button.view
        --                         (W.Button.outlined :: W.Button.disabled True :: attrs)
        --                         { label = [ H.text "Outlined" ]
        --                         , onClick = logAction ""
        --                         }
        --                     , W.Button.view
        --                         (W.Button.invisible :: W.Button.disabled True :: attrs)
        --                         { label = [ H.text "Invisible" ]
        --                         , onClick = logAction ""
        --                         }
        --                     ]
        --                 , UI.hSpacer
        --                     [ W.Button.view (W.Button.rounded :: attrs)
        --                         { label = [ H.text "Button" ]
        --                         , onClick = logAction ""
        --                         }
        --                     , W.Button.view
        --                         (W.Button.outlined :: W.Button.rounded :: attrs)
        --                         { label = [ H.text "Outlined" ]
        --                         , onClick = logAction ""
        --                         }
        --                     , W.Button.view
        --                         (W.Button.invisible :: W.Button.rounded :: attrs)
        --                         { label = [ H.text "Invisible" ]
        --                         , onClick = logAction ""
        --                         }
        --                     ]
        --                 , UI.hSpacer
        --                     [ W.Button.view (W.Button.large :: attrs)
        --                         { label = [ H.text "Button" ]
        --                         , onClick = logAction ""
        --                         }
        --                     , W.Button.view
        --                         (W.Button.outlined :: W.Button.large :: attrs)
        --                         { label = [ H.text "Outlined" ]
        --                         , onClick = logAction ""
        --                         }
        --                     , W.Button.view
        --                         (W.Button.invisible :: W.Button.large :: attrs)
        --                         { label = [ H.text "Invisible" ]
        --                         , onClick = logAction ""
        --                         }
        --                     ]
        --                 , UI.hSpacer
        --                     [ W.Button.view (W.Button.small :: attrs)
        --                         { label = [ H.text "Button" ]
        --                         , onClick = logAction ""
        --                         }
        --                     , W.Button.view
        --                         (W.Button.outlined :: W.Button.small :: attrs)
        --                         { label = [ H.text "Outlined" ]
        --                         , onClick = logAction ""
        --                         }
        --                     , W.Button.view
        --                         (W.Button.invisible :: W.Button.small :: attrs)
        --                         { label = [ H.text "Invisible" ]
        --                         , onClick = logAction ""
        --                         }
        --                     ]
        --                 ]
        --             )
        --         )
        --  , [ ( "As Link"
        --      , UI.vSpacer
        --         [ UI.hSpacer
        --             [ W.Button.viewLink
        --                 []
        --                 { label = [ H.text "link" ]
        --                 , href = "/logAction/#"
        --                 }
        --             , W.Button.viewLink
        --                 [ W.Button.outlined
        --                 ]
        --                 { label = [ H.text "link" ]
        --                 , href = "/logAction/#"
        --                 }
        --             , W.Button.viewLink
        --                 [ W.Button.invisible
        --                 ]
        --                 { label = [ H.text "link" ]
        --                 , href = "/logAction/#"
        --                 }
        --             ]
        --         , UI.hSpacer
        --             [ W.Button.viewLink
        --                 [ W.Button.disabled True
        --                 ]
        --                 { label = [ H.text "link" ]
        --                 , href = "/logAction/#"
        --                 }
        --             , W.Button.viewLink
        --                 [ W.Button.outlined
        --                 , W.Button.disabled True
        --                 ]
        --                 { label = [ H.text "link" ]
        --                 , href = "/logAction/#"
        --                 }
        --             , W.Button.viewLink
        --                 [ W.Button.invisible
        --                 , W.Button.disabled True
        --                 ]
        --                 { label = [ H.text "link" ]
        --                 , href = "/logAction/#"
        --                 }
        --             ]
        --         ]
        --      )
        --    , ( "Full width"
        --      , W.Button.view
        --         [ W.Button.full ]
        --         { label = [ H.text "button" ]
        --         , onClick = logAction ""
        --         }
        --      )
        --    , ( "Icons"
        --      , UI.vSpacer
        --         [ UI.hSpacer
        --             [ W.Button.view [ W.Button.small, W.Button.icon ]
        --                 { label = [ UI.viewIcon ]
        --                 , onClick = logAction ""
        --                 }
        --             , W.Button.view [ W.Button.small, W.Button.rounded, W.Button.icon ]
        --                 { label = [ UI.viewIcon ]
        --                 , onClick = logAction ""
        --                 }
        --             , W.Button.view [ W.Button.small, W.Button.invisible, W.Button.icon ]
        --                 { label = [ UI.viewIcon ]
        --                 , onClick = logAction ""
        --                 }
        --             ]
        --         , UI.hSpacer
        --             [ W.Button.view [ W.Button.icon ]
        --                 { label = [ UI.viewIcon ]
        --                 , onClick = logAction ""
        --                 }
        --             , W.Button.view [ W.Button.rounded, W.Button.icon ]
        --                 { label = [ UI.viewIcon ]
        --                 , onClick = logAction ""
        --                 }
        --             , W.Button.view [ W.Button.invisible, W.Button.icon ]
        --                 { label = [ UI.viewIcon ]
        --                 , onClick = logAction ""
        --                 }
        --             ]
        --         , UI.hSpacer
        --             [ W.Button.view [ W.Button.large, W.Button.icon ]
        --                 { label = [ UI.viewIcon ]
        --                 , onClick = logAction ""
        --                 }
        --             , W.Button.view [ W.Button.large, W.Button.rounded, W.Button.icon ]
        --                 { label = [ UI.viewIcon ]
        --                 , onClick = logAction ""
        --                 }
        --             , W.Button.view [ W.Button.large, W.Button.invisible, W.Button.icon ]
        --                 { label = [ UI.viewIcon ]
        --                 , onClick = logAction ""
        --                 }
        --             ]
        --         ]
        --      )
        --    ]
        --  ]
        --     |> List.concat
        -- )
        |> renderWithComponentList """
Buttons, buttons... What can we say? You can press them and hope something happens! It usually does! 😁

---

It's important to have different types and colors of buttons at our disposal so we can communicate the different semantic needs of our applications.
"""
