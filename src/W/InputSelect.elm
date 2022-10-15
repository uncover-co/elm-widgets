module W.InputSelect exposing
    ( view, viewGroups
    , id, disabled, readOnly
    , Attribute
    )

{-|

@docs view, viewGroups
@docs id, disabled, readOnly
@docs Attribute

-}

import Dict exposing (Dict)
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Helpers as WH
import W.Internal.Input



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes -> Attributes)


type alias Attributes =
    { id : Maybe String
    , disabled : Bool
    , readOnly : Bool
    }


applyAttrs : List (Attribute msg) -> Attributes
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes
defaultAttrs =
    { id = Nothing
    , disabled = False
    , readOnly = False
    }



-- Attributes : Setters


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
readOnly : Bool -> Attribute msg
readOnly v =
    Attribute <| \attrs -> { attrs | readOnly = v }


{-| -}
viewGroups :
    List (Attribute msg)
    ->
        { value : a
        , options : List a
        , optionGroups : List ( String, List a )
        , toValue : a -> String
        , toLabel : a -> String
        , onInput : a -> msg
        }
    -> H.Html msg
viewGroups attrs_ props =
    let
        attrs =
            applyAttrs attrs_

        values : Dict String a
        values =
            props.optionGroups
                |> List.concatMap Tuple.second
                |> List.append props.options
                |> List.map (\a -> ( props.toValue a, a ))
                |> Dict.fromList
    in
    H.div [ HA.class "ew-select ew-relative" ]
        [ H.select
            [ WH.maybeAttr HA.id attrs.id
            , HA.class W.Internal.Input.baseClass
            , HA.disabled attrs.disabled
            , HA.readonly attrs.readOnly
            , HA.placeholder "Select"
            , HE.onInput
                (\s ->
                    Dict.get s values
                        |> Maybe.withDefault props.value
                        |> props.onInput
                )
            ]
            (List.concat
                [ props.options
                    |> List.map
                        (\a ->
                            H.option
                                [ HA.selected (a == props.value)
                                , HA.value (props.toValue a)
                                ]
                                [ H.text (props.toLabel a) ]
                        )
                , props.optionGroups
                    |> List.map
                        (\( l, options_ ) ->
                            H.optgroup [ HA.attribute "label" l ]
                                (options_
                                    |> List.map
                                        (\a ->
                                            H.option
                                                [ HA.selected (a == props.value)
                                                , HA.value (props.toValue a)
                                                ]
                                                [ H.text (props.toLabel a) ]
                                        )
                                )
                        )
                ]
            )
        , W.Internal.Input.iconWrapper "ew-text-base-aux"
            W.Internal.Input.iconChevronDown
        ]


{-| -}
view :
    List (Attribute msg)
    ->
        { value : a
        , options : List a
        , toValue : a -> String
        , toLabel : a -> String
        , onInput : a -> msg
        }
    -> H.Html msg
view attrs_ props =
    viewGroups attrs_
        { value = props.value
        , options = props.options
        , optionGroups = []
        , toValue = props.toValue
        , toLabel = props.toLabel
        , onInput = props.onInput
        }
