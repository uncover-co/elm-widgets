module W.InputNumber exposing
    ( view
    , min, max, step
    , id, class, placeholder, disabled, required, readOnly
    , onEnter, onFocus, onBlur
    , htmlAttrs, Attribute
    )

{-|

@docs view
@docs min, max, step
@docs id, class, placeholder, disabled, required, readOnly
@docs onEnter, onFocus, onBlur
@docs htmlAttrs, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
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
    , min : Maybe Float
    , max : Maybe Float
    , step : Maybe Float
    , placeholder : Maybe String
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
    , min = Nothing
    , max = Nothing
    , step = Nothing
    , placeholder = Nothing
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
min : Float -> Attribute msg
min v =
    Attribute <| \attrs -> { attrs | min = Just v }


{-| -}
max : Float -> Attribute msg
max v =
    Attribute <| \attrs -> { attrs | min = Just v }


{-| -}
step : Float -> Attribute msg
step v =
    Attribute <| \attrs -> { attrs | step = Just v }


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
        { value : String
        , onInput : String -> msg
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
            ++ [ HA.type_ "number"
               , WH.maybeAttr HA.id attrs.id
               , HA.class "ew ew-input ew-focusable"
               , HA.class attrs.class
               , HA.required attrs.required
               , HA.disabled attrs.disabled
               , HA.readonly attrs.readOnly
               , WH.maybeAttr HA.min (Maybe.map String.fromFloat attrs.min)
               , WH.maybeAttr HA.max (Maybe.map String.fromFloat attrs.max)
               , WH.maybeAttr HA.step (Maybe.map String.fromFloat attrs.step)
               , WH.maybeAttr HA.placeholder attrs.placeholder
               , WH.maybeAttr HE.onFocus attrs.onFocus
               , WH.maybeAttr HE.onBlur attrs.onBlur
               , WH.maybeAttr WH.onEnter attrs.onEnter
               , HA.value props.value
               , HE.onInput props.onInput
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
