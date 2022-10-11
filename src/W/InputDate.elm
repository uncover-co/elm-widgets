module W.InputDate exposing
    ( view
    , min, max, timeZone
    , id, class, disabled, required, readOnly
    , onEnter, onFocus, onBlur
    , htmlAttrs, Attribute
    )

{-|

@docs view
@docs min, max, timeZone
@docs id, class, disabled, required, readOnly
@docs onEnter, onFocus, onBlur
@docs htmlAttrs, Attribute

-}

import Date
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import Time
import Time.Extra
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { id : Maybe String
    , class : String
    , disabled : Bool
    , readOnly : Bool
    , required : Bool
    , timeZone : Time.Zone
    , min : Maybe Time.Posix
    , max : Maybe Time.Posix
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
    { id = Nothing
    , class = ""
    , disabled = False
    , readOnly = False
    , required = False
    , timeZone = Time.utc
    , min = Nothing
    , max = Nothing
    , onFocus = Nothing
    , onBlur = Nothing
    , onEnter = Nothing
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
class : String -> Attribute msg
class v =
    Attribute <| \attrs -> { attrs | class = v }


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
timeZone : Time.Zone -> Attribute msg
timeZone v =
    Attribute <| \attrs -> { attrs | timeZone = v }


{-| -}
min : Time.Posix -> Attribute msg
min v =
    Attribute <| \attrs -> { attrs | min = Just v }


{-| -}
max : Time.Posix -> Attribute msg
max v =
    Attribute <| \attrs -> { attrs | min = Just v }


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



-- Main


{-| -}
view :
    List (Attribute msg)
    ->
        { onInput : Maybe Time.Posix -> msg
        , value : Maybe Time.Posix
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.input
        (attrs.htmlAttributes
            ++ [ WH.maybeAttr HA.id attrs.id
               , HA.type_ "date"
               , HA.class "ew ew-input ew-focusable"
               , HA.class attrs.class
               , HA.required attrs.required
               , HA.disabled attrs.disabled
               , HA.readonly attrs.readOnly
               , WH.maybeAttr HE.onFocus attrs.onFocus
               , WH.maybeAttr HE.onBlur attrs.onBlur
               , WH.maybeAttr WH.onEnter attrs.onEnter
               , props.value
                    |> Maybe.map
                        (\timestamp ->
                            timestamp
                                |> Date.fromPosix attrs.timeZone
                                |> Date.format "yyyy-MM-dd"
                        )
                    |> Maybe.withDefault ""
                    |> HA.value
               , HE.on "input"
                    (D.field "target" (D.field "valueAsNumber" D.float)
                        |> D.andThen
                            (\v ->
                                if isNaN v then
                                    D.succeed (props.onInput Nothing)

                                else
                                    let
                                        notAdjusted : Time.Posix
                                        notAdjusted =
                                            Time.millisToPosix (floor v)

                                        timezoneAdjusted : Int
                                        timezoneAdjusted =
                                            floor v - (Time.Extra.toOffset attrs.timeZone notAdjusted * 60 * 1000)

                                        timeOfDayOffset : Int
                                        timeOfDayOffset =
                                            props.value
                                                |> Maybe.map
                                                    (\userValue ->
                                                        Time.Extra.diff Time.Extra.Millisecond
                                                            attrs.timeZone
                                                            (Time.Extra.floor Time.Extra.Day attrs.timeZone userValue)
                                                            userValue
                                                    )
                                                |> Maybe.withDefault 0
                                    in
                                    Just (Time.millisToPosix (timezoneAdjusted + timeOfDayOffset))
                                        |> props.onInput
                                        |> D.succeed
                            )
                    )
               ]
        )
        []



-- validationMessage
-- validity.badInput
-- validity.customError
-- validity.patternMismatch
-- validity.rangeOverflow
-- validity.rangeUnderflow
-- validity.stepMismatch
-- validity.tooLong
-- validity.tooShort
-- validity.typeMismatch
-- validity.valid
-- validity.valueMissing
