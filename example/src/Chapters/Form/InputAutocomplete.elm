module Chapters.Form.InputAutocomplete exposing (Model, chapter_, init)

import ElmBook
import ElmBook.Actions exposing (logAction, logActionWithString)
import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import Html as H
import Html.Attributes as HA
import W.InputAutocomplete
import W.Text


type alias Model =
    W.InputAutocomplete.Value Int


init : Model
init =
    W.InputAutocomplete.init
        { value = Nothing
        , toString = String.fromInt
        }


logAction_ : String -> W.InputAutocomplete.Value Int -> ElmBook.Msg x
logAction_ label value =
    W.InputAutocomplete.toValue value
        |> Maybe.map String.fromInt
        |> Maybe.withDefault "Nothing"
        |> logActionWithString label


chapter_ : Chapter { x | autocomplete : Model }
chapter_ =
    chapter "Input Autocomplete"
        |> renderStatefulComponentList
            [ ( "Default"
              , \model ->
                    W.InputAutocomplete.view
                        [ W.InputAutocomplete.placeholder "Search for a number…"
                        , W.InputAutocomplete.onFocus (logAction "onFocus")
                        , W.InputAutocomplete.onBlur (logAction "onBlur")
                        , W.InputAutocomplete.onEnter (logAction "onEnter")
                        ]
                        { id = "autocomplete-default"
                        , value = model.autocomplete
                        , options = Just (List.range 0 10)
                        , onInput =
                            \value ->
                                ElmBook.Actions.updateState (\model_ -> { model_ | autocomplete = value })
                        }
              )
            , ( "Loading"
              , \model ->
                    W.InputAutocomplete.view [ W.InputAutocomplete.placeholder "Fetching some options…" ]
                        { id = "autocomplete-loading"
                        , value = model.autocomplete
                        , options = Nothing
                        , onInput = logAction_ "onInput"
                        }
              )
            , ( "Read Only"
              , \model ->
                    W.InputAutocomplete.view
                        [ W.InputAutocomplete.readOnly True
                        , W.InputAutocomplete.placeholder "You can't touch me"
                        ]
                        { id = "autocomplete-read-only"
                        , value = model.autocomplete
                        , options = Just (List.range 0 10)
                        , onInput = logAction_ "onInput"
                        }
              )
            , ( "Custom Renders"
              , \model ->
                    W.InputAutocomplete.viewCustom
                        [ W.InputAutocomplete.placeholder "Search for a number…"
                        , W.InputAutocomplete.renderHeader
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
                        , value = model.autocomplete
                        , options = Just (List.range 0 10)
                        , onInput =
                            \value ->
                                ElmBook.Actions.updateState
                                    (\model_ -> { model_ | autocomplete = value })
                        , toHtml =
                            \option ->
                                H.div []
                                    [ H.p [ HA.class "ew-m-0 ew-p-0" ] [ H.text <| String.fromInt option ]
                                    , if Just option == W.InputAutocomplete.toValue model.autocomplete then
                                        H.p [ HA.class "ew-m-0 ew-p-0 ew-text-sm" ] [ H.text "Active" ]
                                      else
                                        H.p [ HA.class "ew-m-0 ew-p-0 ew-text-sm" ] [ H.text "Not active" ]
                                    ]
                        }
              )
            ]
