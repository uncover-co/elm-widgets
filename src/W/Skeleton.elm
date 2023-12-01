module W.Skeleton exposing
    ( view
    , width, height, relativeWidth, relativeHeight
    , circle
    , htmlAttrs, noAttr, Attribute
    , noAnimation
    )

{-|

@docs view


# Sizing

@docs width, height, relativeWidth, relativeHeight


# Styles

@docs circle


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { borderRadius : String
    , height : String
    , width : String
    , useAnimation : Bool
    , htmlAttributes : List (H.Attribute msg)
    }


defaultAttrs : Attributes msg
defaultAttrs =
    { borderRadius = "4px"
    , height = "16px"
    , width = "auto"
    , useAnimation = True
    , htmlAttributes = []
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs



-- Attributes : Setters


{-| -}
height : Int -> Attribute msg
height v =
    Attribute (\attrs -> { attrs | height = WH.formatPx v })


{-| -}
width : Int -> Attribute msg
width v =
    Attribute (\attrs -> { attrs | width = WH.formatPx v })


{-| -}
relativeHeight : Float -> Attribute msg
relativeHeight v =
    Attribute (\attrs -> { attrs | height = WH.formatPct v })


{-| -}
relativeWidth : Float -> Attribute msg
relativeWidth v =
    Attribute (\attrs -> { attrs | width = WH.formatPct v })


{-| -}
circle : Int -> Attribute msg
circle size =
    Attribute
        (\attrs ->
            { attrs
                | borderRadius = "100%"
                , width = WH.formatPx size
                , height = WH.formatPx size
            }
        )


{-| -}
noAnimation : Attribute msg
noAnimation =
    Attribute (\attrs -> { attrs | useAnimation = False })


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute (\attrs -> { attrs | htmlAttributes = v })


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- Main


{-|

    -- horizontal divider
    W.Divider.view [] []

    -- horizontal divider with a centralized label
    W.Dividier.view [] [ H.text "divide, not conquer" ]

-}
view : List (Attribute msg) -> H.Html msg
view attrs_ =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.div
        (attrs.htmlAttributes
            ++ [ HA.style "border-radius" attrs.borderRadius
               , HA.style "width" attrs.width
               , HA.style "height" attrs.height
               , HA.class "ew-bg-base-aux/30"
               , HA.classList [ ( "ew-animate-pulse", attrs.useAnimation ) ]
               ]
        )
        []
