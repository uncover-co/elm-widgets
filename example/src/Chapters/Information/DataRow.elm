module Chapters.Information.DataRow exposing (chapter_)

import ElmBook.Actions exposing (logAction)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import Html.Attributes as HA
import W.Button
import W.DataRow
import W.Loading


chapter_ : Chapter x
chapter_ =
    chapter "DataRow"
        |> renderComponentList
            [ ( "Simple"
              , W.DataRow.view []
                    [ H.text "Label"
                    ]
              )
            , ( "As Button"
              , W.DataRow.view
                    [ W.DataRow.onClick (logAction "onClick") ]
                    [ H.text "Label"
                    ]
              )
            , ( "As Link"
              , W.DataRow.view
                    [ W.DataRow.href "/logAction/#" ]
                    [ H.text "Label"
                    ]
              )
            , ( "With Actions"
              , W.DataRow.view
                    [ W.DataRow.href "/logAction/#"
                    , W.DataRow.right
                        [ W.Button.view [ W.Button.primary ]
                            { label = [ H.text "Click me" ]
                            , onClick = logAction "onClick Action"
                            }
                        ]
                    ]
                    [ H.text "Label"
                    ]
              )
            , ( "With Actions + Footer"
              , W.DataRow.view
                    [ W.DataRow.href "/logAction/#"
                    , W.DataRow.footer [ H.text "user@email.com" ]
                    , W.DataRow.right
                        [ W.Button.view [ W.Button.primary ]
                            { label = [ H.text "Click me" ]
                            , onClick = logAction "onClick Action"
                            }
                        ]
                    ]
                    [ H.text "Label" ]
              )
            , ( "With Actions + Header + Footer"
              , W.DataRow.view
                    [ W.DataRow.href "/logAction/#"
                    , W.DataRow.header [ H.text "Admin" ]
                    , W.DataRow.footer [ H.text "user@email.com" ]
                    , W.DataRow.right
                        [ W.Button.view [ W.Button.primary ]
                            { label = [ H.text "Click me" ]
                            , onClick = logAction "onClick Action"
                            }
                        ]
                    ]
                    [ H.text "Label" ]
              )
            , ( "With Actions + Header + Footer + Left"
              , W.DataRow.view
                    [ W.DataRow.href "/logAction/#"
                    , W.DataRow.header [ H.text "Admin" ]
                    , W.DataRow.footer [ H.text "user@email.com" ]
                    , W.DataRow.left [ W.Loading.ripples [] ]
                    , W.DataRow.right
                        [ W.Button.view [ W.Button.primary ]
                            { label = [ H.text "Click me" ]
                            , onClick = logAction "onClick Action"
                            }
                        ]
                    ]
                    [ H.text "Label" ]
              )
            , ( "With Actions + Header + Footer + Left (Other)"
              , W.DataRow.view
                    [ W.DataRow.href "/logAction/#"
                    , W.DataRow.header [ H.text "Admin" ]
                    , W.DataRow.footer [ H.text "user@email.com" ]
                    , W.DataRow.left
                        [ H.div
                            [ HA.style "background" "#f5f5f5"
                            , HA.style "border-radius" "50%"
                            , HA.style "border" "3px solid #dadada"
                            , HA.style "width" "20px"
                            , HA.style "height" "20px"
                            ]
                            []
                        ]
                    , W.DataRow.right
                        [ W.Button.view [ W.Button.primary ]
                            { label = [ H.text "Click me" ]
                            , onClick = logAction "onClick Action"
                            }
                        ]
                    ]
                    [ H.text "Label" ]
              )
            ]
