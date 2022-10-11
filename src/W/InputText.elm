module W.InputText exposing
    ( view
    , email, password, search, telephone, url
    , id, class, unstyled, placeholder, disabled, required, readOnly, pattern
    , onEnter, onFocus, onBlur
    , htmlAttrs, Attribute
    )

{-|

@docs view
@docs email, password, search, telephone, url
@docs id, class, unstyled, placeholder, disabled, required, readOnly, pattern
@docs onEnter, onFocus, onBlur
@docs htmlAttrs, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Helpers as WH



-- Attributes


type InputType
    = Text
    | Telephone
    | Password
    | Search
    | Email
    | Url


inputTypeToString : InputType -> String
inputTypeToString t =
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


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
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
    , type_ = Text
    , class = ""
    , unstyled = False
    , disabled = False
    , readOnly = False
    , required = False
    , minLength = Nothing
    , maxLength = Nothing
    , pattern = Nothing
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
class : String -> Attribute msg
class v =
    Attribute <| \attrs -> { attrs | class = v }


{-| -}
unstyled : Bool -> Attribute msg
unstyled v =
    Attribute <| \attrs -> { attrs | unstyled = v }


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
pattern : String -> Attribute msg
pattern v =
    Attribute <| \attrs -> { attrs | pattern = Just v }


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
        { onInput : String -> msg
        , value : String
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
               , HA.type_ (inputTypeToString attrs.type_)
               , WH.attrIf (not attrs.unstyled) HA.class "ew ew-input ew-focusable"
               , HA.class attrs.class
               , HA.required attrs.required
               , HA.disabled attrs.disabled
               , HA.readonly (attrs.readOnly || attrs.readOnly)
               , HA.value props.value
               , HE.onInput props.onInput
               , WH.maybeAttr HA.placeholder attrs.placeholder
               , WH.maybeAttr HA.minlength attrs.minLength
               , WH.maybeAttr HA.maxlength attrs.maxLength
               , WH.maybeAttr HA.pattern attrs.pattern
               , WH.maybeAttr HE.onFocus attrs.onFocus
               , WH.maybeAttr HE.onBlur attrs.onBlur
               , WH.maybeAttr WH.onEnter attrs.onEnter
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
