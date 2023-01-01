module W.InputField exposing
    ( view, hint
    , alignRight
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view, hint


# Styles

@docs alignRight


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { alignRight : Bool
    , hint : Maybe (List (H.Html msg))
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { alignRight = False
    , hint = Nothing
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
alignRight : Bool -> Attribute msg
alignRight v =
    Attribute <| \attrs -> { attrs | alignRight = v }


{-| Appears underneath the label.
-}
hint : List (H.Html msg) -> Attribute msg
hint v =
    Attribute <| \attrs -> { attrs | hint = Just v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- View


{-| -}
view :
    List (Attribute msg)
    ->
        { label : List (H.Html msg)
        , input : List (H.Html msg)
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.section
        (HA.class "ew-p-4 ew-bg-base-bg ew-font-text"
            :: attrs.htmlAttributes
        )
        [ H.div
            [ HA.classList [ ( "ew-flex ew-items-start ew-justify-between", attrs.alignRight ) ]
            ]
            [ H.div
                [ HA.classList
                    [ ( "ew-w-[40%] ew-pr-4 ew-pt-1", attrs.alignRight )
                    , ( "ew-pb-2", not attrs.alignRight )
                    ]
                ]
                [ H.h1
                    [ HA.class "ew-m-0 ew-font-normal ew-text-sm ew-font-text ew-text-base-fg"
                    ]
                    props.label
                , attrs.hint
                    |> Maybe.map (\f -> H.p [ HA.class "ew-m-0 ew-text-base-aux ew-text-xs ew-font-text ew-text-aux" ] f)
                    |> Maybe.withDefault (H.text "")
                ]
            , H.div
                [ HA.classList [ ( "ew-w-[60%]", attrs.alignRight ) ]
                ]
                props.input
            ]
        ]
