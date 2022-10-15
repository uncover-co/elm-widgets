module W.InputSlider exposing
    ( view
    , id, color, disabled, readOnly
    , Attribute
    )

{-|

@docs view
@docs id, color, disabled, readOnly
@docs Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import Theme
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes -> Attributes)


type alias Attributes =
    { id : Maybe String
    , disabled : Bool
    , readOnly : Bool
    , color : String
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
    , color = Theme.primaryForeground
    , format = String.fromFloat
    }



-- Attributes : Setters


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


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
            applyAttrs attrs_ |> Debug.log ""

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
                , HA.class "ew-opacity-[0.55]"
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
                , HA.class "group-focus-within:ew-scale-100"
                , HA.style "left" valueString
                ]
                []
            ]
        , -- Thumb
          H.input
            [ WH.maybeAttr HA.id attrs.id
            , HA.class "ew-relative"
            , HA.class "ew-slider ew-appearance-none"
            , HA.class "ew-bg-transparent"
            , HA.class "ew-m-0 ew-w-full"
            , HA.class "focus:ew-outline-0"
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
            []
        ]
