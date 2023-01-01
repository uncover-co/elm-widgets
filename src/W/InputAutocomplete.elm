module W.InputAutocomplete exposing
    ( view
    , init, toString, toValue, Value
    , disabled, readOnly
    , placeholder, prefix, suffix
    , required
    , onEnter, onBlur, onFocus
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Value

@docs init, toString, toValue, Value


# States

@docs disabled, readOnly


# Styles

@docs placeholder, prefix, suffix


# Validation Attributes

@docs required


# Actions

@docs onEnter, onBlur, onFocus


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Dict
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import W.Internal.Helpers as WH
import W.Internal.Icons
import W.Internal.Input
import W.Loading



-- Value


{-| -}
type Value a
    = Value (ValueData a)


type alias ValueData a =
    { input : String
    , value : Maybe a
    , toString : a -> String
    }


{-| -}
init : { value : Maybe a, toString : a -> String } -> Value a
init props =
    Value
        { input = Maybe.map props.toString props.value |> Maybe.withDefault ""
        , value = props.value
        , toString = props.toString
        }


update : Value a -> String -> Maybe a -> Value a
update (Value data) input value =
    Value { data | input = input, value = value }


{-| -}
toString : Value a -> String
toString (Value { input }) =
    input


{-| -}
toValue : Value a -> Maybe a
toValue (Value { value }) =
    value



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { disabled : Bool
    , required : Bool
    , readOnly : Bool
    , placeholder : Maybe String
    , prefix : Maybe (List (H.Html msg))
    , suffix : Maybe (List (H.Html msg))
    , onFocus : Maybe msg
    , onBlur : Maybe msg
    , onEnter : Maybe msg
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { disabled = False
    , required = False
    , readOnly = False
    , placeholder = Nothing
    , prefix = Nothing
    , suffix = Nothing
    , onFocus = Nothing
    , onBlur = Nothing
    , onEnter = Nothing
    , htmlAttributes = []
    }



-- Attribute : Setters


{-| -}
placeholder : String -> Attribute msg
placeholder v =
    Attribute <| \attrs -> { attrs | placeholder = Just v }


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
readOnly : Bool -> Attribute msg
readOnly v =
    Attribute <| \attrs -> { attrs | readOnly = v }


{-| -}
required : Bool -> Attribute msg
required v =
    Attribute <| \attrs -> { attrs | required = v }


{-| -}
prefix : List (H.Html msg) -> Attribute msg
prefix v =
    Attribute <| \attrs -> { attrs | prefix = Just v }


{-| -}
suffix : List (H.Html msg) -> Attribute msg
suffix v =
    Attribute <| \attrs -> { attrs | suffix = Just v }


{-| -}
onBlur : msg -> Attribute msg
onBlur v =
    Attribute <| \attrs -> { attrs | onBlur = Just v }


{-| -}
onFocus : msg -> Attribute msg
onFocus v =
    Attribute <| \attrs -> { attrs | onFocus = Just v }


{-| -}
onEnter : msg -> Attribute msg
onEnter v =
    Attribute <| \attrs -> { attrs | onEnter = Just v }


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
        { id : String
        , value : Value a
        , options : Maybe (List a)
        , onInput : Value a -> msg
        }
    -> H.Html msg
view attrs_ props =
    let
        valueData : ValueData a
        valueData =
            case props.value of
                Value v ->
                    v

        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        options : List ( String, a )
        options =
            props.options
                |> Maybe.withDefault []
                |> List.map (\o -> ( valueData.toString o, o ))

        optionsDict : Dict.Dict String a
        optionsDict =
            Dict.fromList options
    in
    H.input
        (attrs.htmlAttributes
            ++ [ WH.maybeAttr HA.placeholder attrs.placeholder
               , HA.disabled (attrs.disabled || attrs.readOnly)
               , HA.readonly attrs.readOnly
               , WH.attrIf attrs.readOnly (HA.attribute "aria-readonly") "true"
               , WH.attrIf attrs.disabled (HA.attribute "aria-disabled") "true"
               , HA.required attrs.required
               , HA.autocomplete False
               , HA.id props.id
               , HA.class W.Internal.Input.baseClass
               , HA.class "ew-pr-10"
               , HA.list (props.id ++ "-list")
               , HA.value valueData.input
               , WH.maybeAttr HE.onFocus attrs.onFocus
               , WH.maybeAttr HE.onBlur attrs.onBlur
               , WH.maybeAttr WH.onEnter attrs.onEnter
               , HE.on "input"
                    (D.at [ "target", "value" ] D.string
                        |> D.andThen
                            (\value ->
                                Dict.get value optionsDict
                                    |> update props.value value
                                    |> props.onInput
                                    |> D.succeed
                            )
                    )
               ]
        )
        []
        |> W.Internal.Input.viewWithIcon
            { prefix = attrs.prefix
            , suffix = attrs.suffix
            , disabled = attrs.disabled
            , readOnly = attrs.readOnly
            , mask = Nothing
            , maskInput = ""
            }
            (if props.options == Nothing then
                W.Loading.circles [ W.Loading.size 28 ]

             else
                W.Internal.Icons.chevronDown
            )
        |> (\x ->
                H.div []
                    [ x
                    , H.datalist
                        [ HA.id (props.id ++ "-list") ]
                        (options
                            |> List.map
                                (\( label, _ ) ->
                                    H.option [ HA.value label ] []
                                )
                        )
                    ]
           )
