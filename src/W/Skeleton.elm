module W.Skeleton exposing
    ( view
    , width, height, relativeWidth, relativeHeight
    , circle, noAnimation
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Sizing

@docs width, height, relativeWidth, relativeHeight


# Styles

@docs circle, noAnimation


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


{-| Sets the height of the skeleton element in pixels.
-}
height : Int -> Attribute msg
height v =
    Attribute (\attrs -> { attrs | height = WH.formatPx v })


{-| Sets the width of the skeleton element in pixels.
-}
width : Int -> Attribute msg
width v =
    Attribute (\attrs -> { attrs | width = WH.formatPx v })


{-| Sets the height of the skeleton element as a percentage of its parent element.
-}
relativeHeight : Float -> Attribute msg
relativeHeight v =
    Attribute (\attrs -> { attrs | height = WH.formatPct v })


{-| Sets the width of the skeleton element as a percentage of its parent element.
-}
relativeWidth : Float -> Attribute msg
relativeWidth v =
    Attribute (\attrs -> { attrs | width = WH.formatPct v })


{-| Makes the skeleton element a circle with the specified size in pixels.
-}
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


{-| Disables the animation of the skeleton element.
-}
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

    -- skeleton with default size
    W.Skeleton.view [] []

    -- skeleton with custom size
    W.Skeleton.view [ W.Skeleton.width 100, W.Skeleton.height 100 ] []

    -- skeleton with custom size and no animation
    W.Skeleton.view [ W.Skeleton.width 100, W.Skeleton.height 100, W.Skeleton.noAnimation ] []

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
