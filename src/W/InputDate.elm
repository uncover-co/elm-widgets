module W.InputDate exposing
    ( view
    , disabled, readOnly
    , prefix, suffix
    , min, max, required
    , viewWithValidation, errorToString, Error(..)
    , onEnter, onFocus, onBlur
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# States

@docs disabled, readOnly


# Styles

@docs prefix, suffix


# Validation Attributes

@docs min, max, required


# View & Validation

@docs viewWithValidation, errorToString, Error


# Actions

@docs onEnter, onFocus, onBlur


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Date
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import Time
import Time.Extra
import W.Internal.Helpers as WH
import W.Internal.Icons
import W.Internal.Input



-- Error
-- Why is 'StepMismatch' missing? The actual browser behavior seems a bit odd.
-- It behaves differently based on the `min` property
-- and if `min` is not specified it steps from the the unix 0 timestamp?


{-| -}
type Error
    = TooLow Time.Posix String
    | TooHigh Time.Posix String
    | ValueMissing String
    | BadInput String


{-| -}
errorToString : Error -> String
errorToString error =
    case error of
        TooLow _ message ->
            message

        TooHigh _ message ->
            message

        ValueMissing message ->
            message

        BadInput message ->
            message



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { class : String
    , disabled : Bool
    , readOnly : Bool
    , required : Bool
    , min : Maybe Time.Posix
    , max : Maybe Time.Posix
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
    { class = ""
    , disabled = False
    , readOnly = False
    , required = False
    , min = Nothing
    , max = Nothing
    , prefix = Nothing
    , suffix = Nothing
    , onFocus = Nothing
    , onBlur = Nothing
    , onEnter = Nothing
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
required : Bool -> Attribute msg
required v =
    Attribute <| \attrs -> { attrs | required = v }


{-| -}
min : Time.Posix -> Attribute msg
min v =
    Attribute <| \attrs -> { attrs | min = Just v }


{-| -}
max : Time.Posix -> Attribute msg
max v =
    Attribute <| \attrs -> { attrs | max = Just v }


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


baseAttrs : Attributes msg -> Time.Zone -> String -> List (H.Attribute msg)
baseAttrs attrs timeZone value =
    attrs.htmlAttributes
        ++ [ HA.type_ "date"
           , HA.class W.Internal.Input.baseClass
           , HA.required attrs.required
           , HA.disabled attrs.disabled
           , HA.readonly attrs.readOnly
           , WH.attrIf attrs.readOnly (HA.attribute "aria-readonly") "true"
           , WH.attrIf attrs.disabled (HA.attribute "aria-disabled") "true"
           , WH.maybeAttr HA.min (Maybe.map (valueFromDate timeZone) attrs.min)
           , WH.maybeAttr HA.max (Maybe.map (valueFromDate timeZone) attrs.max)
           , WH.maybeAttr HE.onFocus attrs.onFocus
           , WH.maybeAttr HE.onBlur attrs.onBlur
           , WH.maybeAttr WH.onEnter attrs.onEnter
           , HA.value value
           ]


{-| -}
view :
    List (Attribute msg)
    ->
        { timeZone : Time.Zone
        , value : Maybe Time.Posix
        , onInput : Maybe Time.Posix -> msg
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        value : String
        value =
            props.value
                |> Maybe.map (valueFromDate props.timeZone)
                |> Maybe.withDefault ""
    in
    H.input
        (HE.on "input"
            (D.at [ "target", "valueAsNumber" ] D.float
                |> D.andThen
                    (\v ->
                        dateFromValue props.timeZone props.value v
                            |> props.onInput
                            |> D.succeed
                    )
            )
            :: baseAttrs attrs props.timeZone value
        )
        []
        |> W.Internal.Input.viewWithIcon
            { prefix = attrs.prefix
            , suffix = attrs.suffix
            , disabled = attrs.disabled
            , readOnly = attrs.readOnly
            , mask = Nothing
            , maskInput = value
            }
            (W.Internal.Icons.calendar { size = 24 })


{-| -}
viewWithValidation :
    List (Attribute msg)
    ->
        { timeZone : Time.Zone
        , value : Maybe Time.Posix
        , onInput : Result (List Error) Time.Posix -> Maybe Time.Posix -> msg
        }
    -> H.Html msg
viewWithValidation attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        value : String
        value =
            props.value
                |> Maybe.map (valueFromDate props.timeZone)
                |> Maybe.withDefault ""
    in
    H.input
        (HE.on "input"
            (D.map5
                (\value_ valid rangeOverflow rangeUnderflow valueMissing ->
                    case dateFromValue props.timeZone props.value value_ of
                        Nothing ->
                            props.onInput
                                (Err <| List.singleton <| BadInput "Please enter a valid value.")
                                Nothing

                        Just time ->
                            let
                                result : Result (List Error) Time.Posix
                                result =
                                    if valid then
                                        Ok time

                                    else
                                        [ Just (ValueMissing "Please fill out this field.")
                                            |> WH.keepIf valueMissing
                                        , attrs.min
                                            |> WH.keepIf rangeUnderflow
                                            |> Maybe.map
                                                (\min_ ->
                                                    let
                                                        timeString : String
                                                        timeString =
                                                            valueFromDate props.timeZone min_
                                                    in
                                                    TooLow min_ ("Value must be " ++ timeString ++ " or later.")
                                                )
                                        , attrs.max
                                            |> WH.keepIf rangeOverflow
                                            |> Maybe.map
                                                (\max_ ->
                                                    let
                                                        timeString : String
                                                        timeString =
                                                            valueFromDate props.timeZone max_
                                                    in
                                                    TooHigh max_ ("Value must be " ++ timeString ++ " or earlier.")
                                                )
                                        ]
                                            |> List.filterMap identity
                                            |> Err
                            in
                            props.onInput result (Just time)
                )
                (D.at [ "target", "valueAsNumber" ] D.float)
                (D.at [ "target", "validity", "valid" ] D.bool)
                (D.at [ "target", "validity", "rangeOverflow" ] D.bool)
                (D.at [ "target", "validity", "rangeUnderflow" ] D.bool)
                (D.at [ "target", "validity", "valueMissing" ] D.bool)
            )
            :: baseAttrs attrs props.timeZone value
        )
        []
        |> W.Internal.Input.viewWithIcon
            { prefix = attrs.prefix
            , suffix = attrs.suffix
            , disabled = attrs.disabled
            , readOnly = attrs.readOnly
            , mask = Nothing
            , maskInput = value
            }
            (W.Internal.Icons.calendar { size = 24 })



-- Helpers


valueFromDate : Time.Zone -> Time.Posix -> String
valueFromDate timeZone timestamp =
    timestamp
        |> Date.fromPosix timeZone
        |> Date.format "yyyy-MM-dd"


dateFromValue : Time.Zone -> Maybe Time.Posix -> Float -> Maybe Time.Posix
dateFromValue timeZone currentValue value =
    if isNaN value then
        Nothing

    else
        let
            notAdjusted : Time.Posix
            notAdjusted =
                Time.millisToPosix (floor value)

            timezoneAdjusted : Int
            timezoneAdjusted =
                floor value - (Time.Extra.toOffset timeZone notAdjusted * 60 * 1000)

            timeOfDayOffset : Int
            timeOfDayOffset =
                currentValue
                    |> Maybe.map
                        (\userValue ->
                            Time.Extra.diff Time.Extra.Millisecond
                                timeZone
                                (Time.Extra.floor Time.Extra.Day timeZone userValue)
                                userValue
                        )
                    |> Maybe.withDefault 0
        in
        Just (Time.millisToPosix (timezoneAdjusted + timeOfDayOffset))
