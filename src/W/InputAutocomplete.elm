module W.InputAutocomplete exposing
    ( view
    , init, toString, toValue, Value
    , disabled, readOnly
    , placeholder, prefix, suffix
    , required
    , onEnter, onBlur, onFocus
    , htmlAttrs, noAttr, Attribute, renderOption, renderOptionsHeader
    )

{-|

@docs view


# Value

@docs init, toString, toValue, Value


# States

@docs disabled, readOnly


# Styles

@docs placeholder, prefix, suffix


# Validation Attributes

@docs required


# Actions

@docs onEnter, onBlur, onFocus


# Html

@docs htmlAttrs, noAttr, Attribute, renderOption, renderOptionsHeader

-}

import Array
import Dict
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import W.Internal.Helpers as WH
import W.Internal.Icons
import W.Internal.Input
import W.Loading



-- Value


{-| -}
type Value a
    = Value (ValueData a)


type alias ValueData a =
    { input : String
    , value : Maybe a
    , highlighted : Int
    , toString : a -> String
    }


{-| -}
init : { value : Maybe a, toString : a -> String } -> Value a
init props =
    Value
        { input = Maybe.map props.toString props.value |> Maybe.withDefault ""
        , value = props.value
        , highlighted = 0
        , toString = props.toString
        }


update : Value a -> String -> Maybe a -> Value a
update (Value data) input value =
    Value { data | input = input, value = value, highlighted = 0 }


updateHighlighted : (Int -> Int) -> Value a -> Value a
updateHighlighted fn (Value data) =
    Value { data | highlighted = fn data.highlighted }


{-| -}
toString : Value a -> String
toString (Value { input }) =
    input


{-| -}
toValue : Value a -> Maybe a
toValue (Value { value }) =
    value



-- Attributes


{-| -}
type Attribute msg resource
    = Attribute (Attributes msg resource -> Attributes msg resource)


type alias Attributes msg resource =
    { disabled : Bool
    , required : Bool
    , readOnly : Bool
    , placeholder : Maybe String
    , prefix : Maybe (List (H.Html msg))
    , suffix : Maybe (List (H.Html msg))
    , onFocus : Maybe msg
    , onBlur : Maybe msg
    , onEnter : Maybe msg
    , htmlAttributes : List (H.Attribute msg)
    , renderOptionsHeader : Maybe (( String, Maybe resource ) -> H.Html msg)
    , renderOption : Maybe ({ active : Bool, index : Int, resource : resource } -> H.Html msg)
    }


applyAttrs : List (Attribute msg resource) -> Attributes msg resource
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg resource
defaultAttrs =
    { disabled = False
    , required = False
    , readOnly = False
    , placeholder = Nothing
    , prefix = Nothing
    , suffix = Nothing
    , onFocus = Nothing
    , onBlur = Nothing
    , onEnter = Nothing
    , htmlAttributes = []
    , renderOptionsHeader = Nothing
    , renderOption = Nothing
    }



-- Attribute : Setters


{-| -}
placeholder : String -> Attribute msg resource
placeholder v =
    Attribute <| \attrs -> { attrs | placeholder = Just v }


{-| -}
disabled : Bool -> Attribute msg resource
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
readOnly : Bool -> Attribute msg resource
readOnly v =
    Attribute <| \attrs -> { attrs | readOnly = v }


{-| -}
required : Bool -> Attribute msg resource
required v =
    Attribute <| \attrs -> { attrs | required = v }


{-| -}
prefix : List (H.Html msg) -> Attribute msg resource
prefix v =
    Attribute <| \attrs -> { attrs | prefix = Just v }


{-| -}
suffix : List (H.Html msg) -> Attribute msg resource
suffix v =
    Attribute <| \attrs -> { attrs | suffix = Just v }


{-| -}
onBlur : msg -> Attribute msg resource
onBlur v =
    Attribute <| \attrs -> { attrs | onBlur = Just v }


{-| -}
onFocus : msg -> Attribute msg resource
onFocus v =
    Attribute <| \attrs -> { attrs | onFocus = Just v }


{-| -}
onEnter : msg -> Attribute msg resource
onEnter v =
    Attribute <| \attrs -> { attrs | onEnter = Just v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg resource
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


renderOptionsHeader : (( String, Maybe resource ) -> H.Html msg) -> Attribute msg resource
renderOptionsHeader v =
    Attribute <| \attrs -> { attrs | renderOptionsHeader = Just v }


renderOption : ({ active : Bool, index : Int, resource : resource } -> H.Html msg) -> Attribute msg resource
renderOption v =
    Attribute <| \attrs -> { attrs | renderOption = Just v }


{-| -}
noAttr : Attribute msg resource
noAttr =
    Attribute identity



-- Main


{-| -}
view :
    List (Attribute msg resource)
    ->
        { id : String
        , value : Value resource
        , options : Maybe (List resource)
        , onInput : Value resource -> msg
        }
    -> H.Html msg
view attrs_ props =
    let
        valueData : ValueData resource
        valueData =
            case props.value of
                Value v ->
                    v

        attrs : Attributes msg resource
        attrs =
            applyAttrs attrs_

        options : List ( String, resource )
        options =
            props.options
                |> Maybe.withDefault []
                |> List.map (\o -> ( valueData.toString o, o ))

        optionsDict : Dict.Dict String resource
        optionsDict =
            Dict.fromList options

        modHighlited : Int
        modHighlited =
            let
                nonZeroLength : Int
                nonZeroLength =
                    case List.length options of
                        0 ->
                            1

                        n ->
                            n
            in
            modBy nonZeroLength valueData.highlighted

        submit : D.Decoder ( msg, Bool )
        submit =
            options
                |> List.filter (String.contains valueData.input << Tuple.first)
                |> Array.fromList
                |> Array.get modHighlited
                |> Maybe.map
                    (\( valueString, value ) ->
                        update props.value valueString (Just value)
                            |> props.onInput
                            |> (\msg -> ( msg, False ))
                            |> D.succeed
                    )
                |> Maybe.withDefault
                    (attrs.onEnter
                        |> Maybe.map (\msg -> D.succeed ( msg, False ))
                        |> Maybe.withDefault (D.fail "ignored action")
                    )
    in
    H.input
        (attrs.htmlAttributes
            ++ [ WH.maybeAttr HA.placeholder attrs.placeholder
               , HA.disabled (attrs.disabled || attrs.readOnly)
               , HA.readonly attrs.readOnly
               , WH.attrIf attrs.readOnly (HA.attribute "aria-readonly") "true"
               , WH.attrIf attrs.disabled (HA.attribute "aria-disabled") "true"
               , HA.required attrs.required
               , HA.autocomplete False
               , HA.id props.id
               , HA.class W.Internal.Input.baseClass
               , HA.class "ew-pr-10"
               , HA.value valueData.input
               , WH.maybeAttr HE.onFocus attrs.onFocus
               , WH.maybeAttr HE.onBlur attrs.onBlur
               , HE.preventDefaultOn "keydown"
                    (D.field "key" D.string
                        |> D.andThen
                            (\key ->
                                case key of
                                    "Tab" ->
                                        if options == [] then
                                            D.succeed ( props.onInput props.value, True )

                                        else
                                            submit

                                    "Space" ->
                                        if options == [] then
                                            D.fail "ignored key"

                                        else
                                            submit

                                    "Enter" ->
                                        submit

                                    "ArrowDown" ->
                                        props.value
                                            |> updateHighlighted ((+) 1)
                                            |> props.onInput
                                            |> (\msg -> ( msg, False ))
                                            |> D.succeed

                                    "ArrowUp" ->
                                        props.value
                                            |> updateHighlighted ((+) -1)
                                            |> props.onInput
                                            |> (\msg -> ( msg, False ))
                                            |> D.succeed

                                    _ ->
                                        D.fail "ignored key"
                            )
                    )
               , HE.on "input"
                    (D.at [ "target", "value" ] D.string
                        |> D.andThen
                            (\value ->
                                Dict.get value optionsDict
                                    |> update props.value value
                                    |> props.onInput
                                    |> D.succeed
                            )
                    )
               ]
        )
        []
        |> W.Internal.Input.viewWithIcon
            { prefix = attrs.prefix
            , suffix = attrs.suffix
            , disabled = attrs.disabled
            , readOnly = attrs.readOnly
            , mask = Nothing
            , maskInput = ""
            }
            (if props.options == Nothing then
                W.Loading.circles [ W.Loading.size 28 ]

             else
                W.Internal.Icons.chevronDown
            )
        |> (\x ->
                let
                    viewRow : { active : Bool, index : Int, resource : resource } -> H.Html msg
                    viewRow =
                        attrs.renderOption
                            |> Maybe.withDefault (viewDefaultRow valueData)

                    header : H.Html msg
                    header =
                        case attrs.renderOptionsHeader of
                            Just renderOptionsHeader_ ->
                                renderOptionsHeader_ ( valueData.input, valueData.value )

                            Nothing ->
                                H.text ""
                in
                H.div [ HA.class "ew-relative ew-group" ]
                    [ x
                    , H.ul
                        [ HA.class "justify-center group-focus-within:ew-block ew-hidden ew-absolute ew-left-0 ew-right-0 ew-shadow ew-z-10 ew-bg-base-bg" ]
                        (header
                            :: (options
                                    |> List.filter (String.contains valueData.input << Tuple.first)
                                    |> List.indexedMap
                                        (\index ( _, resource ) ->
                                            H.div
                                                [ updateHighlighted (\_ -> index) props.value
                                                    |> props.onInput
                                                    |> HE.onClick
                                                ]
                                                [ viewRow
                                                    { active = index == modHighlited
                                                    , index = index
                                                    , resource = resource
                                                    }
                                                ]
                                        )
                               )
                        )
                    ]
           )


viewDefaultRow : ValueData resource -> { active : Bool, index : Int, resource : resource } -> H.Html msg
viewDefaultRow valueData { active, resource } =
    H.li
        [ HA.classList [ ( "ew-bg-base-aux", active ) ]
        , HA.style "cursor" "pointer"
        ]
        [ H.text (valueData.toString resource) ]
