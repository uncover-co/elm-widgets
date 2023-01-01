module W.InputCheckbox exposing
    ( view, viewReadOnly
    , color
    , disabled, readOnly
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, viewReadOnly


# Styles

@docs color


# States

@docs disabled, readOnly


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
    { color : String
    , disabled : Bool
    , readOnly : Bool
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { color = Theme.primaryBackground
    , disabled = False
    , readOnly = False
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
color : String -> Attribute msg
color v =
    Attribute <| \attrs -> { attrs | color = v }


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


baseAttrs : List (Attribute msg) -> Bool -> List (H.Attribute msg)
baseAttrs attrs_ value =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    attrs.htmlAttributes
        ++ [ HA.class "ew-check-radio ew-rounded before:ew-rounded-sm"
           , HA.style "color" attrs.color
           , HA.type_ "checkbox"
           , HA.checked value

           -- We also disable the checkbox plugin when it is readonly
           -- Since this property is not currently respected for checkboxes
           , HA.disabled (attrs.disabled || attrs.readOnly)
           , HA.readonly attrs.readOnly
           ]


{-| -}
view :
    List (Attribute msg)
    -> { value : Bool, onInput : Bool -> msg }
    -> H.Html msg
view attrs_ props =
    H.input
        (HE.onCheck props.onInput :: baseAttrs attrs_ props.value)
        []


{-| -}
viewReadOnly :
    List (Attribute msg)
    -> Bool
    -> H.Html msg
viewReadOnly attrs_ value =
    H.input
        (baseAttrs (readOnly True :: attrs_) value)
        []
