module W.Text exposing
    ( view
    , light, semibold, bold
    , inline, extraSmall, small, large, extraLarge, italic, strikethrough, underline
    , aux, color
    , alignLeft, alignRight, alignCenter
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Font Weight

@docs light, semibold, bold


# Styles

@docs inline, extraSmall, small, large, extraLarge, italic, strikethrough, underline


# Colors

@docs aux, color


# Alignment

@docs alignLeft, alignRight, alignCenter


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Theme
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { element : String
    , class : String
    , fontSize : String
    , textAlign : String
    , color : String
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { element = "p"
    , class = ""
    , fontSize = "ew-text-base"
    , textAlign = "ew-text-left"
    , color = Theme.baseForeground
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
inline : Attribute msg
inline =
    Attribute (\attrs -> { attrs | element = "span" })


{-| -}
aux : Attribute msg
aux =
    Attribute (\attrs -> { attrs | color = Theme.baseAux })


{-| -}
underline : Attribute msg
underline =
    addClass "ew-underline"


{-| -}
strikethrough : Attribute msg
strikethrough =
    addClass "ew-line-through"


{-| -}
italic : Attribute msg
italic =
    addClass "ew-italic"


{-| -}
light : Attribute msg
light =
    addClass "ew-font-light"


{-| -}
semibold : Attribute msg
semibold =
    addClass "ew-font-semibold"


{-| -}
bold : Attribute msg
bold =
    addClass "ew-font-bold"


{-| -}
extraSmall : Attribute msg
extraSmall =
    Attribute (\attrs -> { attrs | fontSize = "ew-text-xs" })


{-| -}
small : Attribute msg
small =
    Attribute (\attrs -> { attrs | fontSize = "ew-text-sm" })


{-| -}
large : Attribute msg
large =
    Attribute (\attrs -> { attrs | fontSize = "ew-text-xl" })


{-| -}
extraLarge : Attribute msg
extraLarge =
    Attribute (\attrs -> { attrs | fontSize = "ew-text-2xl" })


{-| -}
alignLeft : Attribute msg
alignLeft =
    Attribute (\attrs -> { attrs | textAlign = "ew-text-left" })


{-| -}
alignCenter : Attribute msg
alignCenter =
    Attribute (\attrs -> { attrs | textAlign = "ew-text-center" })


{-| -}
alignRight : Attribute msg
alignRight =
    Attribute (\attrs -> { attrs | textAlign = "ew-text-right" })


{-| -}
color : String -> Attribute msg
color v =
    Attribute (\attrs -> { attrs | color = v })


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute (\attrs -> { attrs | htmlAttributes = v })


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- Helpers


addClass : String -> Attribute msg
addClass class =
    Attribute (\attr -> { attr | class = attr.class ++ " " ++ class })



-- Main


{-| -}
view : List (Attribute msg) -> List (H.Html msg) -> H.Html msg
view attrs_ children =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.node attrs.element
        (attrs.htmlAttributes
            ++ [ HA.class "ew-font-text ew-m-0"
               , HA.class attrs.class
               , HA.class attrs.fontSize
               , HA.class attrs.textAlign
               , WH.styles
                    [ ( "color", attrs.color )
                    ]
               ]
        )
        children
