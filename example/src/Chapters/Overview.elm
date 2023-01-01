module Chapters.Overview exposing (Model, chapter_, init)

import Color
import ElmBook
import ElmBook.Actions
import ElmBook.Chapter exposing (Chapter, chapter, render, withComponentOptions, withStatefulComponentList)
import ElmBook.ComponentOptions
import Html as H
import Html.Attributes as HA
import Mask
import Theme
import Time
import W.Button
import W.Container
import W.Heading
import W.InputField
import W.InputInt
import W.InputSelect
import W.InputText
import W.InputTime
import W.Internal.Helpers as WH
import W.Message
import W.Modal
import W.Tag
import W.Text


type alias Model =
    { inputMask : String
    , inputMaskResult : Maybe (Result (List W.InputText.Error) String)
    , select : Role
    , time : Maybe Time.Posix
    }


type Role
    = Viewer
    | Editor
    | Admin


roleToString : Role -> String
roleToString role =
    case role of
        Viewer ->
            "Viewer"

        Editor ->
            "Editor"

        Admin ->
            "Admin"


init : Model
init =
    { inputMask = ""
    , inputMaskResult = Nothing
    , select = Viewer
    , time = Nothing
    }


type Msg
    = OnInputMask (Result (List W.InputText.Error) String) String
    | OnSelect Role
    | OnSelectTime (Maybe Time.Posix)


update : Msg -> Model -> Model
update msg model =
    case msg of
        OnInputMask result v ->
            { model
                | inputMask = v
                , inputMaskResult = Just result
            }

        OnSelect v ->
            { model | select = v }

        OnSelectTime v ->
            { model | time = v }


toMsg : Msg -> ElmBook.Msg { m | overview : Model }
toMsg =
    ElmBook.Actions.mapUpdate
        { fromState = .overview
        , toState = \s m -> { s | overview = m }
        , update = update
        }


chapter_ : Chapter { m | overview : Model }
chapter_ =
    chapter "Overview"
        |> withComponentOptions
            [ ElmBook.ComponentOptions.hiddenLabel True
            ]
        |> withStatefulComponentList
            [ ( "modal"
              , \_ ->
                    H.div
                        [ HA.attribute "style" ("display: flex; align-items: center; justify-content: center; border-radius: 4px; padding: 40px 20px; background:" ++ Theme.baseAuxWithAlpha 0.1)
                        ]
                        [ W.Modal.viewToggle "my-modal-toggle"
                            [ W.Button.viewDummy []
                                [ H.text "Toggle Modal"
                                ]
                            ]
                        , W.Modal.viewToggable []
                            { id = "my-modal-toggle"
                            , content =
                                [ W.Container.view [ W.Container.pad_8, W.Container.gap_2 ]
                                    [ W.Heading.view [ W.Heading.alignCenter, W.Heading.primary ] [ H.text "Oh no... a modal package?" ]
                                    , W.Text.view [ W.Text.alignCenter ] [ H.text "Don't worry! No messages were harmed in the toggling of this modal!" ]
                                    ]
                                ]
                            }
                        ]
              )
            , ( "input-mask"
              , \state ->
                    W.InputField.view
                        [ W.InputField.hint
                            [ H.text "Natively validates strings based on html attrs."
                            ]
                        ]
                        { label =
                            [ H.text "Pattern Language" ]
                        , input =
                            [ W.InputText.viewWithValidation
                                [ W.InputText.mask (Mask.string "(##) ####-####")
                                , W.InputText.required True
                                , W.InputText.exactLength 10
                                , W.InputText.placeholder "(55) 9999-9999"
                                ]
                                { onInput = OnInputMask
                                , value = state.overview.inputMask
                                }
                            , case state.overview.inputMaskResult of
                                Just result ->
                                    W.Container.view
                                        [ W.Container.padTop_2 ]
                                        [ case result of
                                            Ok value ->
                                                W.Message.view
                                                    [ W.Message.success ]
                                                    [ H.text "You got it! \""
                                                    , H.text value
                                                    , H.text "\" is a valid value!"
                                                    ]

                                            Err errors ->
                                                errors
                                                    |> List.head
                                                    |> Maybe.map
                                                        (\error ->
                                                            W.Message.view
                                                                [ W.Message.danger ]
                                                                [ W.InputText.errorToString error
                                                                    |> H.text
                                                                ]
                                                        )
                                                    |> Maybe.withDefault (H.text "")
                                        ]

                                Nothing ->
                                    H.text ""
                            ]
                        }
                        |> H.map toMsg
              )
            , ( "select"
              , \state ->
                    W.Container.view [ W.Container.gap_2, W.Container.horizontal ]
                        [ W.InputSelect.view []
                            { value = state.overview.select
                            , options = [ Viewer, Editor, Admin ]
                            , toLabel = roleToString
                            , onInput = OnSelect
                            }
                        , W.InputTime.view []
                            { value = state.overview.time
                            , timeZone = Time.utc
                            , onInput = OnSelectTime
                            }
                        ]
                        |> H.map toMsg
              )
            , ( "layout"
              , \_ ->
                    let
                        square : H.Html msg
                        square =
                            H.div
                                [ WH.styles
                                    [ ( "width", "40px" )
                                    , ( "height", "40px" )
                                    , ( "background", Theme.primaryForegroundWithAlpha 0.8 )
                                    , ( "border-radius", "4px" )
                                    ]
                                ]
                                []
                    in
                    W.Container.view
                        [ W.Container.background (Theme.baseForegroundWithAlpha 0.07)
                        , W.Container.horizontal
                        , W.Container.gap_4
                        , W.Container.pad_4
                        , W.Container.alignTop
                        , W.Container.alignRight
                        , W.Container.largeScreen
                            [ W.Container.vertical
                            , W.Container.alignCenterX
                            , W.Container.alignCenterY
                            ]
                        , W.Container.htmlAttrs [ HA.style "height" "200px" ]
                        ]
                        [ square, square ]
              )
            , ( "themable"
              , \_ ->
                    let
                        card : H.Html msg
                        card =
                            W.Container.view
                                [ W.Container.horizontal
                                , W.Container.card
                                , W.Container.spaceBetween
                                , W.Container.pad_4
                                ]
                                [ W.Container.view []
                                    [ W.Heading.view [] [ H.text "Heading" ]
                                    , W.Text.view [] [ H.text "Some text" ]
                                    ]
                                , W.Container.view [ W.Container.horizontal, W.Container.gap_2 ]
                                    [ W.Tag.view [ W.Tag.primary ] [ H.text "Stateless" ]
                                    , W.Tag.view [ W.Tag.secondary ] [ H.text "Tasteful" ]
                                    ]
                                ]

                        blueTheme : Theme.Theme
                        blueTheme =
                            Theme.darkTheme
                                |> Theme.fromTheme
                                |> Theme.withFontHeading "'Press Start 2P'"
                                |> Theme.withFontText "Raleway"
                                |> Theme.withBaseBackground (Color.rgb255 18 133 233)
                                |> Theme.withPrimary (Theme.darkTheme |> Theme.toThemeData |> .success)
                                |> Theme.toTheme

                        blueDarkTheme : Theme.Theme
                        blueDarkTheme =
                            blueTheme
                                |> Theme.fromTheme
                                |> Theme.withBaseBackground (Color.rgb255 0 34 63)
                                |> Theme.withBaseForeground (Color.rgb255 101 173 235)
                                |> Theme.toTheme

                        pinkTheme : Theme.Theme
                        pinkTheme =
                            Theme.darkTheme
                                |> Theme.fromTheme
                                |> Theme.withFontHeading "Leckerli One"
                                |> Theme.withFontText "Patrick Hand"
                                |> Theme.withBaseBackground (Color.rgb255 255 77 241)
                                |> Theme.withBaseForeground (Color.rgb255 109 13 101)
                                |> Theme.withPrimaryForeground (Color.rgb255 0 88 190)
                                |> Theme.withSecondary (Theme.darkTheme |> Theme.toThemeData |> .base)
                                |> Theme.toTheme

                        pinkDarkTheme : Theme.Theme
                        pinkDarkTheme =
                            Theme.darkTheme
                                |> Theme.fromTheme
                                |> Theme.withFontHeading "Leckerli One"
                                |> Theme.withFontText "Patrick Hand"
                                |> Theme.withBaseBackground (Color.rgb255 85 2 79)
                                |> Theme.withBaseForeground (Color.rgb255 255 115 243)
                                |> Theme.withSecondary (Theme.darkTheme |> Theme.toThemeData |> .base)
                                |> Theme.toTheme
                    in
                    W.Container.view [ W.Container.gap_4 ]
                        [ card
                        , Theme.providerWithDarkMode
                            { light = blueTheme
                            , dark = blueDarkTheme
                            , strategy = Theme.classStrategy "elm-book-dark-mode"
                            }
                            []
                            [ card ]
                        , Theme.providerWithDarkMode
                            { light = pinkTheme
                            , dark = pinkDarkTheme
                            , strategy = Theme.classStrategy "elm-book-dark-mode"
                            }
                            []
                            [ card ]
                        ]
              )
            ]
        |> render """
**elm-widgets** is a collection of stateless widgets designed to make your experience building elm applications easier and even more delightful.

---

## Stateless Views

Easy to plug-n-play. No state management. No glue code.

<component with-label="modal" />

```elm
W.Modal.viewToggable []
    { id = "my-modal"
    , content = [ ... ]
    }

W.Modal.viewToggle "my-modal"
    [ W.Button.viewDummy []
        [ H.text "Toggle Modal" ]
    ]
```


## Let's use the platform

We're trying to push the boundaries of what is currently possible by the use of HTML, CSS and Elm's views and event decoders.

<component with-label="input-mask" />

```elm
W.InputText.viewWithValidation
    [ W.InputText.mask (Mask.string "(##) ####-####")
    , W.InputText.required True
    , W.InputText.exactLength 10
    , W.InputText.placeholder "(55) 9999-9999"
    ]
    { onInput = GotInput
    , value = model.input
    }
```

> Note that the `Mask.string` function used in this example is not actually part of **elm-widgets** but you can find one such package [here](https://package.elm-lang.org/packages/Massolari/elm-mask/latest/).

## Type-safe inputs and outputs

Keep using your Elm types on your view boundaries.

<component with-label="select" />

```elm
type Msg
    = SelectedTime (Maybe Time.Posix)
    | SelectedRole Role.Role

W.InputTime.view []
    { value = currentDate
    , timeZone = Time.utc
    , onInput = SelectedDate
    }

W.InputSelect.view
    [ W.InputSelect.prefix "Role"
    ]
    { value = Role.Viewer
    , options = [ Role.Viewer, Role.Editor, Role.Admin ]
    , toLabel = Role.toString
    , onInput = SelectedRole
    }
```

---

## Responsive Layouts

Becoming the most powerful layout DSL is not the goal of elm-widgets. However, we want to give you a batteries included experience so you don't need to worry about extra dependencies, CSS integration, tailwind, etc.

With our [W.Container](https://package.elm-lang.org/packages/uncover-co/elm-widgets/latest/W-Container) widget you should be able to create most of what you want and we even give you a few responsive possibilities:

<component with-label="layout" />

```elm
W.Container.view
    [ W.Container.gap_4
    , W.Container.pad_4
    , W.Container.horizontal
    , W.Container.alignTop
    , W.Container.alignRight
    , W.Container.largeScreen
        [ W.Container.vertical
        , W.Container.alignCenterX
        , W.Container.alignCenterY
        ]
    ]
    [ square, square ]
```

> If you're using Elm, you probably already know we have some pretty powerful layouting engines like [elm-ui](todo). We're not aiming to replace that in any way! You should be able to easily use elm-widgets along side it. 🎉 

---

## Themable

All your widgets should be able to fit your app's look and feel.

<component with-label="themable" />

Dark mode? Yeah! That too. Press that small moon up at the top! ☝️

---

## Next Steps

Our goal with elm-widgets is to build a large collection of stateless, themable, accessible and type-safe widgets. The platform is constantly evolving and so the list of things we can do with plain HTML, CSS (and Elm pure functions and event decoders).

If you know of a particular CSS/HTML/Elm feature we could use to build something interesting or improve our current widgets, open an issue and let's discuss! 

We care a lot about backwards compatibility, so we try to make things as stable as possible. With that in mind, we also maintain a second package called [uncover-co/elm-widgets-alpha](todo) where we may experiment with new widgets before their API is stable enough for release.

"""
