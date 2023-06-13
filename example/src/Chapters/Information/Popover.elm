module Chapters.Information.Popover exposing (Model, chapter_, init)

import ElmBook
import ElmBook.Actions
import ElmBook.Chapter exposing (Chapter, chapter, renderWithComponentList, withComponentList, withStatefulComponent)
import Html as H
import Process
import Task
import Theme
import UI
import W.Button
import W.Container
import W.Divider
import W.Menu
import W.Popover
import W.Text


type alias Model =
    { isOpen : Bool
    , timer : Int
    }


type Msg
    = Show
    | Tick


init : Model
init =
    { isOpen = False
    , timer = 0
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Show ->
            ( { model | isOpen = True, timer = 5 }
            , scheduleTick
            )

        Tick ->
            if model.timer == 1 then
                ( { model | isOpen = False }, Cmd.none )

            else
                ( { model | timer = model.timer - 1 }, scheduleTick )


scheduleTick : Cmd Msg
scheduleTick =
    Process.sleep 1000
        |> Task.perform (\_ -> Tick)


children :
    String
    ->
        { content : List (H.Html (ElmBook.Msg x))
        , trigger : List (H.Html (ElmBook.Msg x))
        }
children label =
    { content =
        [ W.Container.view
            [ W.Container.card ]
            [ W.Menu.view
                [ W.Menu.viewButton []
                    { label = [ H.text "Item" ]
                    , onClick = ElmBook.Actions.logAction "onClick"
                    }
                , W.Menu.viewButton []
                    { label = [ H.text "Item" ]
                    , onClick = ElmBook.Actions.logAction "onClick"
                    }
                , W.Divider.view [] []
                , W.Popover.viewNext
                    [ W.Popover.showOnHover
                    , W.Popover.right
                    , W.Popover.width 80
                    , W.Popover.offset 4
                    ]
                    { trigger =
                        [ W.Menu.viewDummy []
                            [ H.text "Item" ]
                        ]
                    , content =
                        [ W.Menu.viewButton []
                            { label = [ H.text "Item" ]
                            , onClick = ElmBook.Actions.logAction "onClick"
                            }
                        , W.Menu.viewButton []
                            { label = [ H.text "Item" ]
                            , onClick = ElmBook.Actions.logAction "onClick"
                            }
                        ]
                    }
                ]
            ]
        ]
    , trigger =
        [ W.Button.viewDummy [] [ H.text label ]
        ]
    }


chapter_ : Chapter { x | popover : Model }
chapter_ =
    chapter "Popover"
        |> withComponentList
            ([ ( "Bottom (Persistent)", [ W.Popover.persistent ] )
             , ( "Bottom Right", [ W.Popover.bottomRight ] )
             , ( "Top", [ W.Popover.top ] )
             , ( "Top Right", [ W.Popover.topRight ] )
             , ( "Left", [ W.Popover.left ] )
             , ( "Left Bottom", [ W.Popover.leftBottom ] )
             , ( "Right", [ W.Popover.right ] )
             , ( "Right Bottom", [ W.Popover.rightBottom ] )
             ]
                |> List.map
                    (\( label, attrs ) ->
                        ( label
                        , UI.hSpacer
                            [ W.Popover.viewNext attrs (children "Default")
                            , W.Popover.viewNext (W.Popover.over :: attrs) (children "Over")
                            , W.Popover.viewNext (W.Popover.offset 4 :: attrs) (children "Offset")
                            , W.Popover.viewNext (W.Popover.full True :: attrs) (children "Full")
                            , W.Popover.viewNext (W.Popover.showOnHover :: W.Popover.offset 4 :: attrs) (children "Hover")
                            ]
                        )
                    )
            )
        |> withStatefulComponent
            (\{ popover } ->
                W.Popover.viewControlled
                    [ W.Popover.right, W.Popover.offset 4, W.Popover.width 160 ]
                    { isOpen = popover.isOpen
                    , trigger =
                        [ W.Button.view
                            [ W.Button.disabled popover.isOpen ]
                            { onClick = Show
                            , label =
                                [ if not popover.isOpen then
                                    H.text "Show Popover"

                                  else
                                    H.text ("Closing in… " ++ String.fromInt popover.timer)
                                ]
                            }
                        ]
                    , content =
                        [ W.Container.view
                            [ W.Container.pad_4
                            , W.Container.shadow
                            , W.Container.extraRounded
                            , W.Container.background Theme.warningBackground
                            ]
                            [ W.Text.view [ W.Text.color Theme.warningForeground ] [ H.text "I'll only close when I want to." ] ]
                        ]
                    }
                    |> H.map
                        (ElmBook.Actions.mapUpdateWithCmd
                            { toState = \state m -> { state | popover = m }
                            , fromState = .popover
                            , update = update
                            }
                        )
            )
        |> renderWithComponentList ""
