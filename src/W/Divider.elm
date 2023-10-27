module W.Divider exposing
    ( view
    , vertical, margins, light, color
    , noAttr, Attribute
    )

{-|

@docs view


# Styles

@docs vertical, margins, light, color


# Html

@docs noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Theme



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes -> Attributes)


type alias Attributes =
    { color : String
    , vertical : Bool
    , margins : Int
    }


defaultAttrs : Attributes
defaultAttrs =
    { color = Theme.baseAuxWithAlpha 0.2
    , vertical = False
    , margins = 0
    }


applyAttrs : List (Attribute msg) -> Attributes
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs



-- Attributes : Setters


{-| -}
light : Attribute msg
light =
    Attribute (\attrs -> { attrs | color = Theme.baseAuxWithAlpha 0.07 })


{-| -}
color : String -> Attribute msg
color v =
    Attribute (\attrs -> { attrs | color = v })


{-| -}
vertical : Attribute msg
vertical =
    Attribute (\attrs -> { attrs | vertical = True })


{-| -}
margins : Int -> Attribute msg
margins v =
    Attribute (\attrs -> { attrs | margins = v })


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
view : List (Attribute msg) -> List (H.Html msg) -> H.Html msg
view attrs_ children =
    let
        attrs : Attributes
        attrs =
            applyAttrs attrs_
    in
    if List.isEmpty children then
        H.hr
            [ HA.class "ew-self-stretch ew-border-solid ew-border-0 ew-m-0 ew-outline-0 ew-shadow-none ew-appearance-none"
            , HA.classList
                [ ( "ew-border-t-2", not attrs.vertical )
                , ( "ew-border-l-2", attrs.vertical )
                ]
            , Theme.stylesIf
                [ ( "border-color", attrs.color, True )
                , ( "margin", "0 " ++ String.fromInt attrs.margins ++ "px", attrs.vertical )
                , ( "margin", String.fromInt attrs.margins ++ "px 0", not attrs.vertical )
                ]
            ]
            []

    else
        H.div
            [ HA.class "ew-self-stretch ew-flex ew-items-center ew-justify-center ew-gap-1.5 ew-leading-none"
            , HA.class "ew-font-text ew-text-sm"
            , HA.class "before:ew-content-[''] before:ew-block before:ew-grow"
            , HA.class "after:ew-content-[''] after:ew-block after:ew-grow"
            , HA.class "before:ew-bg-current after:ew-bg-current"
            , HA.classList
                [ ( "before:ew-h-0.5 after:ew-h-0.5", not attrs.vertical )
                , ( "ew-flex-col before:ew-w-0.5 after:ew-w-0.5", attrs.vertical )
                ]
            , Theme.stylesIf
                [ ( "color", attrs.color, True )
                , ( "width", String.fromInt (attrs.margins * 2 + 2) ++ "px", attrs.vertical )
                , ( "height", String.fromInt (attrs.margins * 2 + 2) ++ "px", not attrs.vertical )
                ]
            ]
            [ H.span
                [ HA.class "ew-text-base-fg" ]
                children
            ]
