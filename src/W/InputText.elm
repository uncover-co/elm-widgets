module W.InputText exposing
    ( view
    , email, password, search, telephone, url, numeric, decimal
    , placeholder, mask, prefix, suffix
    , disabled, readOnly
    , onEnter, onFocus, onBlur
    , required, minLength, maxLength, exactLength, pattern, validation
    , viewWithValidation, errorToString, Error(..)
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Types

@docs email, password, search, telephone, url, numeric, decimal


# Styles

@docs placeholder, mask, prefix, suffix


# States

@docs disabled, readOnly


# Actions

@docs onEnter, onFocus, onBlur


# Validation Attributes

@docs required, minLength, maxLength, exactLength, pattern, validation


# View With Validation

@docs viewWithValidation, errorToString, Error


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import W.Internal.Helpers as WH
import W.Internal.Input



-- Attributes


{-| -}
type InputType
    = Text
    | Telephone
    | Password
    | Search
    | Email
    | Url
    | Numeric
    | Decimal


inputInputTypeToString : InputType -> String
inputInputTypeToString t =
    case t of
        Text ->
            "text"

        Telephone ->
            "tel"

        Password ->
            "password"

        Search ->
            "search"

        Email ->
            "email"

        Url ->
            "url"

        Numeric ->
            "text"

        Decimal ->
            "text"


{-| -}
type Error
    = PatternMismatch String
    | TypeMismatch String
    | TooLong Int String
    | TooShort Int String
    | ValueMissing String
    | Custom String


{-| -}
errorToString : Error -> String
errorToString error =
    case error of
        PatternMismatch message ->
            message

        TypeMismatch message ->
            message

        TooLong _ message ->
            message

        TooShort _ message ->
            message

        ValueMissing message ->
            message

        Custom message ->
            message


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { type_ : InputType
    , inputMode : Maybe String
    , disabled : Bool
    , readOnly : Bool
    , required : Bool
    , minLength : Maybe Int
    , maxLength : Maybe Int
    , pattern : Maybe String
    , placeholder : Maybe String
    , validation : Maybe (String -> Maybe String)
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
    { type_ = Text
    , inputMode = Nothing
    , disabled = False
    , readOnly = False
    , required = False
    , minLength = Nothing
    , maxLength = Nothing
    , pattern = Nothing
    , validation = Nothing
    , placeholder = Nothing
    , prefix = Nothing
    , suffix = Nothing
    , mask = Nothing
    , onFocus = Nothing
    , onBlur = Nothing
    , onEnter = Nothing
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
password : Attribute msg
password =
    Attribute <| \attrs -> { attrs | type_ = Password }


{-| -}
search : Attribute msg
search =
    Attribute <| \attrs -> { attrs | type_ = Search }


{-| -}
url : Attribute msg
url =
    Attribute <| \attrs -> { attrs | type_ = Url }


{-| -}
email : Attribute msg
email =
    Attribute <| \attrs -> { attrs | type_ = Email }


{-| -}
telephone : Attribute msg
telephone =
    Attribute <| \attrs -> { attrs | type_ = Telephone }


{-| -}
numeric : Attribute msg
numeric =
    Attribute <| \attrs -> { attrs | type_ = Numeric, inputMode = Just "numeric" }


{-| -}
decimal : Attribute msg
decimal =
    Attribute <| \attrs -> { attrs | type_ = Decimal, inputMode = Just "decimal" }


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
exactLength : Int -> Attribute msg
exactLength v =
    Attribute <| \attrs -> { attrs | minLength = Just v, maxLength = Just v }


{-| -}
minLength : Int -> Attribute msg
minLength v =
    Attribute <| \attrs -> { attrs | minLength = Just v }


{-| -}
maxLength : Int -> Attribute msg
maxLength v =
    Attribute <| \attrs -> { attrs | maxLength = Just v }


{-| -}
pattern : String -> Attribute msg
pattern v =
    Attribute <| \attrs -> { attrs | pattern = Just v }


{-| -}
validation : (String -> Maybe String) -> Attribute msg
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
mask : (String -> String) -> Attribute msg
mask v =
    Attribute <| \attrs -> { attrs | mask = Just v }


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


baseAttrs : Attributes msg -> List (H.Attribute msg)
baseAttrs attrs =
    attrs.htmlAttributes
        ++ [ HA.type_ (inputInputTypeToString attrs.type_)
           , WH.maybeAttr (HA.attribute "inputmode") attrs.inputMode
           , HA.class W.Internal.Input.baseClass
           , WH.attrIf attrs.readOnly HA.tabindex -1
           , HA.required attrs.required
           , HA.disabled attrs.disabled
           , HA.readonly attrs.readOnly
           , WH.attrIf attrs.readOnly (HA.attribute "aria-readonly") "true"
           , WH.attrIf attrs.disabled (HA.attribute "aria-disabled") "true"
           , WH.maybeAttr HA.placeholder attrs.placeholder
           , WH.maybeAttr HA.minlength attrs.minLength
           , WH.maybeAttr HA.maxlength attrs.maxLength
           , WH.maybeAttr HA.pattern attrs.pattern
           , WH.maybeAttr HE.onFocus attrs.onFocus
           , WH.maybeAttr HE.onBlur attrs.onBlur
           , WH.maybeAttr WH.onEnter attrs.onEnter
           ]


{-| -}
view :
    List (Attribute msg)
    ->
        { onInput : String -> msg
        , value : String
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        value : String
        value =
            WH.limitString attrs.maxLength props.value
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
                   , HE.onInput (props.onInput << WH.limitString attrs.maxLength)
                   ]
            )
            []
        )


{-| -}
viewWithValidation :
    List (Attribute msg)
    ->
        { value : String
        , onInput : Result (List Error) String -> String -> msg
        }
    -> H.Html msg
viewWithValidation attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        value : String
        value =
            WH.limitString attrs.maxLength props.value
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
                        (D.map7
                            (\value__ valid patternMismatch typeMismatch tooLong tooShort valueMissing ->
                                let
                                    value_ : String
                                    value_ =
                                        WH.limitString attrs.maxLength value__

                                    customError : Maybe Error
                                    customError =
                                        attrs.validation
                                            |> Maybe.andThen (\fn -> fn value_)
                                            |> Maybe.map Custom

                                    result : Result (List Error) String
                                    result =
                                        if valid && customError == Nothing then
                                            Ok value_

                                        else
                                            [ Just (ValueMissing "Please fill out this field.")
                                                |> WH.keepIf valueMissing
                                            , attrs.minLength
                                                |> WH.keepIf tooShort
                                                |> Maybe.map
                                                    (\minLength_ ->
                                                        TooShort minLength_
                                                            ("Use at least " ++ String.fromInt minLength_ ++ " characters")
                                                    )
                                            , attrs.maxLength
                                                |> WH.keepIf tooLong
                                                |> Maybe.map
                                                    (\maxLength_ ->
                                                        TooShort maxLength_ ("Please shorten this text to " ++ String.fromInt maxLength_ ++ " characters or less")
                                                    )
                                            , Just attrs.type_
                                                |> WH.keepIf typeMismatch
                                                |> Maybe.map
                                                    (\type_ ->
                                                        case type_ of
                                                            Text ->
                                                                TypeMismatch "Input not recognized as text"

                                                            Numeric ->
                                                                TypeMismatch "Input not recognized as text"

                                                            Decimal ->
                                                                TypeMismatch "Input not recognized as text"

                                                            Telephone ->
                                                                TypeMismatch "Type a telephone"

                                                            Search ->
                                                                TypeMismatch "Input not recognized as a search input"

                                                            Email ->
                                                                TypeMismatch "Type an email"

                                                            Url ->
                                                                TypeMismatch "Type a URL"

                                                            Password ->
                                                                TypeMismatch "Input not recognized as a valid password"
                                                    )
                                            , Just (PatternMismatch "Match the requested format")
                                                |> WH.keepIf patternMismatch
                                            , customError
                                            ]
                                                |> List.filterMap identity
                                                |> Err
                                in
                                props.onInput result value_
                            )
                            (D.at [ "target", "value" ] D.string)
                            (D.at [ "target", "validity", "valid" ] D.bool)
                            (D.at [ "target", "validity", "patternMismatch" ] D.bool)
                            (D.at [ "target", "validity", "typeMismatch" ] D.bool)
                            (D.at [ "target", "validity", "tooLong" ] D.bool)
                            (D.at [ "target", "validity", "tooShort" ] D.bool)
                            (D.at [ "target", "validity", "valueMissing" ] D.bool)
                        )
                   ]
            )
            []
        )
