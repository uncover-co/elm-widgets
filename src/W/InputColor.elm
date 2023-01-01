module W.InputColor exposing
    ( view, viewReadOnly
    , disabled, readOnly
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, viewReadOnly


# States

@docs disabled, readOnly


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Color
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Color



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { disabled : Bool
    , readOnly : Bool
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { disabled = False
    , readOnly = False
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
readOnly : Bool -> Attribute msg
readOnly v =
    Attribute <| \attrs -> { attrs | readOnly = v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- Main


baseAttrs : List (Attribute msg) -> Color.Color -> List (H.Attribute msg)
baseAttrs attrs_ value =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        hexColor : String
        hexColor =
            W.Internal.Color.toHex value
    in
    attrs.htmlAttributes
        ++ [ HA.class "ew-input-color ew-appearance-none"
           , HA.class "ew-shadow"
           , HA.class "ew-rounded-full ew-h-8 ew-w-8 ew-bg-white ew-border-0"
           , HA.class "before:ew-content-[''] before:ew-block"
           , HA.class "before:ew-bg-current before:ew-rounded-full"
           , HA.class "ew-relative before:ew-absolute before:ew-inset-1"
           , HA.style "color" hexColor
           , HA.type_ "color"
           , HA.value hexColor
           , HA.disabled (attrs.disabled || attrs.readOnly)
           , HA.readonly attrs.readOnly
           ]


{-| -}
view :
    List (Attribute msg)
    -> { value : Color.Color, onInput : Color.Color -> msg }
    -> H.Html msg
view attrs_ props =
    H.input
        (HE.onInput (props.onInput << W.Internal.Color.fromHex) :: baseAttrs attrs_ props.value)
        []


{-| -}
viewReadOnly :
    List (Attribute msg)
    -> Color.Color
    -> H.Html msg
viewReadOnly attrs_ value =
    H.input
        (baseAttrs (readOnly True :: attrs_) value)
        []
