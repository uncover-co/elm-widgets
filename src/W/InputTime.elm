module W.InputTime exposing
    ( view
    , prefix, suffix
    , disabled, readOnly
    , required, min, max, step
    , viewWithValidation, errorToString, Error(..)
    , onEnter, onFocus, onBlur
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Styles

@docs prefix, suffix


# States

@docs disabled, readOnly


# Validation Attributes

@docs required, min, max, step


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
import Time
import Time.Extra
import W.Internal.Helpers as WH
import W.Internal.Icons
import W.Internal.Input



-- Error


{-| -}
type Error
    = TooLow Time.Posix String
    | TooHigh Time.Posix String
    | StepMismatch Int String
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

        StepMismatch _ message ->
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
    { disabled : Bool
    , readOnly : Bool
    , required : Bool
    , min : Maybe Time.Posix
    , max : Maybe Time.Posix
    , step : Maybe Int
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
step : Int -> Attribute msg
step v =
    Attribute <| \attrs -> { attrs | step = Just v }


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
        ++ [ HA.type_ "time"
           , HA.class W.Internal.Input.baseClass
           , HA.required attrs.required
           , HA.disabled attrs.disabled
           , HA.readonly attrs.readOnly
           , WH.attrIf attrs.readOnly (HA.attribute "aria-readonly") "true"
           , WH.attrIf attrs.disabled (HA.attribute "aria-disabled") "true"
           , WH.maybeAttr HA.min (Maybe.map (valueFromTime timeZone) attrs.min)
           , WH.maybeAttr HA.max (Maybe.map (valueFromTime timeZone) attrs.max)
           , WH.maybeAttr HA.step (Maybe.map String.fromInt attrs.step)
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
                |> Maybe.map (valueFromTime props.timeZone)
                |> Maybe.withDefault ""
    in
    H.input
        (HE.onInput (props.onInput << timeFromValue props.timeZone props.value)
            :: baseAttrs attrs props.timeZone value
        )
        []
        |> W.Internal.Input.viewWithIcon
            { prefix = attrs.prefix
            , suffix = attrs.suffix
            , readOnly = attrs.readOnly
            , disabled = attrs.disabled
            , mask = Nothing
            , maskInput = value
            }
            (W.Internal.Icons.clock { size = 24 })


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
                |> Maybe.map (valueFromTime props.timeZone)
                |> Maybe.withDefault ""
    in
    H.input
        (HE.on "input"
            (D.map6
                (\value_ valid rangeOverflow rangeUnderflow stepMismatch valueMissing ->
                    case timeFromValue props.timeZone props.value value_ of
                        Nothing ->
                            props.onInput
                                (Err <| List.singleton <| BadInput "Please enter a valid value.")
                                Nothing

                        Just time ->
                            if valid then
                                props.onInput (Ok time) (Just time)

                            else
                                let
                                    result : Result (List Error) Time.Posix
                                    result =
                                        [ Just (ValueMissing "Please fill out this field.")
                                            |> WH.keepIf valueMissing
                                        , attrs.min
                                            |> WH.keepIf rangeUnderflow
                                            |> Maybe.map
                                                (\min_ ->
                                                    let
                                                        timeString : String
                                                        timeString =
                                                            valueFromTime props.timeZone min_
                                                    in
                                                    TooLow time ("Value must be " ++ timeString ++ " or later.")
                                                )
                                        , attrs.max
                                            |> WH.keepIf rangeOverflow
                                            |> Maybe.map
                                                (\max_ ->
                                                    let
                                                        timeString : String
                                                        timeString =
                                                            valueFromTime props.timeZone max_
                                                    in
                                                    TooLow time ("Value must be " ++ timeString ++ " or later.")
                                                )
                                        , attrs.step
                                            |> WH.keepIf stepMismatch
                                            |> Maybe.map
                                                (\step_ ->
                                                    let
                                                        ( f, c ) =
                                                            nearestTimes props.timeZone time step_
                                                    in
                                                    StepMismatch
                                                        step_
                                                        ("Please enter a valid value. The two nearest valid values are " ++ f ++ " and " ++ c ++ ".")
                                                )
                                        ]
                                            |> List.filterMap identity
                                            |> Err
                                in
                                props.onInput result (Just time)
                )
                (D.at [ "target", "value" ] D.string)
                (D.at [ "target", "validity", "valid" ] D.bool)
                (D.at [ "target", "validity", "rangeOverflow" ] D.bool)
                (D.at [ "target", "validity", "rangeUnderflow" ] D.bool)
                (D.at [ "target", "validity", "stepMismatch" ] D.bool)
                (D.at [ "target", "validity", "valueMissing" ] D.bool)
            )
            :: baseAttrs attrs props.timeZone value
        )
        []
        |> W.Internal.Input.viewWithIcon
            { prefix = attrs.prefix
            , suffix = attrs.suffix
            , readOnly = attrs.readOnly
            , disabled = attrs.disabled
            , mask = Nothing
            , maskInput = value
            }
            (W.Internal.Icons.clock { size = 24 })



-- Helpers


valueFromTime : Time.Zone -> Time.Posix -> String
valueFromTime timeZone value =
    let
        hour : String
        hour =
            Time.toHour timeZone value
                |> String.fromInt
                |> String.padLeft 2 '0'

        minute : String
        minute =
            Time.toMinute timeZone value
                |> String.fromInt
                |> String.padLeft 2 '0'

        seconds : String
        seconds =
            Time.toSecond timeZone value
                |> String.fromInt
                |> String.padLeft 2 '0'
    in
    hour ++ ":" ++ minute ++ ":" ++ seconds


timeFromValue : Time.Zone -> Maybe Time.Posix -> String -> Maybe Time.Posix
timeFromValue timeZone currentValue value =
    let
        currentStartOfDay : Int
        currentStartOfDay =
            currentValue
                |> Maybe.map (Time.Extra.floor Time.Extra.Day timeZone)
                |> Maybe.map Time.posixToMillis
                |> Maybe.withDefault 0

        hours : String -> String -> Int
        hours h1 h2 =
            String.toInt (h1 ++ h2)
                |> Maybe.map ((*) (60 * 60 * 1000))
                |> Maybe.withDefault 0

        minutes : String -> String -> Int
        minutes m1 m2 =
            String.toInt (m1 ++ m2)
                |> Maybe.map ((*) (60 * 1000))
                |> Maybe.withDefault 0

        seconds : String -> String -> Int
        seconds s1 s2 =
            String.toInt (s1 ++ s2)
                |> Maybe.map ((*) 1000)
                |> Maybe.withDefault 0
    in
    case String.split "" value of
        h1 :: h2 :: ":" :: m1 :: m2 :: [] ->
            hours h1 h2
                + minutes m1 m2
                + currentStartOfDay
                |> Time.millisToPosix
                |> Just

        h1 :: h2 :: ":" :: m1 :: m2 :: ":" :: s1 :: s2 :: [] ->
            hours h1 h2
                + minutes m1 m2
                + seconds s1 s2
                + currentStartOfDay
                |> Time.millisToPosix
                |> Just

        _ ->
            Nothing


nearestTimes : Time.Zone -> Time.Posix -> Int -> ( String, String )
nearestTimes timeZone time step_ =
    let
        hoursInSeconds : Int
        hoursInSeconds =
            Time.toHour timeZone time * 60 * 60

        minutesInSeconds : Int
        minutesInSeconds =
            Time.toMinute timeZone time * 60

        seconds : Int
        seconds =
            Time.toSecond timeZone time + minutesInSeconds + hoursInSeconds
    in
    WH.nearestInts seconds step_
        |> Tuple.mapBoth valueFromSeconds valueFromSeconds


valueFromSeconds : Int -> String
valueFromSeconds seconds =
    let
        hours : Int
        hours =
            seconds // (60 * 60)

        minutes : Int
        minutes =
            (seconds - (hours * 60 * 60)) // 60

        seconds_ : Int
        seconds_ =
            seconds - (hours * 60 * 60) - (minutes * 60)

        hourString : String
        hourString =
            hours
                |> String.fromInt
                |> String.padLeft 2 '0'

        minuteString : String
        minuteString =
            minutes
                |> String.fromInt
                |> String.padLeft 2 '0'

        secondString : String
        secondString =
            seconds_
                |> String.fromInt
                |> String.padLeft 2 '0'
    in
    hourString ++ ":" ++ minuteString ++ ":" ++ secondString
