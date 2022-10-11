module W.InputSlider exposing
    ( view
    , id, theme, disabled, readOnly
    , Attribute
    )

{-|

@docs view
@docs id, theme, disabled, readOnly
@docs Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import ThemeSpec
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes -> Attributes)


type alias Attributes =
    { id : Maybe String
    , disabled : Bool
    , readOnly : Bool
    , theme : { color : String, shadow : String }
    , format : Float -> String
    }


applyAttrs : List (Attribute msg) -> Attributes
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes
defaultAttrs =
    { id = Nothing
    , disabled = False
    , readOnly = False
    , theme =
        { color = ThemeSpec.primary.bg
        , shadow = "rgb(" ++ ThemeSpec.primary.bgChannels ++ " / 0.2)"
        }
    , format = String.fromFloat
    }



-- Attributes : Setters


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
theme : { color : String, shadow : String } -> Attribute msg
theme v =
    Attribute <| \attrs -> { attrs | theme = v }


{-| -}
disabled : Bool -> Attribute msg
disabled v =
    Attribute <| \attrs -> { attrs | disabled = v }


{-| -}
readOnly : Bool -> Attribute msg
readOnly v =
    Attribute <| \attrs -> { attrs | readOnly = v }



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
        attrs : Attributes
        attrs =
            applyAttrs attrs_
    in
    H.div [ HA.class "ew ew-slider-wrapper" ]
        [ H.div [ HA.class "ew ew-slider-value-wrapper" ]
            [ H.p
                [ HA.class "ew ew-slider-bounds ew-m-min" ]
                [ H.text <| attrs.format props.min ]
            , H.p
                [ HA.class "ew ew-slider-value"
                ]
                [ H.text <| attrs.format props.value ]
            , H.p
                [ HA.class "ew ew-slider-bounds ew-m-max" ]
                [ H.text <| attrs.format props.max ]
            ]
        , H.input
            [ WH.maybeAttr HA.id attrs.id
            , HA.class "ew ew-slider"
            , HA.classList [ ( "ew-m-read-only", attrs.readOnly ) ]
            , HA.type_ "range"

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
            , WH.stylesList
                [ ( "--color", attrs.theme.color, not attrs.disabled )
                , ( "--shadow", attrs.theme.shadow, not attrs.disabled )
                , ( "--color", "var(--theme-base-aux)", attrs.disabled )
                ]
            ]
            []
        ]
