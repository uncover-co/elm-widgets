module Chapters.Form.InputAutocomplete exposing (Model, chapter_, init)

import ElmBook
import ElmBook.Actions
import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import Html as H
import Html.Attributes as HA
import Http
import Json.Decode as D
import W.InputAutocomplete
import W.Text



--


type alias Person =
    { name : String
    , email : String
    }


type alias Model =
    { value : W.InputAutocomplete.Value Person
    , options : Maybe (List Person)
    }


type Msg
    = OnInput (W.InputAutocomplete.Value Person)
    | GotOptions (Result Http.Error (List Person))


init : Model
init =
    { value =
        W.InputAutocomplete.init
            { value = Nothing
            , toString = .name
            }
    , options = Nothing
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnInput value ->
            ( { model | value = value |> Debug.log "value" }
            , case W.InputAutocomplete.toString value of
                "" ->
                    Cmd.none

                term ->
                    searchPersons term
            )

        GotOptions result ->
            case result of
                Ok options ->
                    ( { model | options = Just options |> Debug.log "options" }, Cmd.none )

                _ ->
                    ( model, Cmd.none )



{- TODO: Use packages.elm-book.com as a search engine as soon as that is ready. -}


searchPersons : String -> Cmd Msg
searchPersons term =
    Http.get
        { url = "https://gorest.co.in/public/v2/users?name=" ++ term
        , expect =
            D.map2 Person
                (D.field "name" D.string)
                (D.field "email" D.string)
                |> D.list
                |> Http.expectJson GotOptions
        }



--


viewDoc :
    ( String, Model -> H.Html Msg )
    -> ( String, { x | autocomplete : Model } -> H.Html (ElmBook.Msg { x | autocomplete : Model }) )
viewDoc ( title, fn ) =
    ( title
    , \model ->
        fn model.autocomplete
            |> H.map
                (ElmBook.Actions.mapUpdateWithCmd
                    { toState = \state m -> { state | autocomplete = m }
                    , fromState = .autocomplete
                    , update = update
                    }
                )
    )


chapter_ : Chapter { x | autocomplete : Model }
chapter_ =
    chapter "Input Autocomplete"
        |> renderStatefulComponentList
            ([ ( "Default"
               , \{ value, options } ->
                    W.InputAutocomplete.view
                        [ W.InputAutocomplete.placeholder "Search by name…"
                        ]
                        { id = "autocomplete-default"
                        , value = value
                        , options = options
                        , onInput = OnInput
                        }
               )
             , ( "Loading"
               , \{ value } ->
                    W.InputAutocomplete.view [ W.InputAutocomplete.placeholder "Fetching some options…" ]
                        { id = "autocomplete-loading"
                        , value = value
                        , options = Nothing
                        , onInput = OnInput
                        }
               )
             , ( "Read Only"
               , \{ value, options } ->
                    W.InputAutocomplete.view
                        [ W.InputAutocomplete.readOnly True
                        , W.InputAutocomplete.placeholder "You can't touch me"
                        ]
                        { id = "autocomplete-read-only"
                        , value = value
                        , options = options
                        , onInput = OnInput
                        }
               )
             , ( "Sync"
               , \{ value, options } ->
                    W.InputAutocomplete.view
                        [ W.InputAutocomplete.placeholder "Search for a number…"
                        ]
                        { id = "autocomplete-read-only"
                        , value = value
                        , options = options
                        , onInput = OnInput
                        }
               )
             , ( "Custom Renders"
               , \{ value, options } ->
                    W.InputAutocomplete.viewCustom
                        [ W.InputAutocomplete.placeholder "Search for a number…"
                        , W.InputAutocomplete.optionsHeader
                            (\input ->
                                if input == "" then
                                    W.Text.view
                                        [ W.Text.small ]
                                        [ H.text <| "Please search a number between 0 and 10." ]

                                else
                                    W.Text.view
                                        [ W.Text.small ]
                                        [ H.text <| "Searching for \"" ++ input ++ "\"..." ]
                            )
                        ]
                        { id = "autocomplete-read-only"
                        , value = value
                        , options = options
                        , onInput = OnInput
                        , toHtml =
                            \option ->
                                H.div []
                                    [ H.p [ HA.class "ew-m-0 ew-p-0" ] [ H.text option.name ]
                                    , if Just option == W.InputAutocomplete.toValue value then
                                        H.p [ HA.class "ew-m-0 ew-p-0 ew-text-sm" ] [ H.text "Active" ]

                                      else
                                        H.p [ HA.class "ew-m-0 ew-p-0 ew-text-sm" ] [ H.text "Not active" ]
                                    ]
                        }
               )
             ]
                |> List.map viewDoc
            )
