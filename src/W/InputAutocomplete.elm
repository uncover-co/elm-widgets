module W.InputAutocomplete exposing
    ( view, viewSync
    , init, reset, toString, toValue, onChange, stringChanged, valueChanged, Value
    , viewCustom, viewSyncCustom, optionsHeader
    , isLoading, autofocus, disabled, readOnly
    , small, placeholder, prefix, suffix
    , required
    , onEnter, onDone, onDelete, onBlur, onFocus
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, viewSync


# Value

@docs init, reset, toString, toValue, onChange, stringChanged, valueChanged, Value


# Custom Rendering

@docs viewCustom, viewSyncCustom, optionsHeader


# States

@docs isLoading, autofocus, disabled, readOnly


# Styles

@docs small, placeholder, prefix, suffix


# Validation Attributes

@docs required


# Actions

@docs onEnter, onDone, onDelete, onBlur, onFocus


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
onChange : Value a -> Value a -> Maybe a
onChange before after =
    if valueChanged before after then
        toValue after

    else
        Nothing


{-| -}
reset : Value a -> Value a
reset (Value data) =
    Value { data | value = Nothing, input = "" }


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
                    { model | focused = False }

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
    , isLoading : Maybe Bool
    , small : Bool
    , placeholder : Maybe String
    , prefix : Maybe (List (H.Html msg))
    , suffix : Maybe (List (H.Html msg))
    , onFocus : Maybe msg
    , onBlur : Maybe msg
    , onEnter : Maybe msg
    , onDone : Maybe msg
    , onDelete : Maybe msg
    , htmlAttributes : List (H.Attribute msg)
    , optionsHeader : Maybe (String -> H.Html msg)
    , localFilter : Bool
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
    , isLoading = Nothing
    , small = False
    , placeholder = Nothing
    , prefix = Nothing
    , suffix = Nothing
    , onFocus = Nothing
    , onBlur = Nothing
    , onEnter = Nothing
    , onDone = Nothing
    , onDelete = Nothing
    , htmlAttributes = []
    , optionsHeader = Nothing
    , localFilter = False
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


{-| Control loading state manually. Usually, loading state is displayed when `Nothing` is passed in as options.
-}
isLoading : Bool -> Attribute msg
isLoading v =
    Attribute <| \attrs -> { attrs | isLoading = Just v }


{-| -}
required : Bool -> Attribute msg
required v =
    Attribute <| \attrs -> { attrs | required = v }


{-| -}
autofocus : Attribute msg
autofocus =
    Attribute <| \attrs -> { attrs | autofocus = True }


{-| -}
small : Attribute msg
small =
    Attribute <| \attrs -> { attrs | small = True }


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


localFilter : Attribute msg
localFilter =
    Attribute <| \attrs -> { attrs | localFilter = True }


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
onDone : msg -> Attribute msg
onDone v =
    Attribute <| \attrs -> { attrs | onDone = Just v }


{-| -}
onDelete : msg -> Attribute msg
onDelete v =
    Attribute <| \attrs -> { attrs | onDelete = Just v }


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
    viewCustom (localFilter :: attrs_)
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

        options : List ( Int, a )
        options =
            if attrs.localFilter then
                props.options
                    |> Maybe.withDefault []
                    |> List.indexedMap Tuple.pair
                    |> List.filter (Tuple.second >> valueData.toString >> matches valueData.input)

            else
                props.options
                    |> Maybe.withDefault []
                    |> List.indexedMap Tuple.pair

        highlighted : Int
        highlighted =
            modBy (max (List.length options) 1) valueData.highlighted

        showLoading : Bool
        showLoading =
            attrs.isLoading
                |> Maybe.withDefault (props.options == Nothing && valueData.input /= "")
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
                           , HA.class (W.Internal.Input.baseClass attrs.small)
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
                                                    case ( attrs.onDone, valueData.input ) of
                                                        ( Just onDone_, "" ) ->
                                                            D.succeed onDone_

                                                        _ ->
                                                            options
                                                                |> Array.fromList
                                                                |> Array.get highlighted
                                                                |> Maybe.map
                                                                    (\( _, value ) ->
                                                                        Select highlighted value
                                                                            |> update_
                                                                            |> D.succeed
                                                                    )
                                                                |> Maybe.withDefault
                                                                    (attrs.onEnter
                                                                        |> Maybe.map (\msg -> D.succeed msg)
                                                                        |> Maybe.withDefault (D.fail "ignored action")
                                                                    )

                                                "Delete" ->
                                                    case ( attrs.onDelete, valueData.input ) of
                                                        ( Just onDelete_, "" ) ->
                                                            D.succeed onDelete_

                                                        _ ->
                                                            D.fail "ignored event"

                                                "Backspace" ->
                                                    case ( attrs.onDelete, valueData.input ) of
                                                        ( Just onDelete_, "" ) ->
                                                            D.succeed onDelete_

                                                        _ ->
                                                            D.fail "ignored event"

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
            { small = attrs.small
            , prefix = attrs.prefix
            , suffix = attrs.suffix
            , disabled = attrs.disabled
            , readOnly = attrs.readOnly
            , mask = Nothing
            , maskInput = ""
            }
            (if showLoading then
                W.Loading.dots [ W.Loading.size 20 ]

             else
                W.Internal.Icons.chevronDown
            )
        |> (\x ->
                H.div [ HA.class "ew-relative" ]
                    [ H.div [ HA.class "ew-input-autocomplete" ] [ x ]
                    , H.div
                        [ HA.class "ew-input-autocomplete--options"
                        , HA.class "ew-absolute ew-top-full ew-mt-2 ew-left-0 ew-right-0"
                        , HA.class "ew-shadow ew-z-10 ew-bg-base-bg"
                        ]
                        [ W.Menu.view
                            [ case attrs.optionsHeader of
                                Just optionsHeader_ ->
                                    H.div []
                                        [ H.div [ HA.class "ew-p-3" ] [ optionsHeader_ valueData.input ]
                                        , W.Divider.view [] []
                                        ]

                                Nothing ->
                                    H.text ""
                            , H.div [ HA.class "ew-overflow-y-auto ew-overflow-x-hidden ew-max-h-64 ew-w-full" ]
                                (options
                                    |> List.indexedMap
                                        (\viewIndex ( index, value ) ->
                                            W.Menu.viewButton
                                                [ W.Menu.selected (highlighted == viewIndex)
                                                ]
                                                { label = [ props.toHtml value ]
                                                , onClick =
                                                    Select index value
                                                        |> update_
                                                }
                                        )
                                )
                            ]
                        ]
                    ]
           )


matches : String -> String -> Bool
matches match input =
    String.contains (String.toLower match) (String.toLower input)
