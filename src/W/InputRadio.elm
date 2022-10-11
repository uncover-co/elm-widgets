module W.InputRadio exposing
    ( view
    , color, disabled, readOnly, vertical
    , Attribute
    )

{-|

@docs view
@docs color, disabled, readOnly, vertical
@docs Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes -> Attributes)


type alias Attributes =
    { color : String
    , disabled : Bool
    , readOnly : Bool
    , vertical : Bool
    }


applyAttrs : List (Attribute msg) -> Attributes
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes
defaultAttrs =
    { color = "var(--theme-primary-bg)"
    , disabled = False
    , readOnly = False
    , vertical = False
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
vertical : Bool -> Attribute msg
vertical v =
    Attribute <| \attrs -> { attrs | vertical = v }



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
        attrs : Attributes
        attrs =
            applyAttrs attrs_
    in
    H.div
        [ HA.id props.id
        , HA.class "ew ew-radio-buttons"
        , HA.classList
            [ ( "ew-m-vertical", attrs.vertical )
            , ( "ew-is-disabled", attrs.disabled && not attrs.readOnly )
            , ( "ew-is-read-only", attrs.readOnly )
            ]
        , WH.styles [ ( "--color", attrs.color ) ]
        ]
        (props.options
            |> List.map
                (\a ->
                    H.label
                        [ HA.name props.id
                        , HA.class "ew ew-radio-buttons--item"
                        ]
                        [ H.input
                            [ HA.class "ew ew-focusable ew-radio-buttons--item-input"
                            , HA.classList
                                [ ( "ew-is-disabled", attrs.disabled && not attrs.readOnly )
                                , ( "ew-is-read-only", attrs.readOnly )
                                ]
                            , HA.type_ "radio"
                            , HA.name props.id
                            , HA.value (props.toValue a)
                            , HA.checked (a == props.value)

                            -- Fallback since read only is not respected for radio inputs
                            , HA.disabled (attrs.disabled || attrs.readOnly)
                            , HA.readonly attrs.readOnly

                            --
                            , HE.onCheck (\_ -> props.onInput a)
                            ]
                            []
                        , H.span
                            [ HA.class "ew ew-radio-buttons--item-label"
                            ]
                            [ H.text (props.toLabel a) ]
                        ]
                )
        )
