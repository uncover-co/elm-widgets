module Chapters.Form.InputText exposing (Model, chapter_, init)

import ElmBook.Actions exposing (logAction, logActionWithString, updateState, updateStateWith)
import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import Html as H
import Html.Attributes as HA
import W.Button
import W.Container
import W.InputText
import W.Text


type alias Model =
    { value : String
    , validated : String
    , validationMessage : String
    }


init : Model
init =
    { value = "Some text"
    , validated = "Some text"
    , validationMessage = ""
    }


chapter_ : Chapter { x | inputText : Model }
chapter_ =
    chapter "Input Text"
        |> renderStatefulComponentList
            [ ( "Default"
              , \{ inputText } ->
                    W.InputText.view
                        [ W.InputText.placeholder "Type something…"
                        , W.InputText.mask (\s -> "R$ " ++ s)
                        , W.InputText.prefix [ H.text "$" ]
                        ]
                        { value = inputText.value
                        , onInput =
                            updateStateWith
                                (\v model ->
                                    let
                                        inputText_ =
                                            model.inputText
                                    in
                                    { model | inputText = { inputText_ | value = v } }
                                )
                        }
              )
            , ( "Disabled"
              , \_ ->
                    W.InputText.view
                        [ W.InputText.placeholder "Type something…"
                        , W.InputText.suffix [ H.div [ HA.style "height" "60px" ] [ H.text "Email" ] ]
                        , W.InputText.disabled True
                        ]
                        { value = ""
                        , onInput = logActionWithString "onInput"
                        }
              )
            , ( "Read Only"
              , \_ ->
                    W.InputText.view
                        [ W.InputText.placeholder "Type something…"
                        , W.InputText.readOnly True
                        ]
                        { value = ""
                        , onInput = logActionWithString "onInput"
                        }
              )
            , ( "Password"
              , \_ ->
                    W.InputText.view
                        [ W.InputText.password
                        , W.InputText.placeholder "Type your password…"
                        , W.InputText.suffix
                            [ W.Button.view
                                [ W.Button.small, W.Button.invisible ]
                                { label = [ H.text "Show" ]
                                , onClick = logAction "onClick"
                                }
                            ]
                        ]
                        { value = ""
                        , onInput = logActionWithString "onInput"
                        }
              )
            , ( "Search"
              , \_ ->
                    W.InputText.view
                        [ W.InputText.search
                        , W.InputText.placeholder "Search…"
                        ]
                        { value = ""
                        , onInput = logActionWithString "onInput"
                        }
              )
            , ( "Email"
              , \_ ->
                    W.InputText.view
                        [ W.InputText.email
                        , W.InputText.placeholder "user@email.com"
                        ]
                        { value = ""
                        , onInput = logActionWithString "onInput"
                        }
              )
            , ( "Url"
              , \_ ->
                    W.InputText.view
                        [ W.InputText.url
                        , W.InputText.placeholder "https://app.site.com"
                        ]
                        { value = ""
                        , onInput = logActionWithString "onInput"
                        }
              )
            , ( "Validation"
              , \{ inputText } ->
                    H.div []
                        [ W.InputText.viewWithValidation
                            [ W.InputText.url
                            , W.InputText.minLength 5
                            , W.InputText.maxLength 15
                            , W.InputText.pattern "http://[a-z]+"
                            , W.InputText.placeholder "https://app.site.com"
                            ]
                            { value = inputText.validated
                            , onInput =
                                \result v ->
                                    updateState
                                        (\model ->
                                            let
                                                inputText_ =
                                                    model.inputText
                                            in
                                            { model
                                                | inputText =
                                                    { inputText_
                                                        | validated = v
                                                        , validationMessage =
                                                            case result of
                                                                Ok v_ ->
                                                                    "Ok " ++ v_

                                                                Err error ->
                                                                    error
                                                                        |> List.map W.InputText.errorToString
                                                                        |> String.join " "
                                                                        |> (++) "Err "
                                                    }
                                            }
                                        )
                            }
                        , W.Container.view
                            [ W.Container.pad_2 ]
                            [ W.Text.view [] [ H.text inputText.validationMessage ]
                            ]
                        ]
              )
            ]
