module W.Tooltip exposing
    ( view
    , fast, slow, alwaysVisible
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


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
    { htmlAttributes : List (H.Attribute msg)
    , speed : Speed
    , alwaysVisible : Bool
    }


type Speed
    = Slow
    | Default
    | Fast


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { htmlAttributes = []
    , speed = Default
    , alwaysVisible = False
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

        tooltip : H.Html msg
        tooltip =
            H.span
                (attrs.htmlAttributes
                    ++ [ HA.class "ew-tooltip ew-pointer-events-none"
                       , HA.class "ew-absolute ew-bottom-full ew-mb-1 ew-px-2 ew-py-1"
                       , HA.class "ew-w-max ew-rounded"
                       , HA.class "ew-font-text ew-text-sm"
                       , HA.class "ew-bg-neutral-bg ew-text-neutral-aux"
                       , HA.class "ew-transition"
                       , HA.class "group-hover:ew-translate-y-0 group-hover:ew-opacity-100"
                       , HA.classList [ ( "ew-translate-y-0.5 ew-opacity-0", not attrs.alwaysVisible ) ]
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
