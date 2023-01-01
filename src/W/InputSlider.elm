module W.InputSlider exposing
    ( view
    , disabled, readOnly
    , color
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# States

@docs disabled, readOnly


# Styles

@docs color


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import Theme



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { disabled : Bool
    , readOnly : Bool
    , color : String
    , format : Float -> String
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { disabled = False
    , readOnly = False
    , color = Theme.primaryBackground
    , format = String.fromFloat
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
color : String -> Attribute msg
color v =
    Attribute <| \attrs -> { attrs | color = v }


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
readOnly : Bool -> Attribute msg
readOnly v =
    Attribute <| \attrs -> { attrs | readOnly = v }


{-| Attributes applied to the `input[type="range"]` element.
-}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- Main


{-| -}
view :
    List (Attribute msg)
    ->
        { min : Float
        , max : Float
        , step : Float
        , value : Float
        , onInput : Float -> msg
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        valueString : String
        valueString =
            (props.value - props.min)
                / (props.max - props.min)
                |> (*) 100
                |> String.fromFloat
                |> (\s -> s ++ "%")

        colorAttr : H.Attribute msg
        colorAttr =
            if attrs.disabled then
                HA.class "ew-text-base-aux"

            else
                HA.style "color" attrs.color
    in
    H.div
        [ HA.class "ew-group ew-relative ew-full"
        , colorAttr
        ]
        [ H.div [ HA.class "ew-absolute ew-inset-y-0 ew-inset-x-[12px]" ]
            [ -- Track
              H.div
                [ HA.class "ew-absolute ew-rounded"
                , HA.class "ew-inset-x-0 ew-top-1/2"
                , HA.class "ew-bg-base-aux/30"
                , HA.class "ew-h-1 -ew-mt-0.5"
                ]
                []
            , -- Value Track Background
              H.div
                [ HA.class "ew-absolute ew-z-1 ew-rounded"
                , HA.class "ew-left-0 ew-top-1/2"
                , HA.class "ew-bg-base-bg"
                , HA.class "ew-h-[6px] -ew-mt-[3px]"
                , HA.style "width" valueString
                ]
                []
            , -- Value Track
              H.div
                [ HA.class "ew-absolute ew-z-0 ew-rounded"
                , HA.class "ew-left-0 ew-top-1/2"
                , HA.class "ew-bg-current"
                , HA.class "ew-opacity-[0.60]"
                , HA.class "ew-h-[6px] -ew-mt-[3px]"
                , HA.style "width" valueString
                ]
                []
            , -- Value Ring
              H.div
                [ HA.class "ew-absolute ew-rounded-full"
                , HA.class "ew-top-1/2"
                , HA.class "ew-bg-current"
                , HA.class "ew-opacity-20"
                , HA.class "ew-h-10 ew-w-10 -ew-ml-5 -ew-mt-5"
                , HA.class "ew-scale-0 ew-transition-transform"
                , HA.style "left" valueString
                , HA.classList
                    [ ( "group-hover:ew-scale-90"
                            ++ " group-focus-within:ew-scale-100"
                            ++ " group-hover:group-focus-within:ew-scale-100"
                      , not attrs.disabled && not attrs.readOnly
                      )
                    ]
                ]
                []
            ]
        , -- Thumb
          H.input
            (attrs.htmlAttributes
                ++ [ HA.class "ew-relative"
                   , HA.class "ew-slider ew-appearance-none"
                   , HA.class "ew-bg-transparent"
                   , HA.class "ew-m-0 ew-w-full"
                   , HA.class "focus-visible:ew-outline-0"
                   , HA.type_ "range"
                   , colorAttr

                   -- This is a fallback since range elements will not respect read only attributes
                   , HA.disabled (attrs.disabled || attrs.readOnly)
                   , HA.readonly attrs.readOnly

                   --
                   , HA.value <| String.fromFloat props.value
                   , HA.min <| String.fromFloat props.min
                   , HA.max <| String.fromFloat props.max
                   , HA.step <| String.fromFloat props.step
                   , HE.on "input"
                        (D.at [ "target", "value" ] D.string
                            |> D.andThen
                                (\v ->
                                    case String.toFloat v of
                                        Just v_ ->
                                            D.succeed v_

                                        Nothing ->
                                            D.fail "Invalid value."
                                )
                            |> D.map props.onInput
                        )
                   ]
            )
            []
        ]
