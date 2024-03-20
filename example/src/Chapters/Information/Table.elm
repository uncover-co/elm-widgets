module Chapters.Information.Table exposing (..)

import ElmBook.Actions exposing (logAction, logActionWithString)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import Html as H
import Html.Attributes as HA
import W.Table
import W.Tooltip


data :
    List
        { age : Int
        , score : Float
        , ready : Bool
        , picture : String
        , name : String
        }
data =
    [ { name = "Georges Boris"
      , age = 33
      , score = 85
      , ready = False
      , picture = "https://picsum.photos/100"
      }
    , { name = "Janine Bonfadini"
      , age = 35
      , score = 904.6
      , ready = True
      , picture = "https://picsum.photos/120"
      }
    ]
        |> List.repeat 10
        |> List.concat


chapter_ : Chapter x
chapter_ =
    chapter "Table"
        |> renderComponentList
            [ ( "Default"
              , W.Table.view
                    [ W.Table.onClick (logActionWithString "onClick" << .name)
                    , W.Table.onMouseEnter (logActionWithString "onMouseEnter" << .name)
                    , W.Table.onMouseLeave (logAction "onMouseLeave")
                    , W.Table.highlight (.age >> (==) 35)
                    ]
                    [ W.Table.column
                        [ W.Table.width 60, W.Table.largeScreenOnly ]
                        { label = "Image"
                        , content =
                            \{ picture } -> H.img [ HA.src picture, HA.height 60 ] []
                        }
                    , W.Table.string []
                        { label = "Name"
                        , value = .name
                        }
                    , W.Table.int [ W.Table.width 80 ]
                        { label = "Age"
                        , value = .age
                        }
                    , W.Table.float [ W.Table.width 80 ]
                        { label = "Score"
                        , value = .score
                        }
                    , W.Table.bool [ W.Table.width 80 ]
                        { label = "Ready?"
                        , value = .ready
                        }
                    ]
                    data
              )
            , ( "Groups"
              , W.Table.view
                    [ W.Table.groupBy .name
                    , W.Table.groupCollapsed (\_ n -> n == "Janine Bonfadini")
                    , W.Table.onGroupClick (logActionWithString "onGroupClick" << .name)
                    , W.Table.onGroupMouseEnter (logActionWithString "onGroupMouseEnter" << .name)
                    , W.Table.onGroupMouseLeave (logAction "onGroupMouseLeave")
                    , W.Table.htmlAttrs [ HA.style "max-height" "400px" ]
                    ]
                    [ W.Table.column
                        [ W.Table.width 60, W.Table.largeScreenOnly ]
                        { label = "Image"
                        , content =
                            \{ picture } -> H.img [ HA.src picture, HA.height 60 ] []
                        }
                    , W.Table.string [ W.Table.groupLabel ]
                        { label = "Name"
                        , value = .name
                        }
                    , W.Table.int
                        [ W.Table.width 80
                        , W.Table.groupValue
                            (\_ xs ->
                                xs
                                    |> List.foldl (\x acc -> x.age + acc) 0
                                    |> String.fromInt
                                    |> H.text
                            )
                        ]
                        { label = "Age"
                        , value = .age
                        }
                    , W.Table.float [ W.Table.width 80 ]
                        { label = "Score"
                        , value = .score
                        }
                    , W.Table.bool [ W.Table.width 80 ]
                        { label = "Ready?"
                        , value = .ready
                        }
                    ]
                    data
              )
            , ( "Custom Column Label"
              , W.Table.view
                    [ W.Table.htmlAttrs [ HA.style "max-height" "400px" ]
                    ]
                    [ W.Table.string
                        [ W.Table.customLabel
                            (W.Tooltip.view []
                                { tooltip = [H.text "Person name"]
                                , children = [H.text "Name"]
                                })
                        ]
                        { label = "Name"


                        , value = .name
                        }
                    , W.Table.int
                        [ W.Table.width 80
                        , W.Table.customLabel
                            (W.Tooltip.view []
                                { tooltip = [H.text "Person age"]
                                , children = [H.text "Age"]
                                })
                        ]
                        { label = "Age"
                        , value = .age
                        }

                    ]
                    [ { name = "João", age = 28 }
                    , { name = "Maria", age = 29 }
                    ]
              )
            ]
