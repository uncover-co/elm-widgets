module W.InputAutocomplete exposing
    ( view
    , init, toString, toValue, Value
    , viewCustom, optionsHeader
    , disabled, readOnly, noFilter
    , placeholder, prefix, suffix
    , required
    , onEnter, onBlur, onFocus
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Value

@docs init, toString, toValue, Value


# Custom Rendering

@docs viewCustom, optionsHeader


# States

@docs disabled, readOnly, noFilter


# Styles

@docs placeholder, prefix, suffix


# Validation Attributes

@docs required


# Actions

@docs onEnter, onBlur, onFocus


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Array
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import W.Divider
import W.Internal.Helpers as WH
import W.Internal.Icons
import W.Internal.Input
import W.Loading
import W.Menu



-- Value


{-| -}
type Value a
    = Value (ValueData a)


type alias ValueData a =
    { input : String
    , value : Maybe a
    , highlighted : Int
    , focused : Bool
    , toString : a -> String
    }


{-| -}
toString : Value a -> String
toString (Value { input }) =
    input


toStringFn : Value a -> (a -> String)
toStringFn (Value data) =
    data.toString


{-| -}
toValue : Value a -> Maybe a
toValue (Value data) =
    data.value


{-| -}
init : { value : Maybe a, toString : a -> String } -> Value a
init props =
    Value
        { input = ""
        , value = props.value
        , highlighted = 0
        , focused = False
        , toString = props.toString
        }
        |> initInput


initInput : Value a -> Value a
initInput (Value data) =
    Value
        { data
            | input =
                data.value
                    |> Maybe.map data.toString
                    |> Maybe.withDefault ""
        }


updateInput : ValueData a -> String -> Value a
updateInput data input =
    Value
        { data
            | input = input
            , highlighted = 0
            , focused = True
        }


onSelect_ : Int -> a -> ValueData a -> Value a
onSelect_ index value data =
    Value
        { data
            | value = Just value
            , highlighted = index
            , focused = False
        }
        |> initInput


onFocus_ : Value a -> Value a
onFocus_ (Value data) =
    Value { data | focused = True }


onBlur_ : Value a -> Value a
onBlur_ (Value data) =
    Value { data | focused = False }
        |> initInput


updateHighlighted : (Int -> Int) -> ValueData a -> Value a
updateHighlighted fn data =
    if data.focused then
        Value { data | highlighted = fn data.highlighted }

    else
        Value { data | focused = True }



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
    , optionsHeader : Maybe (String -> H.Html msg)
    , noFilter : Bool
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
    , optionsHeader = Nothing
    , noFilter = False
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
optionsHeader : (String -> H.Html msg) -> Attribute msg
optionsHeader v =
    Attribute <| \attrs -> { attrs | optionsHeader = Just v }


{-| -}
noFilter : Attribute msg
noFilter =
    Attribute <| \attrs -> { attrs | noFilter = True }


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
    viewCustom attrs_
        { id = props.id
        , value = props.value
        , options = props.options
        , onInput = props.onInput
        , toHtml = H.text << toStringFn props.value
        }


{-| -}
viewCustom :
    List (Attribute msg)
    ->
        { id : String
        , value : Value a
        , options : Maybe (List a)
        , onInput : Value a -> msg
        , toHtml : a -> H.Html msg
        }
    -> H.Html msg
viewCustom attrs_ props =
    let
        valueData : ValueData a
        valueData =
            case props.value of
                Value v ->
                    v

        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        selectedAndUnchanged : Bool
        selectedAndUnchanged =
            valueData.value
                |> Maybe.map (\v -> valueData.toString v == valueData.input)
                |> Maybe.withDefault False

        options : List a
        options =
            if attrs.noFilter || selectedAndUnchanged then
                props.options
                    |> Maybe.withDefault []

            else
                let
                    lowerCaseInput : String
                    lowerCaseInput =
                        valueData.input
                in
                props.options
                    |> Maybe.withDefault []
                    |> List.filter (\o -> String.contains lowerCaseInput (String.toLower (valueData.toString o)))

        highlighted : Int
        highlighted =
            modBy (max (List.length options) 1) valueData.highlighted
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
               , HA.value valueData.input
               , WH.maybeAttr (HE.on "focusin") (attrs.onFocus |> Maybe.map D.succeed)
               , WH.maybeAttr (HE.on "focusout") (attrs.onBlur |> Maybe.map D.succeed)
               , HE.onFocus (props.onInput (onFocus_ props.value))
               , HE.onBlur (props.onInput (onBlur_ props.value))
               , HE.on "keydown"
                    (D.field "key" D.string
                        |> D.andThen
                            (\key ->
                                case key of
                                    "Enter" ->
                                        options
                                            |> Array.fromList
                                            |> Array.get highlighted
                                            |> Maybe.map
                                                (\value ->
                                                    onSelect_ highlighted value valueData
                                                        |> props.onInput
                                                        |> D.succeed
                                                )
                                            |> Maybe.withDefault
                                                (attrs.onEnter
                                                    |> Maybe.map (\msg -> D.succeed msg)
                                                    |> Maybe.withDefault (D.fail "ignored action")
                                                )

                                    "ArrowDown" ->
                                        valueData
                                            |> updateHighlighted ((+) 1)
                                            |> props.onInput
                                            |> D.succeed

                                    "ArrowUp" ->
                                        valueData
                                            |> updateHighlighted ((+) -1)
                                            |> props.onInput
                                            |> D.succeed

                                    _ ->
                                        D.fail "ignored key"
                            )
                    )
               , HE.on "input"
                    (D.at [ "target", "value" ] D.string
                        |> D.andThen
                            (\value ->
                                updateInput valueData value
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
                W.Loading.dots [ W.Loading.size 20 ]

             else
                W.Internal.Icons.chevronDown
            )
        |> (\x ->
                H.div [ HA.class "ew-relative ew-group" ]
                    [ x
                    , if valueData.focused then
                        H.div
                            [ HA.class "ew-hidden group-focus-within:ew-block"
                            , HA.class "ew-absolute ew-top-full ew-left-0 ew-right-0"
                            , HA.class "ew-shadow ew-z-10 ew-bg-base-bg"
                            ]
                            [ W.Menu.view
                                ((case attrs.optionsHeader of
                                    Just optionsHeader_ ->
                                        H.div []
                                            [ H.div [ HA.class "ew-p-3" ] [ optionsHeader_ valueData.input ]
                                            , W.Divider.view [] []
                                            ]

                                    Nothing ->
                                        H.text ""
                                 )
                                    :: (options
                                            |> List.indexedMap
                                                (\index value ->
                                                    W.Menu.viewButton
                                                        [ W.Menu.selected (valueData.highlighted == index)
                                                        ]
                                                        { label = [ props.toHtml value ]
                                                        , onClick =
                                                            onSelect_ index value valueData
                                                                |> props.onInput
                                                        }
                                                )
                                       )
                                )
                            ]

                      else
                        H.text ""
                    ]
           )
