module W.Tag exposing
    ( view, viewButton, viewLink
    , small, primary, secondary, success, warning, danger, color
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, viewButton, viewLink


# Styles

@docs small, primary, secondary, success, warning, danger, color


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Theme



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { htmlAttributes : List (H.Attribute msg)
    , color : String
    , small : Bool
    , href : Maybe String
    , onClick : Maybe msg
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { htmlAttributes = []
    , color = Theme.neutralForeground
    , small = False
    , href = Nothing
    , onClick = Nothing
    }



-- Attributes : Setters


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity


{-| -}
small : Bool -> Attribute msg
small v =
    Attribute <| \attrs -> { attrs | small = v }


{-| -}
onClick : msg -> Attribute msg
onClick v =
    Attribute <| \attrs -> { attrs | onClick = Just v }


{-| -}
href : String -> Attribute msg
href v =
    Attribute <| \attrs -> { attrs | href = Just v }


{-| -}
color : String -> Attribute msg
color v =
    Attribute <| \attrs -> { attrs | color = v }


{-| -}
primary : Attribute msg
primary =
    Attribute <|
        \attrs ->
            { attrs
                | color = Theme.primaryForeground
            }


{-| -}
secondary : Attribute msg
secondary =
    Attribute <|
        \attrs ->
            { attrs
                | color = Theme.secondaryForeground
            }


{-| -}
success : Attribute msg
success =
    Attribute <|
        \attrs ->
            { attrs
                | color = Theme.successForeground
            }


{-| -}
warning : Attribute msg
warning =
    Attribute <|
        \attrs ->
            { attrs
                | color = Theme.warningForeground
            }


{-| -}
danger : Attribute msg
danger =
    Attribute <|
        \attrs ->
            { attrs
                | color = Theme.dangerForeground
            }



-- Main


{-| -}
viewButton : List (Attribute msg) -> { onClick : msg, label : List (H.Html msg) } -> H.Html msg
viewButton attrs_ props =
    view (onClick props.onClick :: attrs_) props.label


{-| -}
viewLink : List (Attribute msg) -> { href : String, label : List (H.Html msg) } -> H.Html msg
viewLink attrs_ props =
    view (href props.href :: attrs_) props.label


{-| -}
view :
    List (Attribute msg)
    -> List (H.Html msg)
    -> H.Html msg
view attrs_ children =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        baseAttrs : List (H.Attribute msg)
        baseAttrs =
            attrs.htmlAttributes
                ++ [ HA.class "ew-m-0 ew-box-border ew-relative ew-inline-flex ew-items-center ew-leading-none ew-font-text ew-font-medium ew-tracking-wider"
                   , HA.class "ew-rounded-full ew-border-solid ew-border-2 ew-border-current"
                   , HA.class "before:ew-content-[''] before:ew-absolute before:ew-inset-0 before:ew-rounded-full before:ew-bg-current before:ew-opacity-10"
                   , HA.style "color" attrs.color
                   , HA.classList
                        [ ( "ew-h-8 ew-px-3 ew-text-base", not attrs.small )
                        , ( "ew-h-7 ew-px-3 ew-text-sm", attrs.small )
                        ]
                   ]
    in
    case ( attrs.onClick, attrs.href ) of
        ( Just onClick_, _ ) ->
            H.button
                (baseAttrs ++ [ interactiveClass, HE.onClick onClick_ ])
                children

        ( Nothing, Just href_ ) ->
            H.a
                (baseAttrs ++ [ interactiveClass, HA.href href_ ])
                children

        _ ->
            H.span baseAttrs children


interactiveClass : H.Attribute msg
interactiveClass =
    HA.class
        ("ew-appearance-none ew-bg-transparent ew-no-underline hover:before:ew-opacity-[0.05] active:before:ew-opacity-[0.03]"
            ++ " ew-transition"
            ++ " ew-outline-0 ew-ring-offset-0 ew-ring-primary-fg/50"
            ++ " focus-visible:ew-bg-base-bg focus-visible:ew-ring focus-visible:ew-border-primary-fg"
        )
