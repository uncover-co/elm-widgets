module W.Button exposing
    ( view, viewLink, viewDummy
    , primary, secondary, success, warning, danger, theme, ButtonTheme
    , outlined, invisible, rounded, large, small, icon, full
    , disabled
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, viewLink, viewDummy


# Colors

By default, `neutral` color is used.

@docs primary, secondary, success, warning, danger, theme, ButtonTheme


# Styles

@docs outlined, invisible, rounded, large, small, icon, full


# State

@docs disabled


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Theme exposing (ThemeColorSetValues)



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { style : ButtonStyle
    , disabled : Bool
    , size : ButtonSize
    , rounded : Bool
    , width : ButtonWidth
    , theme : ButtonTheme
    , htmlAttributes : List (H.Attribute msg)
    }


type ButtonStyle
    = Basic
    | Outlined
    | Invisible


type ButtonSize
    = Small
    | Medium
    | Large


type ButtonWidth
    = Full
    | Icon
    | Base


{-| -}
type alias ButtonTheme =
    { foreground : String
    , background : String
    , aux : String
    }


toButtonTheme : ThemeColorSetValues -> ButtonTheme
toButtonTheme color =
    { foreground = color.foreground
    , background = color.background
    , aux = color.aux
    }


defaultAttrs : Attributes msg
defaultAttrs =
    { style = Basic
    , disabled = False
    , size = Medium
    , rounded = False
    , width = Base
    , theme = toButtonTheme Theme.neutral
    , htmlAttributes = []
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


styleAttrs : Attributes msg -> List (H.Attribute msg)
styleAttrs attrs =
    case attrs.style of
        Basic ->
            [ HA.style "color" attrs.theme.aux
            , HA.style "background" attrs.theme.background
            , HA.class "ew-border-0"
            , HA.class "before:ew-block before:ew-content-[''] before:ew-absolute before:ew-inset-0 before:ew-pointer-events-none"
            , HA.class "before:ew-z-0 before:ew-transition before:ew-duration-200 before:ew-bg-current before:ew-opacity-0"
            , HA.class "hover:before:ew-opacity-[0.07] active:before:ew-opacity-[0.15]"
            ]

        Outlined ->
            [ HA.style "color" attrs.theme.foreground
            , HA.style "border-color" attrs.theme.foreground
            , HA.style "background" Theme.baseBackground
            , HA.class "ew-border-solid ew-border-[3px]"
            , HA.class "before:ew-content-[''] before:ew-block before:ew-absolute before:ew-inset-0 before:ew-bg-current before:ew-opacity-0"
            , HA.class "hover:before:ew-opacity-10 active:before:ew-opacity-20 before:ew-transition before:ew-duration-200"
            ]

        Invisible ->
            [ HA.class "ew-relative ew-bg-transparent ew-border-0"
            , HA.class "before:ew-content-[''] before:ew-block before:ew-absolute before:ew-inset-0 before:ew-bg-current before:ew-opacity-0"
            , HA.class "hover:before:ew-opacity-10 active:before:ew-opacity-20 before:ew-transition before:ew-duration-200"
            , HA.style "color" attrs.theme.foreground
            ]


roundedAttrs : Attributes msg -> H.Attribute msg
roundedAttrs attrs =
    case ( attrs.rounded, attrs.size ) of
        ( False, _ ) ->
            HA.classList
                [ ( "ew-rounded-lg", True )
                , ( "before:ew-rounded-lg", attrs.style /= Outlined )
                , ( "before:ew-rounded", attrs.style == Outlined )
                ]

        ( True, Large ) ->
            HA.classList
                [ ( "ew-rounded-[20px]", True )
                , ( "before:ew-rounded-[20px]", attrs.style /= Outlined )
                , ( "before:ew-rounded-[18px]", attrs.style == Outlined )
                ]

        ( True, Medium ) ->
            HA.classList
                [ ( "ew-rounded-[20px]", True )
                , ( "before:ew-rounded-[20px]", attrs.style /= Outlined )
                , ( "before:ew-rounded-[18px]", attrs.style == Outlined )
                ]

        ( True, Small ) ->
            HA.classList
                [ ( "ew-rounded-[16px]", True )
                , ( "before:ew-rounded-[16px]", attrs.style /= Outlined )
                , ( "before:ew-rounded-[14px]", attrs.style == Outlined )
                ]



-- Main


attributes : List (Attribute msg) -> List (H.Attribute msg)
attributes attrs_ =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    attrs.htmlAttributes
        ++ styleAttrs attrs
        ++ [ HA.disabled attrs.disabled
           , roundedAttrs attrs
           , HA.class "ew-focusable ew-box-border"
           , HA.class "ew-relative ew-inline-flex ew-items-center ew-justify-center ew-m-0 ew-py-0"
           , HA.class "ew-font-text ew-font-semibold ew-leading-none ew-tracking-wider ew-no-underline"
           , HA.class "disabled:ew-pointer-events-none disabled:ew-opacity-60"
           , HA.classList
                [ ( "ew-h-[32px] ew-text-sm", attrs.size == Small )
                , ( "ew-h-[40px] ew-text-base", attrs.size == Medium )
                , ( "ew-h-[48px] ew-text-base", attrs.size == Large )
                , ( "ew-px-3", attrs.size == Small && attrs.width == Base )
                , ( "ew-px-5", attrs.size == Medium && attrs.width == Base )
                , ( "ew-px-6", attrs.size == Large && attrs.width == Base )
                , ( "ew-min-w-[32px] ew-px-1", attrs.size == Small && attrs.width == Icon )
                , ( "ew-min-w-[40px] ew-px-1", attrs.size == Medium && attrs.width == Icon )
                , ( "ew-min-w-[48px] ew-px-1", attrs.size == Large && attrs.width == Icon )
                , ( "ew-w-full", attrs.width == Full )
                ]
           ]


viewInner : List (H.Html msg) -> H.Html msg
viewInner =
    H.span
        [ HA.class "ew-relative ew-z-10 ew-flex-inline ew-items-center ew-justify-center ew-gap-2" ]


{-| -}
view :
    List (Attribute msg)
    ->
        { label : List (H.Html msg)
        , onClick : msg
        }
    -> H.Html msg
view attrs props =
    H.button
        (HE.onClick props.onClick :: attributes attrs)
        [ viewInner props.label ]


{-| -}
viewLink :
    List (Attribute msg)
    ->
        { label : List (H.Html msg)
        , href : String
        }
    -> H.Html msg
viewLink attrs props =
    H.a
        (HA.href props.href :: attributes attrs)
        [ viewInner props.label ]


{-| Useful for HTML/CSS-based triggers.

    W.Modal.viewToggle "toggle-on-click"
        [ W.Button.viewDummy []
            [ H.text "Open or close modal" ]
        ]

-}
viewDummy :
    List (Attribute msg)
    -> List (H.Html msg)
    -> H.Html msg
viewDummy attrs children =
    H.div (HA.tabindex 0 :: HA.class "ew-cursor-default" :: attributes attrs) [ viewInner children ]



-- Attributes


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
primary : Attribute msg
primary =
    Attribute <| \attrs -> { attrs | theme = toButtonTheme Theme.primary }


{-| -}
secondary : Attribute msg
secondary =
    Attribute <| \attrs -> { attrs | theme = toButtonTheme Theme.secondary }


{-| -}
success : Attribute msg
success =
    Attribute <| \attrs -> { attrs | theme = toButtonTheme Theme.success }


{-| -}
warning : Attribute msg
warning =
    Attribute <| \attrs -> { attrs | theme = toButtonTheme Theme.warning }


{-| -}
danger : Attribute msg
danger =
    Attribute <| \attrs -> { attrs | theme = toButtonTheme Theme.danger }


{-| -}
outlined : Attribute msg
outlined =
    Attribute <| \attrs -> { attrs | style = Outlined }


{-| -}
invisible : Attribute msg
invisible =
    Attribute <| \attrs -> { attrs | style = Invisible }


{-| -}
full : Attribute msg
full =
    Attribute <| \attrs -> { attrs | width = Full }


{-| -}
icon : Attribute msg
icon =
    Attribute <| \attrs -> { attrs | width = Icon }


{-| -}
rounded : Attribute msg
rounded =
    Attribute <| \attrs -> { attrs | rounded = True }


{-| -}
small : Attribute msg
small =
    Attribute <| \attrs -> { attrs | size = Small }


{-| -}
large : Attribute msg
large =
    Attribute <| \attrs -> { attrs | size = Large }


{-| -}
theme : ButtonTheme -> Attribute msg
theme v =
    Attribute <| \attrs -> { attrs | theme = v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity
