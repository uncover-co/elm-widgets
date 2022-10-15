module W.Tooltip exposing
    ( block
    , class
    , htmlAttrs
    , id
    , slow
    , view
    )

import Html as H
import Html.Attributes as HA
import W.Internal.Helpers as WH



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { id : Maybe String
    , class : String
    , htmlAttributes : List (H.Attribute msg)
    , slow : Bool
    , block : Bool
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { id = Nothing
    , class = ""
    , htmlAttributes = []
    , slow = False
    , block = False
    }



-- Attributes : Setters


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
class : String -> Attribute msg
class v =
    Attribute <| \attrs -> { attrs | class = v }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
slow : Bool -> Attribute msg
slow v =
    Attribute <| \attrs -> { attrs | slow = v }


{-| -}
block : Bool -> Attribute msg
block v =
    Attribute <| \attrs -> { attrs | block = v }



-- Main


view :
    List (Attribute msg)
    ->
        { tooltip : List (H.Html msg)
        , children : List (H.Html msg)
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_
    in
    H.span
        [ HA.class "ew-group ew-relative ew-inline-flex ew-flex-col ew-items-center"
        , HA.classList [ ( "ew-flex", attrs.block ) ]
        ]
        [ H.span
            [ HA.class "ew-tooltip ew-absolute ew-pointer-events-none ew-bottom-full"
            , HA.class "ew-mb-1"
            , HA.class "ew-opacity-0 group-hover:ew-opacity-100"
            , HA.class "ew-translate-y-0.5 group-hover:ew-translate-y-0"
            , HA.class "ew-transition"
            , HA.classList
                [ ( "group-hover:ew-delay-500", not attrs.slow )
                , ( "group-hover:ew-delay-1000", attrs.slow )
                ]
            , HA.class "ew-px-2 ew-py-1 ew-rounded"
            , HA.class "ew-font-text ew-text-xs"
            , HA.class "ew-bg-neutral-bg ew-text-neutral-aux"
            ]
            props.tooltip
        , H.span [ HA.classList [ ( "ew-block", attrs.block ) ] ]
            props.children
        ]
