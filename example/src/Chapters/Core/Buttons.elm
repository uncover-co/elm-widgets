module Chapters.Core.Buttons exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderWithComponentList, withComponentList)
import Html as H
import Html.Attributes as HA
import Html.Events as HE
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
                    ([ W.Button.large
                     , W.Button.noAttr
                     , W.Button.small
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
            , ( "With icons + left alignment"
              , UI.hSpacer
                    ([ [ W.Button.full, W.Button.large, W.Button.alignLeft ]
                     , [ W.Button.full, W.Button.alignLeft ]
                     , [ W.Button.full, W.Button.small, W.Button.alignLeft ]
                     ]
                        |> List.map
                            (\attrs ->
                                W.Button.view attrs
                                    { label =
                                        [ H.span [ HA.class "ew-opacity-50" ] [ UI.viewIcon ]
                                        , H.text "Button"
                                        ]
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
            , ( "Submit button inside a form"
              , H.form
                    [ HA.style "margin" "0"
                    , HE.onSubmit (logAction "Form submitted!")
                    ]
                    [ W.Button.viewSubmit [] [ H.text "Submit" ]
                    ]
              )
            ]
        |> renderWithComponentList """
Buttons, buttons... What can we say? You can press them and hope something happens! It usually does! 😁

---

It's important to have different types and colors of buttons at our disposal so we can communicate the different semantic needs of our applications.
"""
