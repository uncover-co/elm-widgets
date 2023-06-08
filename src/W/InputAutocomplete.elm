module W.InputAutocomplete exposing
    ( view, viewSync
    , init, toString, toValue, stringChanged, valueChanged, Value
    , viewCustom, viewSyncCustom, optionsHeader
    , autofocus, disabled, readOnly
    , placeholder, prefix, suffix
    , required
    , onEnter, onBlur, onFocus
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, viewSync


# Value

@docs init, toString, toValue, stringChanged, valueChanged, Value


# Custom Rendering

@docs viewCustom, viewSyncCustom, optionsHeader


# States

@docs autofocus, disabled, readOnly


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
import Html.Lazy
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


{-| -}
stringChanged : Value a -> Value a -> Bool
stringChanged a b =
    toString a /= toString b


toStringFn : Value a -> (a -> String)
toStringFn (Value data) =
    data.toString


{-| -}
toValue : Value a -> Maybe a
toValue (Value data) =
    data.value


{-| -}
valueChanged : Value a -> Value a -> Bool
valueChanged a b =
    toValue a /= toValue b


{-| -}
init : { value : Maybe a, toString : a -> String } -> Value a
init props =
    { input = ""
    , value = props.value
    , highlighted = 0
    , focused = False
    , toString = props.toString
    }
        |> initInput
        |> Value


initInput : ValueData a -> ValueData a
initInput data =
    { data
        | input =
            data.value
                |> Maybe.map data.toString
                |> Maybe.withDefault ""
    }


type Msg a
    = Input String
    | Select Int a
    | Focus
    | Blur
    | ArrowDown
    | ArrowUp


update : (Value a -> msg) -> Value a -> Msg a -> msg
update toMsg (Value model) msg =
    let
        newModel : ValueData a
        newModel =
            case msg of
                Input value ->
                    { model
                        | input = value
                        , highlighted = 0
                        , focused = True
                    }

                Select index value ->
                    { model
                        | value = Just value
                        , highlighted = index
                        , focused = False
                    }
                        |> initInput

                Focus ->
                    { model | focused = True }

                Blur ->
                    -- We don't call `focused = False` on blur
                    -- since that would prevent click behavior.
                    initInput model

                ArrowDown ->
                    if model.focused then
                        { model | highlighted = model.highlighted + 1 }

                    else
                        { model | focused = True }

                ArrowUp ->
                    if model.focused then
                        { model | highlighted = model.highlighted - 1 }

                    else
                        { model | focused = True }
    in
    toMsg (Value newModel)



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { disabled : Bool
    , required : Bool
    , readOnly : Bool
    , autofocus : Bool
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
    , autofocus = False
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
autofocus : Attribute msg
autofocus =
    Attribute <| \attrs -> { attrs | autofocus = True }


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
viewSync :
    List (Attribute msg)
    ->
        { id : String
        , value : Value a
        , options : List a
        , onInput : Value a -> msg
        }
    -> H.Html msg
viewSync attrs_ props =
    viewSyncCustom attrs_
        { id = props.id
        , value = props.value
        , options = props.options
        , onInput = props.onInput
        , toHtml = H.text << toStringFn props.value
        }


{-| -}
viewSyncCustom :
    List (Attribute msg)
    ->
        { id : String
        , value : Value a
        , options : List a
        , onInput : Value a -> msg
        , toHtml : a -> H.Html msg
        }
    -> H.Html msg
viewSyncCustom attrs_ props =
    viewCustom (noFilter :: attrs_)
        { id = props.id
        , value = props.value
        , options = Just props.options
        , onInput = props.onInput
        , toHtml = props.toHtml
        }


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

        update_ : Msg a -> msg
        update_ =
            update props.onInput props.value

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
    valueData.input
        |> Html.Lazy.lazy
            (\_ ->
                H.input
                    (attrs.htmlAttributes
                        ++ [ WH.maybeAttr HA.placeholder attrs.placeholder
                           , HA.disabled (attrs.disabled || attrs.readOnly)
                           , HA.readonly attrs.readOnly
                           , WH.attrIf attrs.readOnly (HA.attribute "aria-readonly") "true"
                           , WH.attrIf attrs.disabled (HA.attribute "aria-disabled") "true"
                           , HA.required attrs.required
                           , HA.autofocus attrs.autofocus
                           , HA.autocomplete False
                           , HA.id props.id
                           , HA.class W.Internal.Input.baseClass
                           , HA.class "ew-pr-10"
                           , HA.value valueData.input
                           , WH.maybeAttr (HE.on "focusin") (attrs.onFocus |> Maybe.map D.succeed)
                           , WH.maybeAttr (HE.on "focusout") (attrs.onBlur |> Maybe.map D.succeed)
                           , HE.onFocus (update_ Focus)
                           , HE.onBlur (update_ Blur)
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
                                                                Select highlighted value
                                                                    |> update_
                                                                    |> D.succeed
                                                            )
                                                        |> Maybe.withDefault
                                                            (attrs.onEnter
                                                                |> Maybe.map (\msg -> D.succeed msg)
                                                                |> Maybe.withDefault (D.fail "ignored action")
                                                            )

                                                "ArrowDown" ->
                                                    ArrowDown
                                                        |> update_
                                                        |> D.succeed

                                                "ArrowUp" ->
                                                    ArrowUp
                                                        |> update_
                                                        |> D.succeed

                                                _ ->
                                                    D.fail "ignored key"
                                        )
                                )
                           , HE.on "input"
                                (D.at [ "target", "value" ] D.string
                                    |> D.andThen
                                        (\value ->
                                            Input value
                                                |> update_
                                                |> D.succeed
                                        )
                                )
                           ]
                    )
                    []
            )
        |> W.Internal.Input.viewWithIcon
            { prefix = attrs.prefix
            , suffix = attrs.suffix
            , disabled = attrs.disabled
            , readOnly = attrs.readOnly
            , mask = Nothing
            , maskInput = ""
            }
            (if props.options == Nothing && valueData.input /= "" then
                W.Loading.dots [ W.Loading.size 20 ]

             else
                W.Internal.Icons.chevronDown
            )
        |> (\x ->
                H.div [ HA.class "ew-relative ew-group" ]
                    [ x
                    , if valueData.focused then
                        H.div
                            [ HA.class "ew-hidden group-focus-within:ew-block hover:ew-block"
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
                                                            Select index value
                                                                |> update_
                                                        }
                                                )
                                       )
                                )
                            ]

                      else
                        H.text ""
                    ]
           )
