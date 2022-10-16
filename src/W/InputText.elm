module W.InputText exposing
    ( view
    , email, password, search, telephone, url, InputType
    , id, class, unstyled, placeholder, disabled, required, readOnly, pattern
    , viewValidation, errorToString, Error
    , onEnter, onFocus, onBlur
    , htmlAttrs, Attribute
    )

{-|

@docs view
@docs email, password, search, telephone, url, InputType
@docs id, class, unstyled, placeholder, disabled, required, readOnly, pattern
@docs viewValidation, errorToString, Error
@docs onEnter, onFocus, onBlur
@docs htmlAttrs, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import W.Internal.Helpers as WH
import W.Internal.Input as WI



-- Attributes


type InputType
    = Text
    | Telephone
    | Password
    | Search
    | Email
    | Url


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


inputInputTypeToHumanString : InputType -> String
inputInputTypeToHumanString t =
    case t of
        Text ->
            "text"

        Telephone ->
            "telephone"

        Password ->
            "password"

        Search ->
            "search"

        Email ->
            "email"

        Url ->
            "url"


type Error customError
    = PatternMismatch String
    | InputTypeMismatch InputType String
    | TooLong Int String
    | TooShort Int String
    | ValueMissing String
    | Custom customError


errorToString : Error customError -> String
errorToString error =
    case error of
        PatternMismatch message ->
            message

        InputTypeMismatch _ message ->
            message

        TooLong _ message ->
            message

        TooShort _ message ->
            message

        ValueMissing message ->
            message

        Custom _ ->
            "Invalid Input"


{-| -}
type Attribute customError msg
    = Attribute (Attributes customError msg -> Attributes customError msg)


type alias Attributes customError msg =
    { id : Maybe String
    , type_ : InputType
    , class : String
    , unstyled : Bool
    , disabled : Bool
    , readOnly : Bool
    , required : Bool
    , minLength : Maybe Int
    , maxLength : Maybe Int
    , pattern : Maybe String
    , placeholder : Maybe String
    , validation : Maybe (String -> Maybe customError)
    , onFocus : Maybe msg
    , onBlur : Maybe msg
    , onEnter : Maybe msg
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute customError msg) -> Attributes customError msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes customError msg
defaultAttrs =
    { id = Nothing
    , type_ = Text
    , class = ""
    , unstyled = False
    , disabled = False
    , readOnly = False
    , required = False
    , minLength = Nothing
    , maxLength = Nothing
    , pattern = Nothing
    , validation = Nothing
    , placeholder = Nothing
    , onFocus = Nothing
    , onBlur = Nothing
    , onEnter = Nothing
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
id : String -> Attribute customError msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
password : Attribute customError msg
password =
    Attribute <| \attrs -> { attrs | type_ = Password }


{-| -}
search : Attribute customError msg
search =
    Attribute <| \attrs -> { attrs | type_ = Search }


{-| -}
url : Attribute customError msg
url =
    Attribute <| \attrs -> { attrs | type_ = Url }


{-| -}
email : Attribute customError msg
email =
    Attribute <| \attrs -> { attrs | type_ = Email }


{-| -}
telephone : Attribute customError msg
telephone =
    Attribute <| \attrs -> { attrs | type_ = Telephone }


{-| -}
class : String -> Attribute customError msg
class v =
    Attribute <| \attrs -> { attrs | class = v }


{-| -}
unstyled : Bool -> Attribute customError msg
unstyled v =
    Attribute <| \attrs -> { attrs | unstyled = v }


{-| -}
placeholder : String -> Attribute customError msg
placeholder v =
    Attribute <| \attrs -> { attrs | placeholder = Just v }


{-| -}
disabled : Bool -> Attribute customError msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
readOnly : Bool -> Attribute customError msg
readOnly v =
    Attribute <| \attrs -> { attrs | readOnly = v }


{-| -}
required : Bool -> Attribute customError msg
required v =
    Attribute <| \attrs -> { attrs | required = v }


{-| -}
pattern : String -> Attribute customError msg
pattern v =
    Attribute <| \attrs -> { attrs | pattern = Just v }


{-| -}
validation : (String -> Maybe customError) -> Attribute customError msg
validation v =
    Attribute <| \attrs -> { attrs | validation = Just v }


{-| -}
onBlur : msg -> Attribute customError msg
onBlur v =
    Attribute <| \attrs -> { attrs | onBlur = Just v }


{-| -}
onFocus : msg -> Attribute customError msg
onFocus v =
    Attribute <| \attrs -> { attrs | onFocus = Just v }


{-| -}
onEnter : msg -> Attribute customError msg
onEnter v =
    Attribute <| \attrs -> { attrs | onEnter = Just v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute customError msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }



-- Main


baseAttrs : Attributes customError msg -> List (H.Attribute msg)
baseAttrs attrs =
    attrs.htmlAttributes
        ++ [ WH.maybeAttr HA.id attrs.id
           , HA.type_ (inputInputTypeToString attrs.type_)
           , HA.class attrs.class
           , HA.classList [ ( WI.baseClass, not attrs.unstyled ) ]
           , HA.required attrs.required
           , HA.disabled attrs.disabled
           , HA.readonly attrs.readOnly
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
    List (Attribute customError msg)
    ->
        { onInput : String -> msg
        , value : String
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes customError msg
        attrs =
            applyAttrs attrs_
    in
    H.input (baseAttrs attrs ++ [ HA.value props.value, HE.onInput props.onInput ]) []


viewValidation :
    List (Attribute customError msg)
    ->
        { value : String
        , onInput : String -> Result (Error customError) String -> msg
        }
    -> H.Html msg
viewValidation attrs_ props =
    let
        attrs : Attributes customError msg
        attrs =
            applyAttrs attrs_
    in
    H.input
        (baseAttrs attrs
            ++ [ HA.value props.value
               , HE.on "keyup"
                    (D.map8
                        (\value_ valid patternMismatch typeMismatch tooLong tooShort valueMissing validationMessage ->
                            let
                                customError : Maybe customError
                                customError =
                                    attrs.validation
                                        |> Maybe.map (\fn -> fn value_)
                                        |> Maybe.withDefault Nothing
                            in
                            if valid && customError == Nothing then
                                props.onInput value_ (Ok value_)

                            else if valueMissing then
                                props.onInput value_ (Err (ValueMissing validationMessage))

                            else if tooShort then
                                props.onInput value_ (Err (TooShort (Maybe.withDefault 0 attrs.minLength) validationMessage))

                            else if typeMismatch then
                                props.onInput value_ (Err (InputTypeMismatch attrs.type_ validationMessage))

                            else if tooLong then
                                props.onInput value_ (Err (TooLong (Maybe.withDefault 0 attrs.maxLength) validationMessage))

                            else if patternMismatch then
                                props.onInput value_ (Err (PatternMismatch validationMessage))

                            else
                                props.onInput
                                    value_
                                    (customError
                                        |> Maybe.map (Err << Custom)
                                        |> Maybe.withDefault (Ok value_)
                                    )
                        )
                        (D.at [ "target", "value" ] D.string)
                        (D.at [ "target", "validity", "valid" ] D.bool)
                        (D.at [ "target", "validity", "patternMismatch" ] D.bool)
                        (D.at [ "target", "validity", "typeMismatch" ] D.bool)
                        (D.at [ "target", "validity", "tooLong" ] D.bool)
                        (D.at [ "target", "validity", "tooShort" ] D.bool)
                        (D.at [ "target", "validity", "valueMissing" ] D.bool)
                        (D.at [ "target", "validitationMessage" ] D.string)
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
