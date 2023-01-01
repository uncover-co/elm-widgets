module Chapters.Theme exposing (Model, chapter_, init)

import Color
import ElmBook.Actions
import ElmBook.Chapter exposing (Chapter, chapter, renderWithComponentList, withStatefulComponent)
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import SolidColor
import SolidColor.Accessibility
import Theme
import W.Badge
import W.Container
import W.Divider
import W.Heading
import W.InputColor
import W.Internal.Color exposing (fromHex, toHex, toSolidColor)
import W.Text
import W.Tooltip


chapter_ : Chapter { m | theme : Model }
chapter_ =
    chapter "Themes"
        |> withStatefulComponent
            (\state ->
                view state.theme
                    |> H.map
                        (ElmBook.Actions.mapUpdate
                            { toState = \state_ theme -> { state_ | theme = theme }
                            , fromState = .theme
                            , update = update
                            }
                        )
            )
        |> renderWithComponentList """
This package uses [elm-theme](https://package.elm-lang.org/packages/uncover-co/elm-theme/latest/) as it's theming library. It will use the currently active theme's colors wherever you use it.

---

You can use the theme generator below to test out the colors of your theme and their accessibility ratings. (Note that this generator is still quite WIP as we have lots of ideas to improve it in the short term.)
"""


type alias Model =
    Theme.ThemeData


init : Model
init =
    Theme.lightTheme
        |> Theme.toThemeData


type Msg
    = DoNothing
    | Update ThemeColor ThemeColorDetail Color.Color


type ThemeColor
    = Base
    | Primary
    | Secondary
    | Neutral
    | Success
    | Danger
    | Warning


themeColorLabel : ThemeColor -> String
themeColorLabel themeColor =
    case themeColor of
        Base ->
            "Base"

        Primary ->
            "Primary"

        Secondary ->
            "Secondary"

        Neutral ->
            "Neutral"

        Success ->
            "Success"

        Danger ->
            "Danger"

        Warning ->
            "Warning"


type ThemeColorDetail
    = Background
    | Foreground
    | Aux


themeColorDetailLabel : ThemeColorDetail -> String
themeColorDetailLabel value =
    case value of
        Background ->
            "Background"

        Foreground ->
            "Foreground"

        Aux ->
            "Aux"


update : Msg -> Model -> Model
update msg model =
    case msg of
        DoNothing ->
            model

        Update color detail value ->
            case color of
                Base ->
                    { model | base = updateColor model.base detail value }

                Primary ->
                    { model | primary = updateColor model.primary detail value }

                Secondary ->
                    { model | secondary = updateColor model.secondary detail value }

                Neutral ->
                    { model | neutral = updateColor model.neutral detail value }

                Success ->
                    { model | success = updateColor model.success detail value }

                Danger ->
                    { model | danger = updateColor model.danger detail value }

                Warning ->
                    { model | warning = updateColor model.warning detail value }


updateColor : Theme.ThemeColorSet -> ThemeColorDetail -> Color.Color -> Theme.ThemeColorSet
updateColor colorSet detail value =
    case detail of
        Background ->
            { colorSet | background = value }

        Foreground ->
            { colorSet | foreground = value }

        Aux ->
            { colorSet | aux = value }


view : Model -> H.Html Msg
view model =
    let
        theme : Theme.Theme
        theme =
            Theme.new model

        baseBg : SolidColor.SolidColor
        baseBg =
            toSolidColor model.base.background
    in
    Theme.provider theme
        []
        [ W.Container.view
            [ W.Container.pad_4
            , W.Container.background ("linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), " ++ Theme.baseBackground)
            ]
            [ W.Container.view
                [ W.Container.rounded
                , W.Container.background Theme.baseBackground
                , W.Container.shadow
                ]
                (colorSelector baseBg
                    Update
                    ( Base, model.base, Theme.base )
                    [ W.Text.view [] [ H.text "This is the default text color." ]
                    , W.Text.view [ W.Text.aux ] [ H.text "And this is the auxiliary text color." ]
                    ]
                    :: ([ ( Neutral, model.neutral, Theme.neutral )
                        , ( Primary, model.primary, Theme.primary )
                        , ( Secondary, model.secondary, Theme.secondary )
                        , ( Success, model.success, Theme.success )
                        , ( Warning, model.warning, Theme.warning )
                        , ( Danger, model.danger, Theme.danger )
                        ]
                            |> List.map
                                (\( a, b, c ) ->
                                    H.div
                                        []
                                        [ W.Divider.view [ W.Divider.light ] []
                                        , colorSelector baseBg
                                            Update
                                            ( a, b, c )
                                            [ W.Container.view
                                                [ W.Container.gap_2
                                                , W.Container.padTop_2
                                                ]
                                                [ W.Container.view
                                                    [ W.Container.background c.background
                                                    , W.Container.padX_4
                                                    , W.Container.padY_2
                                                    , W.Container.extraRounded
                                                    ]
                                                    [ W.Text.view
                                                        [ W.Text.color c.aux ]
                                                        [ H.text "Aux on background" ]
                                                    ]
                                                , W.Container.view
                                                    [ W.Container.background (c.foregroundWithAlpha 0.05)
                                                    , W.Container.padX_4
                                                    , W.Container.padY_2
                                                    , W.Container.extraRounded
                                                    ]
                                                    [ W.Text.view
                                                        [ W.Text.color c.foreground ]
                                                        [ H.text "Foreground on tinted base background" ]
                                                    ]
                                                ]
                                            ]
                                        ]
                                )
                       )
                )
            ]
        ]


input : SolidColor.SolidColor -> SolidColor.SolidColor -> (ThemeColorDetail -> Color.Color -> Msg) -> ThemeColorDetail -> H.Html Msg
input color contrastColor msg themeColorDetail =
    W.Container.view []
        [ W.Container.view
            [ W.Container.padBottom_1
            , W.Container.alignLeft
            , W.Container.horizontal
            , W.Container.gap_1
            ]
            [ W.Text.view
                [ W.Text.small, W.Text.semibold ]
                [ H.text (themeColorDetailLabel themeColorDetail) ]
            , contrast color contrastColor
            , a11yStatus color contrastColor
            ]
        , W.Container.view
            [ W.Container.background (Theme.baseForegroundWithAlpha 0.07)
            , W.Container.padX_3
            , W.Container.padY_2
            , W.Container.gap_2
            , W.Container.rounded
            , W.Container.alignRight
            , W.Container.horizontal
            ]
            [ H.div []
                [ W.Text.view [ W.Text.small, W.Text.alignRight ] [ H.text (SolidColor.toHex color) ]
                , W.Text.view [ W.Text.small, W.Text.alignRight ] [ H.text (SolidColor.toRGBString color) ]
                ]
            , W.InputColor.view []
                { value = W.Internal.Color.fromSolidColor color
                , onInput = msg themeColorDetail
                }
            ]
        ]


a11yStatus : SolidColor.SolidColor -> SolidColor.SolidColor -> H.Html msg
a11yStatus fg bg =
    case SolidColor.Accessibility.checkContrast { fontSize = 12, fontWeight = 500 } fg bg of
        SolidColor.Accessibility.Inaccessible ->
            H.text ""

        SolidColor.Accessibility.AA ->
            W.Badge.viewInline [ W.Badge.small, W.Badge.neutral ] [ H.text "AA" ]

        SolidColor.Accessibility.AAA ->
            W.Badge.viewInline [ W.Badge.small, W.Badge.success ] [ H.text "AAA" ]


contrast : SolidColor.SolidColor -> SolidColor.SolidColor -> H.Html msg
contrast c1 c2 =
    SolidColor.Accessibility.contrast c1 c2
        |> String.fromFloat
        |> String.split "."
        |> (\xs ->
                case xs of
                    [] ->
                        ""

                    [ h, t ] ->
                        h ++ "." ++ String.left 2 t

                    h :: _ ->
                        h
           )
        |> (\str ->
                W.Tooltip.view []
                    { tooltip = [ H.text "some contrast ratio" ]
                    , children =
                        [ W.Text.view
                            [ W.Text.extraSmall, W.Text.aux ]
                            [ H.text str ]
                        ]
                    }
           )


colorSelector : SolidColor.SolidColor -> (ThemeColor -> ThemeColorDetail -> Color.Color -> Msg) -> ( ThemeColor, Theme.ThemeColorSet, Theme.ThemeColorSetValues ) -> List (H.Html Msg) -> H.Html Msg
colorSelector baseBg msg ( themeColor, color_, color ) children =
    let
        bg : SolidColor.SolidColor
        bg =
            toSolidColor color_.background

        fg : SolidColor.SolidColor
        fg =
            toSolidColor color_.foreground

        aux : SolidColor.SolidColor
        aux =
            toSolidColor color_.aux
    in
    W.Container.view
        [ W.Container.node "section"
        , W.Container.vertical
        , W.Container.spaceBetween
        , W.Container.padX_4
        , W.Container.padY_8
        , W.Container.gap_4
        ]
        [ W.Container.view
            [ W.Container.fill ]
            [ W.Heading.view
                [ W.Heading.extraSmall, W.Heading.color (SolidColor.toHex fg) ]
                [ H.text (themeColorLabel themeColor) ]
            , H.div [] children
            ]
        , W.Container.view
            [ W.Container.horizontal
            , W.Container.gap_2
            , W.Container.pad_2
            , W.Container.card
            ]
            [ input fg baseBg (msg themeColor) Foreground
            , input bg aux (msg themeColor) Background
            , input aux bg (msg themeColor) Aux
            ]
        ]
