module W.InputInt exposing
    ( view
    , init, toInt, toString, Value
    , placeholder, mask, prefix, suffix
    , disabled, readOnly
    , required, min, max, step, validation
    , viewWithValidation, errorToString, Error(..)
    , onEnter, onFocus, onBlur
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Value

@docs init, toInt, toString, Value


# Styles

@docs placeholder, mask, prefix, suffix


# States

@docs disabled, readOnly


# Validation Attributes

@docs required, min, max, step, validation


# View With Validation

@docs viewWithValidation, errorToString, Error


# Actions

@docs onEnter, onFocus, onBlur


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import W.Internal.Helpers as WH
import W.Internal.Input



-- Value


{-| -}
type Value
    = Value String Int


{-| -}
init : Maybe Int -> Value
init value =
    case value of
        Just v ->
            Value (String.fromInt v) v

        Nothing ->
            Value "" 0


{-| -}
toInt : Value -> Int
toInt (Value _ v) =
    v


{-| -}
toString : Value -> String
toString (Value v _) =
    v



-- Errors


{-| -}
type Error
    = TooLow Int String
    | TooHigh Int String
    | StepMismatch Int String
    | ValueMissing String
    | Custom String


{-| -}
errorToString : Error -> String
errorToString error =
    case error of
        TooLow _ message ->
            message

        TooHigh _ message ->
            message

        StepMismatch _ message ->
            message

        ValueMissing message ->
            message

        Custom message ->
            message



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { disabled : Bool
    , readOnly : Bool
    , required : Bool
    , min : Maybe Int
    , max : Maybe Int
    , step : Maybe Int
    , validation : Maybe (Int -> String -> Maybe String)
    , placeholder : Maybe String
    , mask : Maybe (String -> String)
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
    , readOnly = False
    , required = False
    , min = Nothing
    , max = Nothing
    , step = Nothing
    , placeholder = Nothing
    , validation = Nothing
    , mask = Nothing
    , prefix = Nothing
    , suffix = Nothing
    , onFocus = Nothing
    , onBlur = Nothing
    , onEnter = Nothing
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
placeholder : String -> Attribute msg
placeholder v =
    Attribute <| \attrs -> { attrs | placeholder = Just v }


{-| -}
mask : (String -> String) -> Attribute msg
mask v =
    Attribute <| \attrs -> { attrs | mask = Just v }


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
min : Int -> Attribute msg
min v =
    Attribute <| \attrs -> { attrs | min = Just v }


{-| -}
max : Int -> Attribute msg
max v =
    Attribute <| \attrs -> { attrs | max = Just v }


{-| -}
step : Int -> Attribute msg
step v =
    Attribute <| \attrs -> { attrs | step = Just v }


{-| -}
validation : (Int -> String -> Maybe String) -> Attribute msg
validation v =
    Attribute <| \attrs -> { attrs | validation = Just v }


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
baseAttrs : Attributes msg -> List (H.Attribute msg)
baseAttrs attrs =
    attrs.htmlAttributes
        ++ [ HA.type_ "number"
           , HA.step "1"
           , HA.class W.Internal.Input.baseClass
           , HA.required attrs.required
           , HA.disabled attrs.disabled
           , HA.readonly attrs.readOnly
           , WH.attrIf attrs.readOnly (HA.attribute "aria-readonly") "true"
           , WH.attrIf attrs.disabled (HA.attribute "aria-disabled") "true"
           , WH.maybeAttr HA.placeholder attrs.placeholder
           , WH.maybeAttr HA.min (Maybe.map String.fromInt attrs.min)
           , WH.maybeAttr HA.max (Maybe.map String.fromInt attrs.max)
           , WH.maybeAttr HA.step (Maybe.map String.fromInt attrs.step)
           , WH.maybeAttr HE.onFocus attrs.onFocus
           , WH.maybeAttr HE.onBlur attrs.onBlur
           , WH.maybeAttr WH.onEnter attrs.onEnter
           ]


{-| -}
view :
    List (Attribute msg)
    ->
        { value : Value
        , onInput : Value -> msg
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        value : String
        value =
            toString props.value
    in
    W.Internal.Input.view
        { disabled = attrs.disabled
        , readOnly = attrs.readOnly
        , prefix = attrs.prefix
        , suffix = attrs.suffix
        , mask = attrs.mask
        , maskInput = value
        }
        (H.input
            (baseAttrs attrs
                ++ [ HA.value value
                   , HE.on "input"
                        (D.at [ "target", "value" ] D.string
                            |> D.map (props.onInput << toValue)
                        )
                   ]
            )
            []
        )


{-| -}
viewWithValidation :
    List (Attribute msg)
    ->
        { value : Value
        , onInput : Result (List Error) Int -> Value -> msg
        }
    -> H.Html msg
viewWithValidation attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        value : String
        value =
            toString props.value
    in
    W.Internal.Input.view
        { disabled = attrs.disabled
        , readOnly = attrs.readOnly
        , prefix = attrs.prefix
        , suffix = attrs.suffix
        , mask = attrs.mask
        , maskInput = value
        }
        (H.input
            (baseAttrs attrs
                ++ [ HA.value value
                   , HE.on "input"
                        (D.map6
                            (\value_ valid rangeOverflow rangeUnderflow stepMismatch valueMissing ->
                                let
                                    value__ : Value
                                    value__ =
                                        toValue value_

                                    customError : Maybe Error
                                    customError =
                                        attrs.validation
                                            |> Maybe.andThen (\fn -> fn (toInt value__) value_)
                                            |> Maybe.map Custom

                                    result : Result (List Error) Int
                                    result =
                                        if valid && customError == Nothing then
                                            Ok (toInt value__)

                                        else
                                            [ Just (ValueMissing "Please fill out this field.")
                                                |> WH.keepIf valueMissing
                                            , attrs.min
                                                |> WH.keepIf rangeOverflow
                                                |> Maybe.map
                                                    (\min_ ->
                                                        TooLow min_ ("Value must be greater than or equal to " ++ String.fromInt min_)
                                                    )
                                            , attrs.max
                                                |> WH.keepIf rangeUnderflow
                                                |> Maybe.map
                                                    (\max_ ->
                                                        TooHigh max_ ("Value must be less than or equal to " ++ String.fromInt max_)
                                                    )
                                            , attrs.step
                                                |> WH.keepIf stepMismatch
                                                |> Maybe.map
                                                    (\step_ ->
                                                        let
                                                            ( f, c ) =
                                                                WH.nearestInts (toInt value__) step_
                                                                    |> Tuple.mapBoth String.fromInt String.fromInt
                                                        in
                                                        StepMismatch step_
                                                            ("Please enter a valid value. The two nearest valid values are " ++ f ++ " and " ++ c)
                                                    )
                                            , customError
                                            ]
                                                |> List.filterMap identity
                                                |> Err
                                in
                                props.onInput result value__
                            )
                            (D.at [ "target", "value" ] D.string)
                            (D.at [ "target", "validity", "valid" ] D.bool)
                            (D.at [ "target", "validity", "rangeOverflow" ] D.bool)
                            (D.at [ "target", "validity", "rangeUnderflow" ] D.bool)
                            (D.at [ "target", "validity", "stepMismatch" ] D.bool)
                            (D.at [ "target", "validity", "valueMissing" ] D.bool)
                        )
                   ]
            )
            []
        )


toValue : String -> Value
toValue value_ =
    case String.toInt value_ of
        Just v ->
            Value value_ v

        Nothing ->
            let
                parsedString : String
                parsedString =
                    value_
                        |> String.filter Char.isDigit

                parsedValue : Int
                parsedValue =
                    String.toInt parsedString
                        |> Maybe.withDefault 0
            in
            Value parsedString parsedValue
