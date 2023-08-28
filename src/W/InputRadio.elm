module W.InputRadio exposing
    ( view
    , color, small
    , disabled, readOnly, vertical
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Styles

@docs color, small


# States

@docs disabled, readOnly, vertical


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
    , small : Bool
    , disabled : Bool
    , readOnly : Bool
    , vertical : Bool
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { color = "var(--theme-primary-bg)"
    , small = False
    , disabled = False
    , readOnly = False
    , vertical = False
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
color : String -> Attribute msg
color v =
    Attribute <| \attrs -> { attrs | color = v }


{-| -}
small : Attribute msg
small =
    Attribute <| \attrs -> { attrs | small = True }


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
readOnly : Bool -> Attribute msg
readOnly v =
    Attribute <| \attrs -> { attrs | readOnly = v }


{-| -}
vertical : Bool -> Attribute msg
vertical v =
    Attribute <| \attrs -> { attrs | vertical = v }


{-| **Important**: These attributes are applied to all `input[type="radio"]` elements.
-}
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
        { id : String
        , value : a
        , options : List a
        , toValue : a -> String
        , toLabel : a -> String
        , onInput : a -> msg
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.div
        [ HA.id props.id
        , HA.class "ew-flex"
        , HA.classList
            [ ( "ew-flex-col", attrs.vertical )
            , ( "ew-gap-6", not attrs.small || not attrs.vertical )
            , ( "ew-gap-4", attrs.small && attrs.vertical )
            ]
        ]
        (props.options
            |> List.map
                (\a ->
                    H.label
                        [ HA.name props.id
                        , HA.class "ew-inline-flex ew-items-center ew-p-0"
                        ]
                        [ H.input
                            (attrs.htmlAttributes
                                ++ [ HA.class "ew-radio ew-rounded-full before:ew-rounded-full"
                                   , HA.type_ "radio"
                                   , HA.name props.id
                                   , HA.value (props.toValue a)
                                   , HA.checked (a == props.value)
                                   , HA.classList [ ( "ew-small", attrs.small ) ]
                                   , Theme.stylesIf
                                        [ ( "color", attrs.color, not attrs.disabled )
                                        , ( "color", Theme.baseBackground, attrs.disabled )
                                        ]

                                   -- Fallback since read only is not respected for radio inputs
                                   , HA.disabled (attrs.disabled || attrs.readOnly)
                                   , HA.readonly attrs.readOnly

                                   --
                                   , HE.onCheck (\_ -> props.onInput a)
                                   ]
                            )
                            []
                        , H.span
                            [ HA.class "ew-font-text ew-text-base-fg ew-pl-3"
                            ]
                            [ H.text (props.toLabel a) ]
                        ]
                )
        )
