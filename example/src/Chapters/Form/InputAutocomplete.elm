module Chapters.Form.InputAutocomplete exposing (Model, chapter_, init)

import ElmBook
import ElmBook.Actions
import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import Html as H
import Html.Attributes as HA
import Http
import Json.Decode as D
import Process
import Task
import Time
import W.Container
import W.InputAutocomplete
import W.Tag
import W.Text



-- Constants


debounceTime : Int
debounceTime =
    200



-- Model & Update


type alias Person =
    { name : String
    , email : String
    }


type alias Model =
    { value : W.InputAutocomplete.Value Person
    , options : Maybe (List Person)
    , selected : List Person
    , isLoading : Bool
    , debounceUntil : Maybe Time.Posix
    }


type Msg
    = OnInput (W.InputAutocomplete.Value Person)
    | OnRemoveLast
    | ScheduleGetOptions Time.Posix
    | GetOptions Time.Posix
    | GotOptions (Result Http.Error (List Person))


init : Model
init =
    { value =
        W.InputAutocomplete.init
            { value = Nothing
            , toString = .name
            }
    , options = Nothing
    , selected = []
    , isLoading = False
    , debounceUntil = Nothing
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnInput value ->
            case W.InputAutocomplete.toValue value of
                Just person ->
                    ( { model
                        | value = W.InputAutocomplete.reset value
                        , selected = model.selected ++ [ person ]
                      }
                    , Cmd.none
                    )

                Nothing ->
                    ( { model | value = value }
                    , if W.InputAutocomplete.stringChanged value model.value then
                        Task.perform ScheduleGetOptions Time.now

                      else
                        Cmd.none
                    )

        OnRemoveLast ->
            ( { model | selected = model.selected |> List.reverse |> List.drop 1 |> List.reverse }, Cmd.none )

        ScheduleGetOptions time ->
            let
                targetTime : Time.Posix
                targetTime =
                    time
                        |> Time.posixToMillis
                        |> (+) debounceTime
                        |> Time.millisToPosix
            in
            ( { model | isLoading = True, debounceUntil = Just targetTime }
            , Process.sleep (toFloat debounceTime)
                |> Task.map (\_ -> targetTime)
                |> Task.perform GetOptions
            )

        GetOptions debounce ->
            let
                searchTerm : String
                searchTerm =
                    W.InputAutocomplete.toString model.value
            in
            case model.debounceUntil of
                Just target ->
                    if Time.posixToMillis debounce >= Time.posixToMillis target && searchTerm /= "" then
                        ( model, searchPersons searchTerm )

                    else
                        ( model, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        GotOptions result ->
            case result of
                Ok options ->
                    ( { model | options = Just options, isLoading = False }, Cmd.none )

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



-- View


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
               , \{ value, options, selected, isLoading } ->
                    W.Container.view
                        [ W.Container.gap_2 ]
                        [ selected
                            |> List.map (\x -> W.Tag.view [] [ H.text x.name ])
                            |> W.Container.view
                                [ W.Container.horizontal
                                , W.Container.gap_2
                                ]
                        , W.InputAutocomplete.viewCustom
                            [ W.InputAutocomplete.placeholder "Search by name…"
                            , W.InputAutocomplete.isLoading isLoading
                            , W.InputAutocomplete.onDelete OnRemoveLast
                            , W.InputAutocomplete.optionsHeader
                                (\input ->
                                    if input == "" then
                                        W.Text.view
                                            [ W.Text.small ]
                                            [ H.text <| "Place write a few letters of an indian name." ]

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
                                        , H.p [ HA.class "ew-m-0 ew-p-0 ew-text-sm" ] [ H.text option.email ]
                                        ]
                            }
                        ]
               )
             ]
                |> List.map viewDoc
            )
