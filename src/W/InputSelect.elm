module W.InputSelect exposing
    ( view, viewGroups, viewOptional, viewGroupsOptional
    , disabled, readOnly
    , prefix, suffix
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, viewGroups, viewOptional, viewGroupsOptional


# States

@docs disabled, readOnly


# Styles

@docs prefix, suffix


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Dict exposing (Dict)
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Helpers as WH
import W.Internal.Icons
import W.Internal.Input



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { disabled : Bool
    , readOnly : Bool
    , prefix : Maybe (List (H.Html msg))
    , suffix : Maybe (List (H.Html msg))
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { disabled = False
    , readOnly = False
    , prefix = Nothing
    , suffix = Nothing
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
prefix : List (H.Html msg) -> Attribute msg
prefix v =
    Attribute <| \attrs -> { attrs | prefix = Just v }


{-| -}
suffix : List (H.Html msg) -> Attribute msg
suffix v =
    Attribute <| \attrs -> { attrs | suffix = Just v }


{-| Attributes applied to the `select` element.
-}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- View


{-| -}
viewGroups :
    List (Attribute msg)
    ->
        { value : a
        , options : List a
        , optionGroups : List ( String, List a )
        , toLabel : a -> String
        , onInput : a -> msg
        }
    -> H.Html msg
viewGroups attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        values : Dict String a
        values =
            props.optionGroups
                |> List.concatMap Tuple.second
                |> List.append props.options
                |> List.map (\a -> ( props.toLabel a, a ))
                |> Dict.fromList
    in
    W.Internal.Input.viewWithIcon
        { prefix = attrs.prefix
        , suffix = attrs.suffix
        , disabled = attrs.disabled
        , readOnly = attrs.readOnly
        , mask = Nothing
        , maskInput = ""
        }
        W.Internal.Icons.chevronDown
        (H.select
            (attrs.htmlAttributes
                ++ [ HA.class W.Internal.Input.baseClass
                   , HA.disabled attrs.disabled
                   , HA.readonly attrs.readOnly
                   , WH.attrIf attrs.readOnly (HA.attribute "aria-readonly") "true"
                   , WH.attrIf attrs.disabled (HA.attribute "aria-disabled") "true"
                   , HA.placeholder "Select"
                   , HE.onInput
                        (\s ->
                            Dict.get s values
                                |> Maybe.withDefault props.value
                                |> props.onInput
                        )
                   ]
            )
            (List.concat
                [ props.options
                    |> List.map
                        (\a ->
                            H.option
                                [ HA.selected (a == props.value)
                                , HA.value (props.toLabel a)
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
                                                , HA.value (props.toLabel a)
                                                ]
                                                [ H.text (props.toLabel a) ]
                                        )
                                )
                        )
                ]
            )
        )


{-| -}
view :
    List (Attribute msg)
    ->
        { value : a
        , options : List a
        , toLabel : a -> String
        , onInput : a -> msg
        }
    -> H.Html msg
view attrs_ props =
    viewGroups attrs_
        { value = props.value
        , options = props.options
        , optionGroups = []
        , toLabel = props.toLabel
        , onInput = props.onInput
        }


{-| -}
viewOptional :
    List (Attribute msg)
    ->
        { value : Maybe a
        , options : List a
        , toLabel : a -> String
        , placeholder : String
        , onInput : Maybe a -> msg
        }
    -> H.Html msg
viewOptional attrs_ props =
    viewGroupsOptional attrs_
        { value = props.value
        , options = props.options
        , optionGroups = []
        , placeholder = props.placeholder
        , toLabel = props.toLabel
        , onInput = props.onInput
        }


{-| -}
viewGroupsOptional :
    List (Attribute msg)
    ->
        { value : Maybe a
        , options : List a
        , optionGroups : List ( String, List a )
        , toLabel : a -> String
        , placeholder : String
        , onInput : Maybe a -> msg
        }
    -> H.Html msg
viewGroupsOptional attrs_ props =
    viewGroups attrs_
        { value = props.value
        , options = Nothing :: List.map Just props.options
        , optionGroups = []
        , toLabel = Maybe.map props.toLabel >> Maybe.withDefault props.placeholder
        , onInput = props.onInput
        }
