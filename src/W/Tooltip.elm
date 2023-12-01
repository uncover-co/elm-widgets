module W.Tooltip exposing
    ( view
    , bottom, left, right
    , fast, slow, alwaysVisible
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Position

@docs bottom, left, right


# Styles

@docs fast, slow, alwaysVisible


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { position : Position
    , speed : Speed
    , alwaysVisible : Bool
    , htmlAttributes : List (H.Attribute msg)
    }


type Position
    = Top
    | Left
    | Bottom
    | Right


type Speed
    = Slow
    | Default
    | Fast


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { position = Top
    , speed = Default
    , alwaysVisible = False
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
bottom : Attribute msg
bottom =
    Attribute <| \attrs -> { attrs | position = Bottom }


{-| -}
left : Attribute msg
left =
    Attribute <| \attrs -> { attrs | position = Left }


{-| -}
right : Attribute msg
right =
    Attribute <| \attrs -> { attrs | position = Right }


{-| -}
slow : Attribute msg
slow =
    Attribute <| \attrs -> { attrs | speed = Slow }


{-| -}
fast : Attribute msg
fast =
    Attribute <| \attrs -> { attrs | speed = Fast }


{-| -}
alwaysVisible : Attribute msg
alwaysVisible =
    Attribute <| \attrs -> { attrs | alwaysVisible = True }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- Main


{-| -}
view :
    List (Attribute msg)
    ->
        { tooltip : List (H.Html msg)
        , children : List (H.Html msg)
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        posAttrs : List (H.Attribute msg)
        posAttrs =
            case attrs.position of
                Top ->
                    [ HA.class "ew-tooltip-top ew-bottom-full ew-mb-1"
                    , HA.class "group-hover:ew-translate-y-0"
                    , HA.classList [ ( "ew-translate-y-0.5", not attrs.alwaysVisible ) ]
                    ]

                Bottom ->
                    [ HA.class "ew-tooltip-bottom ew-top-full ew-mt-1"
                    , HA.class "group-hover:ew-translate-y-0"
                    , HA.classList [ ( "-ew-translate-y-0.5", not attrs.alwaysVisible ) ]
                    ]

                Left ->
                    [ HA.class "ew-tooltip-left ew-top-1/2 ew-right-full ew-mr-1"
                    , HA.class "-ew-translate-y-1/2 group-hover:ew-translate-x-0"
                    , HA.classList [ ( "ew-translate-x-0.5", not attrs.alwaysVisible ) ]
                    ]

                Right ->
                    [ HA.class "ew-tooltip-right ew-top-1/2 ew-left-full ew-ml-1"
                    , HA.class "-ew-translate-y-1/2 group-hover:ew-translate-x-0"
                    , HA.classList [ ( "-ew-translate-x-0.5", not attrs.alwaysVisible ) ]
                    ]

        tooltip : H.Html msg
        tooltip =
            H.span
                (attrs.htmlAttributes
                    ++ posAttrs
                    ++ [ HA.class "ew-tooltip ew-pointer-events-none"

                       -- TODO: Control z-index through CSS vars
                       , HA.class "ew-z-[9999] ew-absolute ew-px-2 ew-py-1"
                       , HA.class "ew-w-max ew-rounded"
                       , HA.class "ew-font-text ew-text-sm"
                       , HA.class "ew-bg-neutral-bg ew-text-neutral-aux"
                       , HA.class "ew-transition"
                       , HA.class "group-hover:ew-opacity-100"
                       , HA.classList [ ( "ew-opacity-0", not attrs.alwaysVisible ) ]
                       , case attrs.speed of
                            Fast ->
                                HA.class "group-hover:ew-delay-100"

                            Default ->
                                HA.class "group-hover:ew-delay-500"

                            Slow ->
                                HA.class "group-hover:ew-delay-1000"
                       ]
                )
                props.tooltip
    in
    H.span []
        [ H.span
            [ HA.class "ew-group ew-relative ew-inline-flex ew-flex-col ew-items-center" ]
            (tooltip :: props.children)
        ]
